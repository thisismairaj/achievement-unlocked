import type { Register } from 'claude-code'

// Lifetime, cross-session counters and a list of achievement ids already
// shown, all in $.store (this plugin's own JSON file, survives every
// session and every hot reload). Never re-toasts the same achievement twice.

async function unlock($: any, id: string, text: string) {
  const unlocked = ((await $.store.get('unlocked')) as string[] | undefined) ?? []
  if (unlocked.includes(id)) return
  await $.store.set('unlocked', [...unlocked, id])
  $.ui.toast(`\u{1f3c6} ${text}`, { timeoutMs: 6000 })
}

async function bump($: any, key: string): Promise<number> {
  const n = (Number(await $.store.get(key)) || 0) + 1
  await $.store.set(key, n)
  return n
}

export const register: Register = on => {
  on('turn.complete', async ($, e, next) => {
    if (!e.agentId) {
      const turns = await bump($, 'totalTurns')
      if (turns === 1) await unlock($, 'turns-1', 'First turn. The journey begins.')
      if (turns === 25) await unlock($, 'turns-25', '25 turns in. Warming up.')
      if (turns === 100) await unlock($, 'turns-100', '100 turns. You live here now.')
      if (turns === 500) await unlock($, 'turns-500', '500 turns. Certified power user.')
      if (turns === 1000) await unlock($, 'turns-1000', '1000 turns. This is who you are now.')
    }
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const res = await next(e)

    try {
      const calls = await bump($, 'totalToolCalls')
      if (calls === 1) await unlock($, 'tools-1', 'First tool call ever.')
      if (calls === 100) await unlock($, 'tools-100', '100 tool calls.')
      if (calls === 1000) await unlock($, 'tools-1000', '1000 tool calls. A legend.')

      const succeeded = !(res && typeof res === 'object' && 'isError' in res && res.isError)

      if (e.tool === 'Bash') {
        await unlock($, 'first-bash', 'First shell command.')
        const command = (e as { command?: string }).command
        if (succeeded && typeof command === 'string' && /git\s+commit/.test(command)) {
          await unlock($, 'first-commit', 'First commit. Ship it.')
        }
      }
      if (e.tool === 'Edit' || e.tool === 'Write') {
        await unlock($, 'first-edit', 'First file edit.')
      }
      if (e.tool === 'Agent') {
        await unlock($, 'first-agent', 'Spawned your first subagent.')
      }
    } catch {
      // never let the achievement logic affect the real tool result
    }

    return res
  })
}
