import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Reading, Warm } from '../types'

// Spec 005 · Token meter mod. Design: docs/designs/token-meter-ui/design-system.md

const T = {
  bg: '#181613',
  track: '#373532',
  text: '#f3f1ee',
  muted: '#aeaaa5',
  normal: '#4eb068',
  warning: '#f4af41',
  danger: '#ff6870',
  tick: '#f9f8f6',
  toggleOn: '#c1bdb8',
  toggleOff: '#44423f',
  toggleOffBorder: '#898581',
  togglePaused: '#78746f',
  knobOn: '#181613',
  knobOff: '#ffffff',
}

const MIN = 60_000
const WINDOW_MS = { five_hour: 300 * MIN, seven_day: 7 * 24 * 60 * MIN }
const CACHE_MS = 5 * MIN // the main loop reports no cache lifetime; spec 005 fallback
const PING_LEAD_MS = 30_000
const IDLE_STOP_MS = 60 * MIN
const RETRY_MS = 15_000 // inside the 30 s lead, so a retry still finds the cache warm
const PAUSE_AT = 95
const TICK_MS = 5_000
const PERSON_ORIGINS = new Set(['composer', 'bridge', 'sdk'])
const PING_PROMPT =
  'Keep-alive ping from the token meter mod. You have no tools. Reply with the single word: ok'

const FRESH: Warm = {
  mode: 'off',
  lastPromptAt: 0,
  lastRequestAt: 0,
  isPinging: false,
  failedAt: null,
  retryAt: null,
  isIdleStopped: false,
  isTurnRunning: false,
  pings: { count: 0, lastUsd: 0, totalUsd: 0 },
}

const readings = atom({ plugin: 'token-meter', key: 'readings' } as const, [] as Reading[])
const warm = atom({ plugin: 'token-meter', key: 'warm' } as const, FRESH)
const tick = atom({ plugin: 'token-meter', key: 'tick' } as const, 0)

type Gauge = {
  kind: Reading['kind']
  pct: number | null
  pace: number | null
  resetsInMs: number | null
  resetsAt: Date | null
}

export const gaugeOf = (kind: Reading['kind'], all: Reading[], now: number): Gauge => {
  const r = all.find(x => x.kind === kind)
  if (!r) return { kind, pct: null, pace: null, resetsInMs: null, resetsAt: null }
  const at = r.resetsAt ? Date.parse(r.resetsAt) : NaN
  if (Number.isNaN(at)) return { kind, pct: r.percentUsed, pace: null, resetsInMs: null, resetsAt: null }
  const left = Math.max(0, at - now)
  const pace = Math.min(100, Math.max(0, ((WINDOW_MS[kind] - left) / WINDOW_MS[kind]) * 100))
  return { kind, pct: r.percentUsed, pace, resetsInMs: left, resetsAt: new Date(at) }
}

export const colourOf = (pct: number | null) =>
  pct === null || pct < 70 ? T.normal : pct < 90 ? T.warning : T.danger

export const aheadOf = (g: Gauge) =>
  g.pct !== null && g.pace !== null && g.pct - g.pace > 5 ? Math.round(g.pct - g.pace) : null

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (n: number) => String(n).padStart(2, '0')

export const resetText = (g: Gauge, isShort = false) => {
  if (g.resetsInMs === null || g.resetsAt === null) return ''
  if (g.resetsInMs < 24 * 60 * MIN) {
    const m = Math.ceil(g.resetsInMs / MIN)
    return m >= 60 ? `${Math.floor(m / 60)}h ${pad(m % 60)}m` : `${m}m`
  }
  const day = DAYS[g.resetsAt.getDay()] ?? ''
  return isShort ? day : `${day} ${pad(g.resetsAt.getHours())}:${pad(g.resetsAt.getMinutes())}`
}

const spoken = (ms: number) => {
  const m = Math.ceil(ms / MIN)
  const h = Math.floor(m / 60)
  const parts = [h ? `${h} hour${h === 1 ? '' : 's'}` : '', m % 60 ? `${m % 60} minute${m % 60 === 1 ? '' : 's'}` : '']
  return parts.filter(Boolean).join(' ') || '0 minutes'
}

export const altOf = (g: Gauge) => {
  const name = g.kind === 'five_hour' ? '5-hour window' : 'Weekly window'
  if (g.pct === null) return `${name}: no reading yet`
  const a = aheadOf(g)
  const pace = a === null ? 'on pace' : `${a} points ahead of pace`
  const reset = g.resetsInMs === null ? '' : `, resets in ${spoken(g.resetsInMs)}`
  return `${name} ${g.pct}% used, ${pace}${reset}`
}

