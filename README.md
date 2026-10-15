<h1 align="center">achievement-unlocked</h1>

<p align="center">
  Gamifies Claude Code: pops a toast the first time you cross a real milestone,<br/>
  tracked for life across every session.
</p>

---

## Why this matters

Be honest: this doesn't make you ship faster. It isn't a productivity
tool, and it isn't pretending to be one.

What it does is turn a handful of real, already-happening milestones,
your first commit, your hundredth tool call, into a small "huh, nice"
instead of letting them pass unnoticed. That's attention and morale, not
velocity: a harmless bit of delight in a tool you otherwise stare at all
day.

**Honest limit:** there's no score to chase and no mechanic to grind.
Once you've seen every milestone once, that's it, for good.

## What it does

No fake points, no score to chase, just a handful of real firsts and round-number
milestones, each one toasted exactly once, ever:

- First turn, first tool call, first shell command, first file edit, first git
  commit, first subagent spawned
- 25 / 100 / 500 / 1000 turns total
- 100 / 1000 tool calls total

Lifetime counts, not per-session. Close Claude Code, come back tomorrow, the
counters pick up where they left off.

## Install

```
/plugin install achievement-unlocked --marketplace thisismairaj/achievement-unlocked
```

## How it works

Two hooks: `turn.complete` bumps a lifetime turn counter and checks it against
the turn milestones; `tool.call` wraps every tool call (`const res = await
next(e)`, so it runs after the real tool finished, not before) and bumps a
lifetime tool-call counter, plus checks for the tool-specific firsts - a `git
commit` is only unlocked on a command that actually succeeded.

Everything lives in `$.store`, a small JSON file this plugin owns, kept
between sessions and hot reloads. No network calls, no telemetry - just
counters and a list of which achievements have already fired, so nothing
repeats.

## Development

Built and iterated inside a live Claude Code session using a dev-mod's hot
reload - see [token-weather](https://github.com/thisismairaj/token-weather)
for more on that workflow. No build step; the hooks module runs directly as
TypeScript.

```bash
claude plugin validate .
```

## License

MIT
