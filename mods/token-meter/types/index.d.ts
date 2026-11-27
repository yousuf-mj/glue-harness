export type Reading = { kind: 'five_hour' | 'seven_day'; percentUsed: number; resetsAt?: string }
export type KeepWarm = 'off' | 'on' | 'paused'
export type Pings = { count: number; lastUsd: number; totalUsd: number }
export type Warm = {
  mode: KeepWarm
  lastPromptAt: number
  lastRequestAt: number
  isPinging: boolean
  failedAt: number | null
  retryAt: number | null
  isIdleStopped: boolean
  isTurnRunning: boolean
  pings: Pings
}

declare module 'claude-code' {
  interface PluginState {
    'token-meter': { readings: Reading[]; warm: Warm; tick: number }
  }
}