export const ringSvg = (g: Gauge, size: number) => {
  const sw = 3
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  const cx = size / 2
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
  s += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${T.track}" stroke-width="${sw}"/>`
  if (g.pct) {
    const len = (c * Math.min(g.pct, 100)) / 100
    s += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${colourOf(g.pct)}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${len.toFixed(2)} ${c.toFixed(2)}" transform="rotate(-90 ${cx} ${cx})"/>`
  }
  const pace = g.pace
  if (pace !== null) {
    const a = ((pace * 3.6 - 90) * Math.PI) / 180
    const p = (d: number) => [(cx + (r + d) * Math.cos(a)).toFixed(2), (cx + (r + d) * Math.sin(a)).toFixed(2)]
    const [x1, y1] = p(-sw)
    const [x2, y2] = p(sw)
    const line = (stroke: string, w: number) =>
      `<line data-pace="${pace.toFixed(1)}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`
    s += line(T.bg, 4.5) + line(T.tick, 1.5)
  }
  return s + '</svg>'
}

export const switchSvg = (w: Warm, isDisabled: boolean, isPhone: boolean) => {
  const [wd, ht] = isPhone ? [34, 20] : [26, 15]
  const k = ht - 4
  const isOn = w.mode !== 'off'
  const track = w.mode === 'on' ? T.toggleOn : w.mode === 'paused' ? T.togglePaused : T.toggleOff
  const border = isOn ? '' : ` stroke="${T.toggleOffBorder}" stroke-width="1"`
  const kx = isOn ? wd - 2 - k : 2
  const opacity = isDisabled ? ' opacity="0.4"' : ''
  const knobOpacity = w.isPinging ? ' fill-opacity="0.6"' : ''
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${wd}" height="${ht}" viewBox="0 0 ${wd} ${ht}"${opacity}>` +
    `<rect x="0.5" y="0.5" width="${wd - 1}" height="${ht - 1}" rx="${(ht - 1) / 2}" fill="${track}"${border}/>` +
    `<circle cx="${kx + k / 2}" cy="${ht / 2}" r="${k / 2}" fill="${isOn ? T.knobOn : T.knobOff}"${knobOpacity}/></svg>`
  )
}

export const usd = (x: number) => `$${x < 0.01 ? x.toFixed(3) : x.toFixed(2)}`
const offIn = (w: Warm, now: number) => Math.max(1, Math.ceil((w.lastPromptAt + IDLE_STOP_MS - now) / MIN))

export const warmText = (w: Warm, now: number, hasReading: boolean, isShort = false) => {
  if (!hasReading) return { text: 'Starts after your first reply', isError: false }
  if (w.mode === 'paused') return { text: isShort ? 'Paused' : 'Paused at 5h limit (95%+)', isError: false }
  if (w.mode === 'off') {
    return w.isIdleStopped
      ? { text: `Turned off after 60 min idle · ${usd(w.pings.totalUsd)} est.`, isError: false }
      : { text: '', isError: false }
  }
  const off = `off in ${offIn(w, now)} min`
  if (w.isPinging) return { text: isShort ? 'pinging…' : `pinging… · ${off}`, isError: false }
  if (w.failedAt !== null) {
    const more = w.retryAt !== null ? 'retrying' : 'waiting for your next reply'
    return { text: isShort ? 'Ping failed' : `Ping failed · ${more} · ${off}`, isError: true }
  }
  if (isCold(w, now)) return { text: isShort ? '' : `waiting for your next reply · ${off}`, isError: false }
  if (isShort || w.pings.count === 0) return { text: isShort ? '' : off, isError: false }
  return { text: `${usd(w.pings.lastUsd)} per ping · ${usd(w.pings.totalUsd)} so far, est. · ${off}`, isError: false }
}

export const labelOf = (w: Warm, now: number) =>
  w.mode === 'on'
    ? `Keep warm, on, turns off in ${offIn(w, now)} minutes`
    : w.mode === 'paused'
      ? 'Keep warm, paused at the 5-hour limit'
      : 'Keep warm, off'

// The cache is cold once its lifetime has passed, or when there is nothing to keep warm yet.
// Pinging a cold cache rewrites the whole conversation, so the mod waits for the next reply instead.
export const isCold = (w: Warm, now: number) => w.lastRequestAt === 0 || now >= w.lastRequestAt + CACHE_MS

