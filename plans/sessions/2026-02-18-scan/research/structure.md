# Codebase Structure Analysis

**Project:** free-cluely  
**Date:** 2026-02-18  
**Analyst:** codebase-explorer  

---

## Project Type

- **Type:** Fullstack Desktop Application
- **Framework:** Electron + React (Vite renderer)
- **Language:** TypeScript
- **Runtime:** Node.js (Electron main process), Browser (renderer)
- **Package Name:** `interview-coder` (internal), `Meeting Notes Coder` (product name)
- **Version:** 1.0.0

---

## Directory Structure (tree, excluding node_modules)

```
free-cluely/
├── .env                          # Environment variables (GEMINI_API_KEY, USE_OLLAMA, etc.)
├── .gitattributes
├── .gitignore
├── .npmrc
├── LICENSE
├── README.md
├── doc.md                        # Developer documentation notes
├── image.png                     # Project screenshot/demo image
├── index.html                    # Root HTML for Vite renderer entry
├── package.json                  # Root project manifest
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.js             # PostCSS config (used by Tailwind)
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript config for renderer (src/)
├── tsconfig.node.json            # TypeScript config for Node/Electron
│
├── electron/                     # ELECTRON MAIN PROCESS (TypeScript source)
│   ├── main.ts                   # Entry point: AppState singleton, app initialization
│   ├── preload.ts                # Context bridge: exposes electronAPI to renderer
│   ├── ipcHandlers.ts            # IPC channel handler registration
│   ├── LLMHelper.ts              # LLM abstraction (Gemini + Ollama)
│   ├── ProcessingHelper.ts       # Screenshot/audio processing orchestration
│   ├── ScreenshotHelper.ts       # Screenshot capture and file management
│   ├── WindowHelper.ts           # BrowserWindow lifecycle, positioning
│   ├── shortcuts.ts              # Global keyboard shortcut registration
│   └── tsconfig.json             # Electron-specific TypeScript config
│
├── dist-electron/                # Compiled Electron main process (JS output)
│   ├── main.js + .map
│   ├── preload.js + .map
│   ├── ipcHandlers.js + .map
│   ├── LLMHelper.js + .map
│   ├── ProcessingHelper.js + .map
│   ├── ScreenshotHelper.js + .map
│   ├── WindowHelper.js + .map
│   └── shortcuts.js + .map
│
├── src/                          # RENDERER PROCESS (React + Vite)
│   ├── main.tsx                  # Renderer entry point (ReactDOM.createRoot)
│   ├── App.tsx                   # Root React component, view state, event routing
│   ├── index.css                 # Global styles (Tailwind directives)
│   ├── vite-env.d.ts             # Vite environment type declarations
│   │
│   ├── _pages/                   # Page-level components (views)
│   │   ├── Queue.tsx             # Queue view: screenshots, chat, model selector
│   │   ├── Solutions.tsx         # Solutions view: problem + code + debug display
│   │   └── Debug.tsx             # Debug view: debug session display
│   │
│   ├── components/               # Shared UI components
│   │   ├── Queue/
│   │   │   ├── QueueCommands.tsx   # Toolbar/command bar for Queue view
│   │   │   ├── ScreenshotItem.tsx  # Individual screenshot thumbnail item
│   │   │   └── ScreenshotQueue.tsx # Screenshot list/queue display
│   │   ├── Solutions/
│   │   │   └── SolutionCommands.tsx # Toolbar/command bar for Solutions view
│   │   └── ui/
│   │       ├── ModelSelector.tsx    # LLM provider/model switcher UI
│   │       ├── card.tsx             # Reusable card UI primitive
│   │       ├── dialog.tsx           # Radix UI dialog wrapper
│   │       └── toast.tsx            # Toast notification component
│   │
│   ├── lib/
│   │   └── utils.ts              # Shared utility functions (clsx/tailwind-merge)
│   │
│   └── types/
│       ├── index.tsx             # Core types: Screenshot, Solution interfaces
│       ├── solutions.ts          # ProblemStatementData type definitions
│       ├── audio.ts              # AudioResult type definitions
│       ├── electron.d.ts         # Global ElectronAPI window type declaration
│       └── global.d.ts           # Global type augmentations
│
├── renderer/                     # Legacy/alternate CRA renderer (unused in main build)
│   ├── package.json              # CRA-based React setup
│   ├── tsconfig.json
│   ├── public/                   # Static assets (favicon, manifest)
│   └── src/
│       ├── App.tsx               # Placeholder CRA app
│       ├── App.test.tsx
│       ├── index.tsx
│       └── ...
│
└── worker-script/                # Background worker scripts
    └── node/
        └── index.js              # Node.js worker entry
```

