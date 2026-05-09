# BugMode 🐛

> Context Engineering Layer for AI debugging.

BugMode is a local-first VSCode extension that transforms raw errors and stack traces into structured, optimized prompts for AI coding agents (Claude, Cursor, Codex, etc.).

## Why BugMode?

Pasting raw errors into AI tools gives poor results — missing context leads to generic answers. BugMode acts as a **context engineering layer** that:

- Parses and categorizes errors automatically
- Detects your runtime, framework, and project structure
- Identifies probable root causes and related files
- Generates precision-targeted prompts for your AI tool of choice

## Monorepo Structure

```
packages/
├── core-engine/     # Error analysis: parser, runtime/framework detector, categorizer
├── parsers/         # Project context extraction: package.json, file finder, architecture hints
├── prompt-builder/  # Prompt generation strategies: Claude, Cursor, Generic
└── extension/       # VSCode extension: commands, side panel, clipboard
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Or build individually
pnpm --filter @bugmode/core-engine build
pnpm --filter @bugmode/parsers build
pnpm --filter @bugmode/prompt-builder build
pnpm --filter bugmode build
```

## Using the Extension

### In VSCode

1. Open the repo in VSCode
2. Press `F5` to launch the Extension Development Host
3. In the new window, select any error or stack trace text
4. Right-click → **BugMode 🐛** → choose your target
5. Or use `Ctrl+Shift+B` (Cmd+Shift+B on Mac) for Claude

The generated prompt is:
- Shown in the **BugMode side panel** (Explorer sidebar)
- **Copied to clipboard** automatically

### Commands

| Command | Description |
|---|---|
| `BugMode: Generate for Claude` | Optimized for Claude's reasoning style |
| `BugMode: Generate for Cursor` | Inline fix format for Cursor |
| `BugMode: Generate Debug Context` | Generic AI-ready prompt |

### Settings

| Setting | Default | Description |
|---|---|---|
| `bugmode.defaultTarget` | `claude` | Default AI target |
| `bugmode.debugMode` | `false` | Verbose output logging |

## Architecture Principles

- **Local-first** — no cloud, no API calls, no telemetry
- **Model-agnostic** — works with any AI tool
- **Fast** — deterministic analysis, no ML inference
- **Extensible** — add new prompt strategies or detectors easily

## Packaging for VSCode Marketplace

```bash
cd packages/extension
pnpm package   # generates bugmode-0.0.1.vsix
```

Install locally: `code --install-extension bugmode-0.0.1.vsix`
