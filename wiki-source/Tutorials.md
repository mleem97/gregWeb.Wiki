# Tutorials — How to implement it

Task-oriented recipes: pick your goal, follow the steps, check the
result. For full language tracks see [[Guidebook]]; for concepts see
the [[Glossary]].

## Set up VS Code for modding

**Goal:** IntelliSense, snippets and one-click linting while you write.

1. Install the extension *gregCore Mod Tools* (`mleem97`,
   [repo](https://github.com/mleem97/gregVscode)) — requires
   VS Code 1.93+.
2. Lua: open any `main.lua` — `greg.*` completions, hover docs and
   lifecycle snippets work immediately, no setup.
3. JS: run *GregCore: Setup JS IntelliSense* inside your mod folder
   — it copies the bundled `greg.d.ts` and writes `jsconfig.json`
   so the built-in TS server completes the `greg` object.
4. Optional but recommended: install the
   [`greglint` binary](https://github.com/mleem97/gregLint) and put
   it on `PATH` (setting `gregcore.greglintPath` overrides the path).
5. Verify: type `greg.player.` in a Lua file — you should see
   `money`, `teleport`, … with docs. See [[Guidebook Prerequisites]]
   for the game-side setup.

## Scaffold your first mod

**Goal:** a runnable mod folder in under a minute.

1. Run *GregCore: New Lua Mod…* (or JS/Rust), pick the target
   folder, enter a lowercase mod id.
2. Lua lands in `UserData/gregCore/Mods/Lua/<modId>/` with
   `main.lua` + `mod.json`; JS in `Mods/JS/<modId>/`; Rust as a
   cargo crate (build to `<game>/UserLibs/Rust/<modId>.dll`).
3. Launch the game, open the backquote console, run `mods` — your
   mod is listed. Press F1 to see it in the Mod Hub.
4. Details: [[Guidebook Lua 01 First Mod]], [[Guidebook JS 01 Setup]],
   [[Guidebook Rust 01 Setup]].

## Test and lint before you release

**Goal:** catch broken mods before they touch the game.

1. Run `greglint` on your mod folder (or game `Mods/`):
   `greglint --severity-floor warning Mods/` — exit `0` is clean.
2. In VS Code: *GregCore: Lint Mod* shows the same findings in the
   Problems panel; *GregCore: Audit Mod / Project* checks configs,
   JSON, changelogs and missing files without any binary.
3. Fix what is reported (`--fix` normalizes `mod.json` with a
   `.bak` backup; IL findings stay manual, each carries a fix hint).
4. Gate releases in CI with `--format json` (deterministic output).
5. Details: [[Developer GregLint]].

## Add a custom shop item

**Goal:** sell your own hardware in the vanilla shop.

1. Register it (C#): `ShopAPI.RegisterItem(new CustomShopItem
   { Name, Price, TemplateType, TemplateID, Category, ... })` —
   injection, layout, cart stacking and checkout are handled
   (`greg.CommonShop`, no manual UI cloning).
2. Optional: `BackgroundColor` (card tint), `Icon`, `CustomPrefab`,
   `OnBuy` (purchase callback), `OnUIReady` (tweak the card),
   `OnCheckout(quantity)`, `ResultItemID` for stable custom IDs.
3. Use high, stable, never-reused IDs; custom enum values are
   claimed persistently with cross-mod collision protection.
4. Verify: open the Computer Shop, find your card in its category,
   buy it, check out, reload the save.
5. Details: [[Developer Shop Items]] · meshes:
   [[Guidebook Modelling Shop Item]].

## Save and rebuy custom colors

**Goal:** keep that perfect paint job available forever.

1. Buy any item with a custom color from the color picker — the
   preset is saved automatically
   (`UserData/gregCore/CustomItemPresets.json`).
2. Reopen the shop: your preset sits in the `Mods` category with
   its color and price (buyable only once the base item is
   unlocked — locked presets are greyed out).
3. Buying a preset puts the colored variant in the cart; plain
   buys next to custom cart lines stay plain.
4. Details: [[Developer Shop Items]].

## Enable and disable mods without deleting

**Goal:** switch mods off (and back on) safely.

1. Move the mod file or folder into a `.deactivated` folder next
   to it (e.g. `Mods/.deactivated/MyMod.dll`); to re-enable, move
   it back out. Restart the game afterwards.
2. Nothing is ever loaded from `.deactivated` — a disabled mod is
   fully inert. Only gregCore moves files, and only on your action.
3. If a moved mod still loads, a second active copy exists
   somewhere — search the folders for duplicates.
4. Details: [[Player Mod Users Guide]] · terms: [[Glossary]].

## Ship a mod pack

**Goal:** distribute a curated set as one unit.

1. Add `Mods/manifest.json`: `{ "Name": ..., "Mods": [...],
   "Library": [...], "Plugins": [...] }`, paths relative to `Mods/`.
2. Rules: `.dll` only, no path traversal, never anything under
   `.deactivated`. `Library` folders feed dependency probing.
   Validate with `greglint` (GL103) before shipping.
3. Details: [[Glossary]] (modpack manifest) · release flow:
   [[Guidebook Release]] · publishing: [[Developer Publishing]].

## Debug a broken mod

**Goal:** find the failing line fast.

1. Reproduce once, note game/framework/loader versions
   (console `` ` `` → `version`, `mods`).
2. Read the loader log top-down: registration → `[DynamicPatcher]`
   → your lines → first error. Lua runtime errors show as
   `[LuaMod:<id>]`, JS as `[gregCore][JS] <modId>/<file>`.
3. Shrink it: F12 REPL for Lua (`greg.*` live calls), minimal
   hook subscription, `greg.ui.log_info` checkpoints.
4. Lua edits hot-reload on save; JS applies on next main-menu
   entry; C# needs rebuild + restart.
5. Still stuck: [[FAQ Troubleshooting]] → mod tracker (single mod)
   or gregCore tracker (Hub/HUD/saves). Details:
   [[Guidebook Debugging]].

## Publish your mod

**Goal:** from working mod to Workshop release.

1. Checklist: unique id, `mod.json`/`[GregMod]` complete, save
   round-trip tested (save → load → remove mod → vanilla loads),
   co-op scope documented, diagnostics green.
2. Version with SemVer; never reuse shop/item IDs or GUIDs; keep
   `min_framework_version` accurate.
3. Package per language, write the README (install, settings,
   events, hotkeys), update `CHANGELOG.md` (Unreleased).
4. Release on GitHub; Workshop releases join the
   [GregCore Collection](https://steamcommunity.com/sharedfiles/filedetails/?id=3701575419).
5. Details: [[Guidebook Release]] · [[Developer Publishing]].
