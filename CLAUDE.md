# Project Context

## Project Overview
- **Name:** free-cluely (interview-coder)
- **Type:** Fullstack Desktop Application
- **Description:** Electron desktop app that captures screenshots, analyzes coding problems using AI (Gemini/Ollama), and generates solutions

## Tech Stack
- **Language:** TypeScript 5 (strict mode)
- **Framework:** Electron 33 + React 18 + Vite 5
- **Runtime:** Node.js (Electron main), Browser (renderer)
- **Styling:** Tailwind CSS 3 + Radix UI primitives
- **State:** react-query v3 + useState
- **AI Providers:** Google Gemini 2.0 Flash + Ollama (local)

## Architecture

```
Electron Main Process (electron/)
├── main.ts           → AppState singleton, app lifecycle
├── WindowHelper.ts   → Frameless transparent window management
├── ScreenshotHelper.ts → Screenshot capture and queues
├── LLMHelper.ts      → Gemini/Ollama LLM abstraction
├── ProcessingHelper.ts → Orchestrates AI analysis
├── shortcuts.ts      → Global keyboard shortcuts
├── ipcHandlers.ts    → IPC channel registrations
└── preload.ts        → Context bridge (electronAPI)

React Renderer (src/)
├── App.tsx           → View router, global event listeners
├── _pages/           → Queue, Solutions, Debug views
├── components/       → Feature-grouped components
│   ├── Queue/        → Screenshot list, commands
│   ├── Solutions/    → Solution display, debug
│   └── ui/           → Primitives (toast, dialog, card)
├── types/            → TypeScript interfaces
└── lib/utils.ts      → cn() utility
```

## Key Paths
| Path | Purpose |
|------|---------|
| `free-cluely/electron/` | Electron main process source |
| `free-cluely/src/` | React renderer source |
| `free-cluely/src/_pages/` | Page-level components |
| `free-cluely/src/components/` | Reusable components |
| `free-cluely/src/types/` | TypeScript type definitions |
| `free-cluely/dist-electron/` | Compiled Electron main |
| `free-cluely/dist/` | Built renderer |

## Commands
```bash
# Development (Vite + Electron concurrent)
npm run start
# or
npm run app:dev

# Build for distribution
npm run app:build
# or
npm run dist

# Clean build artifacts
npm run clean

# Run Vite dev server only
npm run dev

# Build renderer only
npm run build
```

## Environment Variables
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GEMINI_API_KEY` | Yes* | - | Google Gemini API key |
| `USE_OLLAMA` | No | `false` | Set `"true"` for local Ollama |
| `OLLAMA_MODEL` | No | auto | Ollama model name |
| `OLLAMA_URL` | No | `http://localhost:11434` | Ollama server URL |

*Required unless `USE_OLLAMA=true`

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + H | Take screenshot |
| Cmd/Ctrl + Enter | Process screenshots via AI |
| Cmd/Ctrl + B | Toggle window show/hide |
| Cmd/Ctrl + R | Reset queues, return to queue view |
| Cmd/Ctrl + Shift + Space | Center and show window |
| Cmd/Ctrl + Arrow Keys | Move window |

## Conventions

### Naming
- **Electron files:** PascalCase + `Helper` suffix (`LLMHelper.ts`)
- **React pages:** PascalCase (`Queue.tsx`, `Solutions.tsx`)
- **UI primitives:** lowercase (`toast.tsx`, `dialog.tsx`)
- **Handlers:** `handle` prefix (`handleDeleteScreenshot`)
- **Booleans:** `is` prefix (`isLoading`, `isChatOpen`)
- **IPC channels:** kebab-case (`"take-screenshot"`, `"switch-to-ollama"`)
- **Event constants:** SCREAMING_SNAKE_CASE (`SOLUTION_SUCCESS`)

### Patterns

**IPC Response (mutations):**
```typescript
return { success: true }
return { success: false, error: error.message }
```

**Event Listener Cleanup:**
```typescript
const cleanupFunctions = [
  window.electronAPI.onScreenshotTaken(() => refetch()),
  window.electronAPI.onSolutionError((error) => showToast(...)),
]
return () => cleanupFunctions.forEach((cleanup) => cleanup())
```

**React Component:**
```typescript
interface Props { /* ... */ }
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // hooks, handlers, return JSX
}
export default ComponentName
```

### Code Style
- Use immutability - never mutate function parameters
- Target 200-400 lines per file, max 800
- No console.log in production code
- No `any` type (strict mode enabled)
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`

## IPC Channels
| Channel | Direction | Purpose |
|---------|-----------|---------|
| `take-screenshot` | R→M | Capture screen |
| `get-screenshots` | R→M | Get queue with previews |
| `delete-screenshot` | R→M | Remove screenshot |
| `gemini-chat` | R→M | Chat with LLM |
| `switch-to-ollama` | R→M | Change to Ollama provider |
| `switch-to-gemini` | R→M | Change to Gemini provider |
| `screenshot-taken` | M→R | Push new screenshot |
| `solution-success` | M→R | Push solution result |
| `debug-success` | M→R | Push debug result |

## Dependencies (Key)
| Package | Purpose |
|---------|---------|
| `@google/generative-ai` | Gemini AI SDK |
| `screenshot-desktop` | Desktop screenshot capture |
| `sharp` | Image processing |
| `tesseract.js` | OCR engine |
| `react-query` | Server state management |
| `@radix-ui/*` | Accessible UI primitives |
| `lucide-react` | Icons |
| `react-syntax-highlighter` | Code display |

## Important Notes

### Known Issues
- `ElectronAPI` type duplicated in `src/App.tsx` and `src/types/electron.d.ts` (keep in sync)
- `PROCESSING_EVENTS` constants duplicated in `main.ts` and `preload.ts`
- Typo: `"procesing-unauthorized"` (missing 'c') in event name
- `onDebugSuccess` listener cleanup bug in preload.ts

### Security
- 34 npm vulnerabilities (13 high) - upgrade `electron-builder` to v26.8.1
- No `.env.example` file - document required variables
- Remove `@types/electron` (deprecated, conflicts with built-in types)

### Cleanup Needed
- Remove unused `@google/genai` package (duplicate of `@google/generative-ai`)
- Migrate `react-query` v3 to `@tanstack/react-query` v5
- Remove legacy `renderer/` directory (unused CRA setup)
- Choose single package manager (remove either `package-lock.json` or `pnpm-lock.yaml`)

## Documentation
| Document | Location |
|----------|----------|
| Index | `docs/README.md` |
| Architecture | `docs/architecture.md` |
| Code Patterns | `docs/patterns.md` |
| Capabilities | `docs/capabilities.md` |
| Dependencies | `docs/dependencies.md` |
| Git History | `docs/git-history.md` |