---

## Entry Points

| Role | File | Purpose |
|------|------|---------|
| Electron Main | `electron/main.ts` | App initialization, AppState singleton, tray, IPC setup |
| Renderer | `src/main.tsx` | React mount point, renders `<App />` into `#root` |
| Preload Bridge | `electron/preload.ts` | Exposes `window.electronAPI` via contextBridge |
| HTML Shell | `index.html` | Root HTML, Vite dev/prod entry point |
| Build Output Main | `dist-electron/main.js` | Compiled Electron main (referenced in package.json "main") |

---

## Key Paths and Their Purposes

| Path | Purpose |
|------|---------|
| `electron/main.ts` | Singleton `AppState` class wires all helpers together; app lifecycle |
| `electron/LLMHelper.ts` | Dual-provider LLM client: Google Gemini (`gemini-2.0-flash`) and local Ollama |
| `electron/ProcessingHelper.ts` | Orchestrates screenshot/audio analysis via LLMHelper |
| `electron/ScreenshotHelper.ts` | Captures screens, maintains two queues (main + debug extra), max 5 each |
| `electron/WindowHelper.ts` | Frameless transparent BrowserWindow, `alwaysOnTop`, position tracking |
| `electron/shortcuts.ts` | Global shortcuts: Cmd+H (screenshot), Cmd+Enter (process), Cmd+B (toggle), Cmd+R (reset), Cmd+Arrow (move) |
| `electron/ipcHandlers.ts` | All IPC channel registrations linking renderer requests to main-process methods |
| `src/App.tsx` | View router: switches between `queue`, `solutions`, `debug` views |
| `src/_pages/Queue.tsx` | Primary UI: screenshot list, inline chat with LLM, model selector panel |
| `src/_pages/Solutions.tsx` | Solution display: problem statement, code, complexity, audio results |
| `src/_pages/Debug.tsx` | Debug session display (populated after extra screenshots are processed) |
| `src/components/ui/ModelSelector.tsx` | Runtime LLM provider switching (Gemini/Ollama) |
| `src/types/` | All TypeScript interfaces/types shared across renderer |

---

## Source Organization Pattern

The project uses a **dual-process Electron architecture**:

### Main Process (`electron/`)
- Organized as a set of **helper classes** injected into a central `AppState` singleton
- Each helper encapsulates a single concern (Window, Screenshot, LLM, Shortcuts, Processing)
- IPC handlers are registered in a dedicated `ipcHandlers.ts` module
- TypeScript compiled separately via `electron/tsconfig.json` into `dist-electron/`

### Renderer Process (`src/`)
- Standard **React + Vite** SPA
- Pages live in `src/_pages/` (prefixed with `_` to sort separately)
- Reusable components in `src/components/`, organized by feature domain (`Queue/`, `Solutions/`, `ui/`)
- All shared types in `src/types/`
- Utility functions in `src/lib/utils.ts`
- State management uses **react-query** for server-state caching; local state with `useState`

---

## Electron Main Process Files

| File | Class/Export | Role |
|------|-------------|------|
| `electron/main.ts` | `AppState` | Central state: owns all helpers, manages view state, exposes all public methods |
| `electron/WindowHelper.ts` | `WindowHelper` | Frameless transparent window, show/hide/toggle/center/move |
| `electron/ScreenshotHelper.ts` | `ScreenshotHelper` | Dual-queue screenshot capture using `screenshot-desktop`, UUID-named files |
| `electron/LLMHelper.ts` | `LLMHelper` | Multi-provider LLM: Gemini 2.0 Flash + Ollama; image/audio/text analysis |
| `electron/ProcessingHelper.ts` | `ProcessingHelper` | Mediates processing flow: reads queues, calls LLMHelper, sends IPC events |
| `electron/shortcuts.ts` | `ShortcutsHelper` | Registers all global keyboard shortcuts via Electron `globalShortcut` |
| `electron/ipcHandlers.ts` | `initializeIpcHandlers()` | Registers all `ipcMain.handle()` channels |
| `electron/preload.ts` | (module) | Context bridge: exposes typed `electronAPI` object to renderer window |

---

## Renderer/Frontend Files