const fiveHour = (all: Reading[]) => all.find(r => r.kind === 'five_hour')?.percentUsed ?? null

let timer: { cancel: () => void } | null = null

// A hot reload stops the interval but keeps $.state, so any hook may restart it.
function ensureTimer($: any) {
  if (!timer) timer = $.clock.every(TICK_MS, () => void check($))
}

async function ping($: any, isRetry: boolean) {
  await update($, warm, (w: Warm) => ({ ...w, isPinging: true, retryAt: isRetry ? null : w.retryAt }))
  const before = (await $.session.usage()).cost?.usd ?? 0
  const r = await $.model.fork({ prompt: PING_PROMPT })
  const now = await $.clock.now()
  if (r.isAnswered) {
    const after = (await $.session.usage()).cost?.usd ?? before
    const cost = Math.max(0, after - before)
    await update($, warm, (w: Warm) => ({
      ...w,
      isPinging: false,
      lastRequestAt: now,
      failedAt: null,
      retryAt: null,
      pings: { count: w.pings.count + 1, lastUsd: cost, totalUsd: w.pings.totalUsd + cost },
    }))
  } else if (r.reason === 'nothing-to-fork') {
    await update($, warm, (w: Warm) => ({ ...w, isPinging: false, lastRequestAt: 0 }))
  } else {
    // First failure: one retry. Failed retry: stop and wait for the next reply.
    await update($, warm, (w: Warm) => ({
      ...w,
      isPinging: false,
      failedAt: now,
      retryAt: isRetry ? null : now + RETRY_MS,
    }))
  }
}

async function check($: any) {
  const now = await $.clock.now()
  const w = await read($, warm)
  await update($, tick, (n: number) => n + 1)
  if (w.mode === 'off' || w.isPinging) return
  if (now >= w.lastPromptAt + IDLE_STOP_MS) {
    await update($, warm, (x: Warm): Warm => ({ ...x, mode: 'off', isIdleStopped: true, failedAt: null, retryAt: null }))
    return
  }
  if (w.mode !== 'on' || w.isTurnRunning || isCold(w, now)) return
  if (w.retryAt !== null) return now >= w.retryAt ? ping($, true) : undefined
  if (w.failedAt === null && now >= w.lastRequestAt + CACHE_MS - PING_LEAD_MS) return ping($, false)
}

