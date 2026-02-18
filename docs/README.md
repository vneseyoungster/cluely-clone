# Free Cluely Documentation

> Interview coding assistant - Electron desktop app with AI-powered problem analysis

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | Project structure, entry points, tech stack |
| [Patterns](patterns.md) | Code conventions, naming, design patterns |
| [Capabilities](capabilities.md) | Features, shortcuts, UI/UX |
| [Dependencies](dependencies.md) | Package audit, security, upgrades |
| [Git History](git-history.md) | Commit log, remote info |

## Project Overview

| Property | Value |
|----------|-------|
| Package | `interview-coder` |
| Product | `Meeting Notes Coder` |
| Type | Fullstack Electron + React |
| AI | Google Gemini / Ollama |

## Quick Start

```bash
# Install
npm install

# Development
npm run app:dev

# Build
npm run app:build
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+H` | Take screenshot |
| `Cmd+Enter` | Process with AI |
| `Cmd+B` | Toggle window |
| `Cmd+R` | Reset |
| `Cmd+Shift+Space` | Center window |

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes* | Gemini API key |
| `USE_OLLAMA` | No | Use local Ollama |
| `OLLAMA_MODEL` | No | Ollama model name |

*Required unless using Ollama
