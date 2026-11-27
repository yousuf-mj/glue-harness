import { expect, mock, test } from 'claude-code/testing'

const MIN = 60_000
const T0 = Date.parse('2026-11-27T10:00:00Z')
const GREEN = '#4eb068'
const AMBER = '#f4af41'
const RED = '#ff6870'

const BAND = (surface: 'desktop' | 'mobile' | 'terminal' | 'vscode') =>
  ({
    plugin: 'token-meter',
    surface,
    component: 'AbovePrompt',
    props: {
      hasSurvey: false,
      isCollapsed: false,
      isWorking: false,
      maxRows: 10,
      bodyColumns: 100,
      scroll: { offset: 0, bodyRows: 10 },
      view: {},
      rows: [],
    },
  }) as any

type Fork = { isAnswered: true; text: string; usage: any } | { isAnswered: false; reason: string; [k: string]: unknown }

const OK: Fork = {
  isAnswered: true,
  text: 'ok',
  usage: { input_tokens: 5, output_tokens: 1, cache_read_input_tokens: 9000, cache_creation_input_tokens: 0 },
}

// Stands in for the engine beneath the mod.
const world = ($: any, on: any, opts: { fork?: () => Fork; costPerFork?: number } = {}) => {
  const clock = mock.clock(on, { now: T0 })
  let usd = 0
  const forks: number[] = []
  on('session.start', (_: any, e: any) => ({ cwd: e.cwd }))
  on('session.measure', (_: any, e: any) => ({ changed: e.changed }))
  on('prompt.submit', (_: any, e: any) => ({ text: e.text }))
  on('turn.start', (_: any, e: any) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('session.usage', () => ({ value: { startedAt: T0, context: { window: 200000 }, rateLimits: [], cost: { usd } } }))
  on('model.fork', () => {
    forks.push(clock.now())
    const r = (opts.fork ?? (() => OK))()
    if (r.isAnswered) usd += opts.costPerFork ?? 0.003
    return { value: r }
  })
  return { clock, forks }
}

const iso = (ms: number) => new Date(ms).toISOString()
// A reading whose window is `elapsedPct` through, at the clock's time `now`.
const reading = (kind: 'five_hour' | 'seven_day', used: number, elapsedPct: number, now: number) => {
  const w = kind === 'five_hour' ? 300 * MIN : 7 * 24 * 60 * MIN
  return { kind, percentUsed: used, resetsAt: iso(now + w * (1 - elapsedPct / 100)) }
}

const start = async ($: any) => $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
const measure = async ($: any, rateLimits: unknown[]) =>
  $.session.measure({ context: { window: 200000 }, rateLimits, changed: ['rateLimits'] })
const turn = async ($: any, id = 't1') => {
  await $.prompt.submit({ text: 'hi', wait: false, origin: { kind: 'composer' } })
  await $.turn.start({ text: 'hi', turnId: id })
  await $.turn.complete({ answer: 'a', durationMs: 1, isAborted: false, turnId: id, reason: 'answer' })
}
const look = async ($: any, surface: 'desktop' | 'mobile' | 'terminal' = 'desktop') => $.ui.mount(BAND(surface))
const label = async ($: any) => {
  const ui = await look($)
  const b = await ui.find({ type: 'Button' })
  await ui.unmount()
  return b?.props.label
}
const hasText = async ($: any, text: string | RegExp, surface: 'desktop' | 'mobile' | 'terminal' = 'desktop') => {
  const ui = await look($, surface)
  const found = await ui.find({ type: 'Text', text })
  await ui.unmount()
  return found
}
const pressToggle = async ($: any) => {
  const ui = await look($)
  await ui.press({ key: 'keep-warm' })
  await ui.unmount()
}

test('T1 · AC-05.1: ring and % are green, amber, red, and "Limit reached" at 100', async ($, on) => {
  const { clock } = world($, on)
  await start($)
  for (const [used, colour, text] of [
    [42, GREEN, '42%'],
    [78, AMBER, '78%'],
    [93, RED, '93%'],
    [100, RED, 'Limit reached'],
  ] as const) {
    await measure($, [reading('five_hour', used, 50, clock.now()), reading('seven_day', 10, 50, clock.now())])
    const t = await hasText($, text)
    expect(t?.props.color).toBe(colour)
    const ui = await look($)
    const ring = await ui.find({ type: 'Svg' })
    expect(String(ring?.props.source)).toContain(`stroke="${colour}"`)
    await ui.unmount()
  }
  expect(await hasText($, /^Week$/)).toBeDefined()
  expect(await hasText($, /^Wk$/, 'mobile')).toBeDefined()
})

test('T2 · AC-05.2: pace tick, and ▲N only when more than 5 ahead', async ($, on) => {
  const { clock } = world($, on)
  await start($)
  // 5h is 14 ahead (▲14); the week is 3 ahead, inside the 5-point margin (no ▲).
  await measure($, [reading('five_hour', 78, 64, clock.now()), reading('seven_day', 44, 41, clock.now())])
  const ui = await look($)
  const rings = await ui.findAll({ type: 'Svg' })
  expect(String(rings[0].props.source)).toContain('data-pace="64.0"')
  expect(await ui.find({ type: 'Text', text: '▲14' })).toBeDefined()
  expect((await ui.findAll({ type: 'Text', text: /▲/ })).length).toBe(1)
  await ui.unmount()
})

test('T3 · AC-05.3: no reading shows "–", no tick, and a disabled toggle', async ($, on) => {
  world($, on)
  await start($)
  await measure($, [])
  const ui = await look($)
  expect((await ui.findAll({ type: 'Text', text: '–' })).length).toBe(2)
  const ring = await ui.find({ type: 'Svg' })
  expect(String(ring?.props.source)).not.toContain('data-pace')
  expect(await ui.find({ type: 'Text', text: 'Starts after your first reply' })).toBeDefined()
  await ui.press({ key: 'keep-warm' })
  await ui.unmount()
  expect(await label($)).toBe('Keep warm, off')
})

test('T4 · AC-05.4: pings once 30 s before the cache lapses, never mid-turn, off in a new session', async ($, on) => {
  const { clock, forks } = world($, on)
  await start($)
  await measure($, [reading('five_hour', 20, 10, clock.now())])
  await turn($)
  const t0 = clock.now()
  await pressToggle($)
  await clock.advance(4 * MIN + 25_000)
  expect(forks.length).toBe(0)
  await clock.advance(5_000)
  expect(forks).toEqual([t0 + 4 * MIN + 30_000])

  // A turn that is still running holds the ping.
  await $.prompt.submit({ text: 'hi', wait: false, origin: { kind: 'composer' } })
  await $.turn.start({ text: 'hi', turnId: 't2' })
  await clock.advance(10 * MIN)
  expect(forks.length).toBe(1)

  await start($)
  expect(await label($)).toBe('Keep warm, off')
})

test('T4b · AC-05.4: a cache that has already expired is not pinged; the mod waits for the next reply', async ($, on) => {
  const { clock, forks } = world($, on)
  await start($)
  await measure($, [reading('five_hour', 20, 10, clock.now())])
  await turn($)
  await clock.advance(10 * MIN)
  await pressToggle($)
  await clock.advance(10 * MIN)
  expect(forks.length).toBe(0)
  expect(await hasText($, /^waiting for your next reply · off in \d+ min$/)).toBeDefined()
  await turn($, 't2')
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(1)
})

test('T5 · AC-05.5: turns off 60 min after the last prompt; a new prompt restarts the hour', async ($, on) => {
  const { clock } = world($, on)
  await start($)
  await measure($, [reading('five_hour', 20, 10, clock.now())])
  await turn($)
  await pressToggle($)
  expect(await hasText($, 'off in 60 min')).toBeDefined()
  // A scheduled prompt is not activity: it does not restart the hour.
  await clock.advance(30 * MIN)
  await $.prompt.submit({ text: 'tick', wait: false, origin: { kind: 'scheduled-trigger' } })
  expect(await label($)).toBe('Keep warm, on, turns off in 30 minutes')
  await clock.advance(20 * MIN)
  await turn($, 't2')
  await clock.advance(11 * MIN)
  expect(await label($)).toBe('Keep warm, on, turns off in 49 minutes')
  await clock.advance(49 * MIN)
  expect(await label($)).toBe('Keep warm, off')
  expect(await hasText($, /^Turned off after 60 min idle · \$\d/)).toBeDefined()
})

test('T6 · AC-05.6: pauses at 95% of the 5-hour window, resumes below, press while paused turns it off', async ($, on) => {
  const { clock, forks } = world($, on)
  await start($)
  await measure($, [reading('five_hour', 50, 10, clock.now())])
  await turn($)
  await pressToggle($)
  await measure($, [reading('five_hour', 95, 90, clock.now())])
  expect(await label($)).toBe('Keep warm, paused at the 5-hour limit')
  expect(await hasText($, 'Paused at 5h limit (95%+)')).toBeDefined()
  await clock.advance(10 * MIN)
  expect(forks.length).toBe(0)
  await measure($, [reading('five_hour', 10, 2, clock.now())])
  expect(await label($)).toMatch(/^Keep warm, on/)
  // Resumed, but the cache went cold during the pause: no ping until the next reply.
  await clock.advance(5 * MIN)
  expect(forks.length).toBe(0)
  await turn($, 't2')
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(1)
  await measure($, [reading('five_hour', 96, 90, clock.now())])
  await pressToggle($)
  expect(await label($)).toBe('Keep warm, off')
})

test('T7 · AC-05.7: cost per ping and total; a failed ping retries once, then waits for the next reply', async ($, on) => {
  let isFailing = false
  const { clock, forks } = world($, on, {
    fork: () => (isFailing ? { isAnswered: false, reason: 'api-error', status: 500, error: 'server_error', usage: OK.usage } : OK),
  })
  await start($)
  await measure($, [reading('five_hour', 20, 10, clock.now())])
  await turn($)
  await pressToggle($)
  await clock.advance(4 * MIN + 30_000)
  expect(await hasText($, /^\$0\.003 per ping · \$0\.003 so far, est\. · off in \d+ min$/)).toBeDefined()

  isFailing = true
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(2)
  const failed = await hasText($, /^Ping failed · retrying · off in/)
  expect(failed?.props.color).toBe(RED)
  await clock.advance(15_000)
  expect(forks.length).toBe(3)
  expect(await hasText($, /^Ping failed · waiting for your next reply/)).toBeDefined()
  await clock.advance(10 * MIN)
  expect(forks.length).toBe(3)
  isFailing = false
  await turn($, 't2')
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(4)
})

test('T7b · AC-05.7: nothing to fork yet means no ping until the next reply', async ($, on) => {
  let isEmpty = true
  const { clock, forks } = world($, on, { fork: () => (isEmpty ? { isAnswered: false, reason: 'nothing-to-fork' } : OK) })
  await start($)
  await measure($, [reading('five_hour', 20, 10, clock.now())])
  await turn($)
  await pressToggle($)
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(1)
  await clock.advance(10 * MIN)
  expect(forks.length).toBe(1)
  isEmpty = false
  await turn($, 't2')
  await clock.advance(4 * MIN + 30_000)
  expect(forks.length).toBe(2)
})

test('T8 · AC-05.8: state in the toggle label, sentence alt on rings, one-line terminal text', async ($, on) => {
  const { clock } = world($, on)
  await start($)
  await measure($, [reading('five_hour', 78, 64, clock.now()), reading('seven_day', 34, 41, clock.now())])
  await turn($)
  expect(await label($)).toBe('Keep warm, off')
  await pressToggle($)
  expect(await label($)).toBe('Keep warm, on, turns off in 60 minutes')
  const ui = await look($)
  const rings = await ui.findAll({ type: 'Svg' })
  expect(rings[0].props.alt).toBe('5-hour window 78% used, 14 points ahead of pace, resets in 1 hour 48 minutes')
  await ui.unmount()
  expect(await hasText($, '5h 78% ▲14 1h48m · wk 34% · warm on $0.000 est.', 'terminal')).toBeDefined()
})