async function flipWarm($: any) {
  const all = await read($, readings)
  if (all.length === 0) return
  const t = await $.clock.now()
  await update($, warm, (x: Warm): Warm => {
    if (x.mode !== 'off') return { ...x, mode: 'off', failedAt: null, retryAt: null }
    const f = fiveHour(all)
    return {
      ...x,
      mode: f !== null && f >= PAUSE_AT ? 'paused' : 'on',
      lastPromptAt: Math.max(x.lastPromptAt, t),
      isIdleStopped: false,
    }
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    timer?.cancel()
    timer = null
    await update($, warm, () => FRESH)
    await update($, readings, () => [])
    ensureTimer($)
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    const all = e.rateLimits
      .filter(r => r.kind === 'five_hour' || r.kind === 'seven_day')
      .map(r => ({ kind: r.kind as Reading['kind'], percentUsed: r.percentUsed, resetsAt: r.resetsAt }))
    ensureTimer($)
    await update($, readings, () => all)
    const five = fiveHour(all)
    await update($, warm, (w: Warm): Warm =>
      w.mode === 'on' && five !== null && five >= PAUSE_AT
        ? { ...w, mode: 'paused' }
        : w.mode === 'paused' && (five === null || five < PAUSE_AT)
          ? { ...w, mode: 'on' }
          : w,
    )
    return next(e)
  })

  // Only a person's own message counts as activity, not a scheduled or relayed prompt.
  on('prompt.submit', async ($, e, next) => {
    if (e.isMeta || !PERSON_ORIGINS.has(e.origin.kind)) return next(e)
    const now = await $.clock.now()
    await update($, warm, w => ({ ...w, lastPromptAt: now, isIdleStopped: false }))
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (!e.agentId) await update($, warm, (w: Warm) => ({ ...w, isTurnRunning: true }))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (!e.agentId) {
      const now = await $.clock.now()
      await update($, warm, (w: Warm) => ({
        ...w,
        isTurnRunning: false,
        lastRequestAt: now,
        failedAt: null,
        retryAt: null,
      }))
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    await read($, tick)
    const now = await $.clock.now()
    const all = await read($, readings)
    const w = await read($, warm)
    const five = gaugeOf('five_hour', all, now)
    const week = gaugeOf('seven_day', all, now)
    const hasReading = five.pct !== null || week.pct !== null
    const els = $.ui.resolve(e) as any
    const { Box, Text, Button } = els

    ensureTimer($)
    const press = () => flipWarm($)

    if (e.surface === 'terminal' || !els.Svg) {
      const part = (label: string, g: Gauge) => {
        if (g.pct === null) return `${label} –`
        const a = aheadOf(g)
        const rs = g.kind === 'five_hour' ? resetText(g).replace(' ', '') : ''
        return [label, `${g.pct}%`, a === null ? '' : `▲${a}`, rs].filter(Boolean).join(' ')
      }
      const warmPart =
        w.mode === 'on' ? `warm on ${usd(w.pings.totalUsd)} est.` : w.mode === 'paused' ? 'warm paused' : 'warm off'
      return (
        <Box>
          <Text>{`${part('5h', five)} · ${part('wk', week)} · ${warmPart}`}</Text>
          <Button key="keep-warm" label={labelOf(w, now)} onPress={press} />
        </Box>
      )
    }

    const { Svg } = els
    const isPhone = e.surface === 'mobile'
    const ringSize = isPhone ? 24 : 20

    const gauge = (g: Gauge, label: string, isShortReset: boolean) => {
      const col = colourOf(g.pct)
      const a = aheadOf(g)
      const value = g.pct === null ? '–' : g.pct >= 100 ? (isPhone ? 'Limit' : 'Limit reached') : `${g.pct}%`
      const strong = g.pct !== null && g.pct >= 70
      return (
        <Box key={g.kind} flexDirection="row" alignItems="center" gap={1}>
          <Svg source={ringSvg(g, ringSize)} alt={altOf(g)} width={ringSize} height={ringSize} />
          <Text color={T.muted}>{label}</Text>
          <Text color={g.pct === null ? T.muted : col} weight={strong ? 'semibold' : 'medium'} tabular>
            {value}
          </Text>
          {a === null || g.pct === null || g.pct >= 100 ? null : (
            <Text color={col} weight="medium" tabular>{`▲${a}`}</Text>
          )}
          {g.pct === null ? null : <Text color={T.muted} tabular>{resetText(g, isShortReset)}</Text>}
        </Box>
      )
    }

    const status = warmText(w, now, hasReading, isPhone)
    const toggle = (
      <Box key="warm" flexDirection="row" alignItems="center" gap={1}>
        <Svg
          source={switchSvg(w, !hasReading, isPhone)}
          alt={w.mode === 'off' ? 'Switch off' : w.mode === 'paused' ? 'Switch on, paused' : 'Switch on'}
          width={isPhone ? 34 : 26}
          height={isPhone ? 20 : 15}
        />
        <Button key="keep-warm" plain label={labelOf(w, now)} onPress={press}>
          <Text color={w.mode === 'on' && hasReading ? T.text : T.muted}>Keep warm</Text>
        </Button>
        {status.text ? <Text color={status.isError ? T.danger : T.muted}>{status.text}</Text> : null}
      </Box>
    )

    if (isPhone) {
      const right =
        w.mode === 'on'
          ? w.failedAt !== null
            ? w.retryAt !== null
              ? 'retrying'
              : 'waits for reply'
            : `off in ${offIn(w, now)} min`
          : w.mode === 'paused'
            ? 'at 5h limit'
            : w.isIdleStopped
              ? 'Off after 60 min idle'
              : ''
      const tight = aheadOf(five) !== null && aheadOf(week) !== null
      return (
        <Box flexDirection="column" backgroundColor={T.bg} paddingX={1}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            {gauge(five, '5h', false)}
            {gauge(week, 'Wk', tight)}
          </Box>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" minHeight={2}>
            {toggle}
            {right ? <Text color={T.muted}>{right}</Text> : null}
          </Box>
          {w.pings.count > 0 ? (
            <Text color={T.muted}>
              {w.isIdleStopped
                ? `${usd(w.pings.totalUsd)} est. this session`
                : `${usd(w.pings.lastUsd)} per ping · ${usd(w.pings.totalUsd)} so far, est.`}
            </Text>
          ) : null}
        </Box>
      )
    }

    return (
      <Box flexDirection="row" alignItems="center" gap={2} backgroundColor={T.bg} paddingX={1}>
        {gauge(five, '5h', false)}
        {gauge(week, 'Week', false)}
        <Box flexGrow={1} />
        {toggle}
      </Box>
    )
  })
}
