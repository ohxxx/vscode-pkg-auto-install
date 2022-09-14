import type { TAGENTS } from './types'

export const AGENTS = ['npm', 'yarn', 'pnpm', 'bun'] as const

export const LOCKS: Record<TAGENTS, string> = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
  bun: 'bun.lockb',
}
