# Architecture

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript 5 (strict mode) |
| Desktop | Electron 33 |
| UI | React 18 + React Query v3 |
| Bundler | Vite 5 (renderer) + tsc (electron) |
| Styling | Tailwind CSS 3 + Radix UI |
| AI | Google Gemini 2.0 Flash / Ollama |
| Screenshot | screenshot-desktop + sharp |
| Code Display | react-syntax-highlighter |

## Directory Structure

```
free-cluely/
├── index.html                    # Vite HTML entry
├── package.json                  # Root manifest + electron-builder config
├── tsconfig.json                 # Renderer TypeScript config
├── tsconfig.node.json            # Node/Electron TypeScript config
├── tailwind.config.js            # Tailwind + custom animations
│
├── electron/                     # MAIN PROCESS
│   ├── main.ts                   # AppState singleton, app lifecycle
│   ├── preload.ts                # contextBridge -> electronAPI
│   ├── ipcHandlers.ts            # IPC channel registrations
│   ├── WindowHelper.ts           # BrowserWindow management
│   ├── ScreenshotHelper.ts       # Screenshot capture + queue
│   ├── ProcessingHelper.ts       # LLM orchestration
│   ├── LLMHelper.ts              # Gemini + Ollama abstraction
│   ├── ElevenLabsHelper.ts       # ElevenLabs Scribe STT token generation
│   └── shortcuts.ts              # Global keyboard shortcuts
│
├── dist-electron/                # Compiled main process (JS)
│
├── src/                          # RENDERER PROCESS (React)
│   ├── main.tsx                  # React DOM mount
│   ├── App.tsx                   # Root component, view router
│   ├── index.css                 # Tailwind + liquid glass CSS
│   ├── _pages/
│   │   ├── Queue.tsx             # Screenshot capture view
│   │   ├── Solutions.tsx         # Results view
│   │   └── Debug.tsx             # Code diff view
│   ├── components/
│   │   ├── Queue/                # Queue feature components
│   │   ├── Solutions/            # Solutions feature components
│   │   └── ui/                   # Primitives (dialog, toast, card)
│   ├── types/                    # TypeScript interfaces
│   └── lib/utils.ts              # Utilities (cn)
│
├── renderer/                     # UNUSED - legacy CRA scaffold
└── worker-script/                # UNUSED - Node worker stub
```

## Entry Points

| Role | Path | Output |
|------|------|--------|
| Electron Main | `electron/main.ts` | `dist-electron/main.js` |
| Preload | `electron/preload.ts` | `dist-electron/preload.js` |
| Renderer | `index.html` -> `src/main.tsx` | `dist/` |

## Main Process Architecture

**Singleton AppState Pattern:**
- Central `AppState` class owns all helper instances
- Helpers injected via constructor

| Helper | Purpose |
|--------|---------|
| `WindowHelper` | BrowserWindow lifecycle, positioning |
| `ScreenshotHelper` | Dual-queue capture (main + debug), max 5 each |
| `ProcessingHelper` | Orchestrates AI analysis flow |
| `LLMHelper` | Provider abstraction (Gemini/Ollama) |
| `ElevenLabsHelper` | ElevenLabs Scribe STT token generation |
| `ShortcutsHelper` | Global keyboard shortcuts |

## IPC Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `take-screenshot` | R->M | Capture screen |
| `get-screenshots` | R->M | Get queue with previews |
| `delete-screenshot` | R->M | Remove screenshot |
| `gemini-chat` | R->M | Chat with LLM |
| `switch-to-ollama` | R->M | Switch provider |
| `switch-to-gemini` | R->M | Switch provider |
| `get-scribe-token` | R->M | Get ElevenLabs Scribe STT token |
| `screenshot-taken` | M->R | Push new screenshot |
| `solution-success` | M->R | Push solution result |
| `debug-success` | M->R | Push debug result |

## Build Pipeline

```
Development:
  npm run app:dev
  -> vite --port 5180 (renderer, hot reload)
  -> wait-on + electron . (loads localhost:5180)

Production:
  npm run app:build
  -> vite build -> dist/
  -> tsc -p electron/tsconfig.json -> dist-electron/
  -> electron-builder -> release/ (dmg/exe/AppImage)
```

## Platform Targets

| Platform | Format |
|----------|--------|
| macOS | DMG (x64, arm64) |
| Windows | NSIS, Portable (x64, ia32) |
| Linux | AppImage, DEB (x64) |
