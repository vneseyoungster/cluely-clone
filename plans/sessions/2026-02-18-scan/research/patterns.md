# Codebase Patterns Research

**Date:** 2026-02-18
**Codebase:** free-cluely (Electron + React + TypeScript)

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Electron files | PascalCase + `Helper` suffix | `LLMHelper.ts`, `WindowHelper.ts` |
| React pages | PascalCase | `Queue.tsx`, `Solutions.tsx` |
| UI primitives | lowercase | `toast.tsx`, `dialog.tsx` |
| Classes | PascalCase | `AppState`, `LLMHelper`, `ProcessingHelper` |
| Interfaces | PascalCase | `QueueProps`, `ModelConfig`, `ElectronAPI` |
| React components | `const Name: React.FC<Props>` | `const Queue: React.FC<QueueProps>` |
| Event handlers | `handle` prefix | `handleDeleteScreenshot`, `handleChatSend` |
| Event constants | SCREAMING_SNAKE_CASE | `INITIAL_START`, `DEBUG_ERROR` |
| IPC channels | kebab-case | `"take-screenshot"`, `"switch-to-ollama"` |
| Boolean state | `is` prefix | `isLoading`, `isRecording`, `isChatOpen` |
| Environment vars | SCREAMING_SNAKE_CASE | `GEMINI_API_KEY`, `USE_OLLAMA` |

---

## Code Patterns

### Singleton Pattern (Main Process)

```typescript
export class AppState {
  private static instance: AppState | null = null

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState()
    }
    return AppState.instance
  }
}
```

### Helper Class Pattern

```typescript
export class WindowHelper {
  private appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }
}
```

### IPC Handler Pattern

```typescript
// Mutation - returns success/error object
ipcMain.handle("reset-queues", async () => {
  try {
    appState.clearQueues()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
```

### IPC Event Bridge (preload.ts)

```typescript
onScreenshotTaken: (callback) => {
  const subscription = (_: any, data) => callback(data)
  ipcRenderer.on("screenshot-taken", subscription)
  return () => ipcRenderer.removeListener("screenshot-taken", subscription)
}
```

### Event Listener Cleanup (React)

```typescript
useEffect(() => {
  const cleanupFunctions = [
    window.electronAPI.onScreenshotTaken(() => refetch()),
    window.electronAPI.onSolutionError((error) => showToast(...)),
  ]
  return () => cleanupFunctions.forEach((cleanup) => cleanup())
}, [])
```

### React Component Pattern

```typescript
interface QueueProps {
  setView: React.Dispatch<React.SetStateAction<"queue" | "solutions" | "debug">>
}

const Queue: React.FC<QueueProps> = ({ setView }) => {
  // hooks
  // handlers
  // return JSX
}

export default Queue
```

---

## State Management

- **react-query v3** for server state (screenshots, solutions)
- **useState** for local UI state
- **queryClient.setQueryData()** as cross-component state bus from IPC events
- `staleTime: Infinity` and `cacheTime: Infinity` to prevent refetches

---

## Error Handling

**IPC handlers:** Return `{ success: false, error: message }`
**Processing errors:** Send via `webContents.send()` to renderer
**React handlers:** try/catch with toast notification

---

## Consistency Issues Found

1. `ElectronAPI` type duplicated in `App.tsx` and `types/electron.d.ts`
2. `PROCESSING_EVENTS` duplicated in `main.ts` and `preload.ts`
3. Typo: `"procesing-unauthorized"` (missing 'c')
4. `onDebugSuccess` cleanup bug in preload.ts
5. `any` type used despite strict mode
6. Emojis in JSX strings
7. `console.log` in production paths
