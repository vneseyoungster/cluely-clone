# Codebase Findings: free-cluely (interview-coder)

**Date:** 2026-02-18
**Session:** free-cluely-analysis

---

## Project Identity

| Property | Value |
|----------|-------|
| Package name | `interview-coder` |
| Product name | `Meeting Notes Coder` |
| App title | `Free Cluely` |
| Type | Fullstack Electron desktop application |
| Platforms | macOS, Windows, Linux |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript 5.6.3 (strict mode) |
| UI Framework | React 18.3.1 + React Query v3 |
| Desktop Shell | Electron 33.2.0 |
| Bundler (renderer) | Vite 5.4.11 + @vitejs/plugin-react |
| Bundler (electron) | tsc (CommonJS output to dist-electron/) |
| Styling | Tailwind CSS 3.4.15 + custom liquid glass CSS |
| LLM Providers | Google Gemini (gemini-2.0-flash) or Ollama (local) |
| Screenshot | screenshot-desktop + sharp |
| Code highlighting | react-syntax-highlighter (Prism/Dracula) |
| UI Primitives | Radix UI (Dialog, Toast) |

---

## Directory Structure

```
free-cluely/
|-- index.html                    # Vite HTML entry point
|-- package.json                  # Root package (electron-builder config inside)
|-- tsconfig.json                 # Renderer TypeScript config
|-- tsconfig.node.json            # Node/Electron TypeScript config
|-- tailwind.config.js            # Tailwind with custom animations
|-- postcss.config.js             # PostCSS for Tailwind
|
|-- electron/                     # MAIN PROCESS
|   |-- main.ts                   # App entry + AppState singleton
|   |-- ipcHandlers.ts            # All IPC channel registrations
|   |-- preload.ts                # contextBridge -> electronAPI
|   |-- WindowHelper.ts           # BrowserWindow creation + positioning
|   |-- ScreenshotHelper.ts       # Screenshot capture + queue
|   |-- ProcessingHelper.ts       # Orchestrates LLM calls
|   |-- LLMHelper.ts              # Gemini + Ollama abstraction
|   |-- shortcuts.ts              # Global keyboard shortcuts
|
|-- src/                          # RENDERER PROCESS (React)
|   |-- main.tsx                  # React DOM root mount
|   |-- App.tsx                   # Root component, view router
|   |-- index.css                 # Tailwind + liquid glass CSS
|   |-- _pages/
|   |   |-- Queue.tsx             # Main capture view
|   |   |-- Solutions.tsx         # Results view
|   |   |-- Debug.tsx             # Code diff view
|   |-- components/
|   |   |-- Queue/                # Queue-related components
|   |   |-- Solutions/            # Solutions-related components
|   |   |-- ui/                   # UI primitives (dialog, toast, card)
|   |-- types/                    # TypeScript interfaces
|   |-- lib/utils.ts              # Utility functions
|
|-- renderer/                     # UNUSED - legacy CRA scaffold
|-- worker-script/                # UNUSED - Node Worker stub
```

---

## Entry Points

| Entry Point | Path | Purpose |
|-------------|------|---------|
| Electron main | `/electron/main.ts` -> `dist-electron/main.js` | Node process |
| Electron preload | `/electron/preload.ts` -> `dist-electron/preload.js` | Bridge |
| Vite HTML | `/index.html` -> `/src/main.tsx` | Renderer entry |

---

## Build Configuration

**Development:**
```bash
npm run app:dev
# -> vite --port 5180 (renderer, hot reload)
# -> wait-on + electron . (loads localhost:5180)
```

**Production:**
```bash
npm run app:build
# -> vite build -> dist/
# -> tsc -p electron/tsconfig.json -> dist-electron/
# -> electron-builder -> release/ (dmg/exe/AppImage)
```

---

## Global Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+Space` | Show and center window |
| `Cmd+H` | Take screenshot |
| `Cmd+Enter` | Process screenshots through LLM |
| `Cmd+R` | Reset: cancel requests, clear queues |
| `Cmd+B` | Toggle show/hide window |
| `Cmd+Arrow keys` | Move window (currently bugged) |

---

## Files Not Part of Active Build

- `/renderer/` - Legacy CRA scaffold, not used
- `/worker-script/node/index.js` - Stub, not wired up