| File | Role |
|------|------|
| `src/main.tsx` | ReactDOM entry, mounts `<App />` with StrictMode |
| `src/App.tsx` | View router, global event listeners (reset, solution start, unauthorized) |
| `src/_pages/Queue.tsx` | Main queue view with screenshot list, chat panel, model selector |
| `src/_pages/Solutions.tsx` | Solution results view with problem statement, code highlighting, audio result |
| `src/_pages/Debug.tsx` | Debug result view rendered when `new_solution` cache key is populated |
| `src/components/Queue/ScreenshotQueue.tsx` | Scrollable screenshot thumbnail list |
| `src/components/Queue/ScreenshotItem.tsx` | Individual screenshot item with delete button |
| `src/components/Queue/QueueCommands.tsx` | Toolbar: screenshot, process, chat, settings buttons |
| `src/components/Solutions/SolutionCommands.tsx` | Toolbar: back, take debug screenshot, process debug |
| `src/components/ui/ModelSelector.tsx` | Dropdown/panel for switching between Gemini and local Ollama models |
| `src/components/ui/toast.tsx` | Radix UI toast wrapper with variants (neutral, error, success) |
| `src/components/ui/dialog.tsx` | Radix UI dialog wrapper |
| `src/components/ui/card.tsx` | Card layout primitive |
| `src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Scripts: `app:dev` (concurrent vite + electron), `app:build` (electron-builder dist) |
| `tsconfig.json` | Renderer TypeScript (targets browser, Vite bundler mode) |
| `tsconfig.node.json` | Node/Electron TypeScript config |
| `electron/tsconfig.json` | Electron main process TypeScript (CommonJS output to `dist-electron/`) |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS pipeline (Tailwind, Autoprefixer) |
| `.env` | Runtime secrets (GEMINI_API_KEY, USE_OLLAMA, OLLAMA_MODEL, OLLAMA_URL) |

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Desktop Shell | Electron 33 |
| Build Tool | Vite 5 + vite-plugin-electron |
| UI Framework | React 18 |
| Styling | Tailwind CSS 3 + Radix UI primitives |
| State Management | react-query 3 (server state), React useState (local) |
| LLM Providers | Google Gemini 2.0 Flash (`@google/generative-ai`) + Ollama (HTTP) |
| Screenshot Capture | `screenshot-desktop` + `sharp` |
| Type System | TypeScript 5, strict mode |
| IPC Bridge | Electron contextBridge + ipcMain/ipcRenderer |
| Audio | Browser MediaRecorder API + Gemini audio analysis |
| Code Highlighting | react-syntax-highlighter (Prism/Dracula theme) |
| Packaging | electron-builder (dmg/nsis/AppImage targets) |

---

## Global Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + H | Take screenshot |
| Cmd/Ctrl + Enter | Process screenshots through LLM |
| Cmd/Ctrl + B | Toggle window show/hide |
| Cmd/Ctrl + R | Reset: clear queues, return to queue view |
| Cmd/Ctrl + Shift + Space | Center and show window |
| Cmd/Ctrl + Arrow Keys | Move window in four directions |

---

## IPC Channels (Main Process Handlers)

| Channel | Handler |
|---------|---------|
| `update-content-dimensions` | Update window bounds from renderer content size |
| `take-screenshot` | Capture screen, return path + preview |
| `get-screenshots` | Return queue of screenshots with previews |
| `delete-screenshot` | Delete screenshot file and remove from queue |
| `toggle-window` | Show/hide main window |
| `reset-queues` | Clear all screenshot queues |
| `analyze-audio-base64` | Analyze base64 audio via LLM |
| `analyze-audio-file` | Analyze audio file via LLM |
| `analyze-image-file` | Analyze image file via LLM |
| `gemini-chat` | Direct chat with LLM provider |
| `quit-app` | Quit the Electron app |
| `move-window-left/right/up/down` | Reposition window |
| `center-and-show-window` | Center window on screen |
| `get-current-llm-config` | Return provider + model info |
| `get-available-ollama-models` | List Ollama models from local API |
| `switch-to-ollama` | Hot-switch to Ollama provider |
| `switch-to-gemini` | Hot-switch to Gemini provider |
| `test-llm-connection` | Ping LLM provider connectivity |

---

## Recommended Next Agents

| Agent | Reason |
|-------|--------|
| `frontend-researcher` | Deep-dive into React component patterns, state management, and UI flows in `src/` |
| `backend-researcher` | Analyze Electron main process architecture, IPC patterns, and LLM integration in `electron/` |
| `dependency-researcher` | Audit all dependencies in `package.json` for security and update status |
| `solution-architect` | Design architecture improvements (e.g., separate audio processing, typed IPC contracts) |
| `pattern-researcher` | Identify naming and structural conventions used across components |
