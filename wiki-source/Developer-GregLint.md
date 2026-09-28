# Developer GregLint

Fully automated mod testing: static analysis (`GregLint`) plus the test
patterns behind it. No game, no Unity, no manual checklist — run it in
CI and ship with evidence.

## What it is

[`GregLint`](https://github.com/mleem97/gregLint) is a standalone repo
and console tool (net8.0, Mono.Cecil, offline). It never loads assemblies
— everything is Cecil read-only plus file checks — so it runs anywhere,
including CI runners without the game installed. Its test suite proves
the behavior (xunit + FluentAssertions, fixtures built in-memory with
the Cecil API: no compilation step, no game assemblies).

```bash
dotnet run --project GregLint -- /path/to/Mods
```

> Prefer the editor? The [VS Code extension](https://github.com/mleem97/gregVscode)
> runs the same checks via *GregCore: Lint Mod* (Problems panel) and adds
> an extension-native project audit (*GregCore: Audit Mod / Project*,
> no binary needed). Walkthrough: [[Tutorials]].

## Workflow for modders

1. **Lint before launch.** Point GregLint at your mod folder or the
   game `Mods/` dir. Exit `0` means clean; `1` means findings at or
   above your floor (`--severity-floor warning` in CI).
2. **Fix what it reports.** `mod.json` problems can auto-fix
   (`--fix` normalizes formatting with a `.bak` backup first).
   IL findings (GL001–GL007) are report-only by design: rewriting
   IL risks breaking signatures, so those stay manual — each
   finding carries a concrete fix hint.
3. **Gate the release.** `--format json` feeds dashboards; the output
   is deterministic (sorted), so identical inputs give identical
   reports — diff them across versions.

## The rules

IL rules catch what crashes games: `SetQualityLevel` tier stomping
(GL001), `OnGUI` on IL2CPP (GL002), non-bool Harmony prefixes
(GL003), unguarded patches (GL004), missing mod identity (GL005),
non-gregCore `.deactivated` moves (GL006), hard-coded
`.deactivated` paths (GL007). File rules enforce the directory
policy: top-level Melon mods (GL101), no active duplicates of
disabled mods (GL102), valid `Mods/manifest.json` (GL103), valid
`mod.json` (GL104) with name/version (GL105). Full catalog with
severities and fix hints: `GregLint/README.md` in the
[gregLint repo](https://github.com/mleem97/gregLint).

## Testing your own mod logic

Copy the GregLint.Tests pattern: pure logic (resolvers, registries,
parsers, DTOs) is fully unit-testable with xunit + FluentAssertions
+ NSubstitute — the same stack as `tests/`. Game-object behavior
(UToolkit layout, IL2CPP interop) stays behind thin seams so the
logic underneath remains testable without the game. If a method
needs Unity types to compile, split the decision (testable) from
the interop call (best-effort wrapper).

## Coverage

`GregLint.Tests` measures **99.05% line / 90.81% branch** (coverlet).
Every reachable line is covered; the 7 remaining lines are defensive
single-statements proven unreachable-by-construction — see the
coverage section in the gregLint repo `README.md` for the per-line
justification. Custom project rules plug into `Engine` (extra rule
lists) and inherit the per-rule failure isolation.
