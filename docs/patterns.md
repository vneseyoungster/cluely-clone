# Code Patterns

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Electron files | PascalCase + `Helper` suffix | `LLMHelper.ts`, `WindowHelper.ts` |
| React pages | PascalCase | `Queue.tsx`, `Solutions.tsx` |
| UI primitives | lowercase | `toast.tsx`, `dialog.tsx` |
| Classes | PascalCase | `AppState`, `ProcessingHelper` |
| Interfaces | PascalCase | `QueueProps`, `ElectronAPI` |
| Components | `const Name: React.FC<Props>` | `const Queue: React.FC<QueueProps>` |
| Event handlers | `handle` prefix | `handleDeleteScreenshot` |
| Event constants | SCREAMING_SNAKE_CASE | `SOLUTION_SUCCESS` |
| IPC channels | kebab-case | `"take-screenshot"` |
| Boolean state | `is` prefix | `isLoading`, `isChatOpen` |
| Environment vars | SCREAMING_SNAKE_CASE | `GEMINI_API_KEY` |

## Design Patterns

### Singleton (Main Process)

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

### Helper Class

```typescript
export class WindowHelper {
  private appState: AppState

  constructor(appState: AppState) {
    this.appState = appState
  }
}
```

### IPC Handler (Mutation)

```typescript
ipcMain.handle("reset-queues", async () => {
  try {
    appState.clearQueues()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
```

### IPC Event Bridge (Preload)

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

### React Component

```typescript
interface QueueProps {
  setView: React.Dispatch<React.SetStateAction<"queue" | "solutions" | "debug">>
}

const Queue: React.FC<QueueProps> = ({ setView }) => {
  // hooks, handlers, return JSX
}

export default Queue
```

## State Management

- **React Query v3** for server state (screenshots, solutions)
- **useState** for local UI state
- **queryClient.setQueryData()** as cross-component event bus
- `staleTime: Infinity` and `cacheTime: Infinity` to prevent refetches

Cache keys:
- `["screenshots"]` - Captured screenshots
- `["extras"]` - Debug screenshots
- `["problem_statement"]` - Extracted problem
- `["solution"]` - Initial solution
- `["new_solution"]` - Debug solution

## View Routing

Manual state machine (no router library):
```typescript
const [view, setView] = useState<"queue" | "solutions" | "debug">("queue")
```

## Styling

### Custom Classes

| Class | Purpose |
|-------|---------|
| `.liquid-glass` | Frosted glass panel |
| `.liquid-glass-bar` | Command bar variant |
| `.liquid-glass-dark` | Dark variant |
| `.glass-content` | Prevents blur inheritance |
| `.draggable-area` | Electron window drag region |

### Utility

```typescript
// lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Security

```typescript
webPreferences: {
  nodeIntegration: true,
  contextIsolation: true,
  preload: path.join(__dirname, "preload.js")
}

mainWindow.setContentProtection(true) // Prevents screen capture
```

## Known Issues

| Issue | Location | Impact |
|-------|----------|--------|
| `ElectronAPI` type duplicated | `App.tsx` + `electron.d.ts` | Keep in sync |
| `PROCESSING_EVENTS` duplicated | `main.ts` + `preload.ts` | Keep in sync |
| Typo: `"procesing-unauthorized"` | preload.ts | Missing 'c' |
| `onDebugSuccess` cleanup bug | preload.ts | Memory leak |
| `any` types used | Throughout | Type safety loss |
| console.log in production | Throughout | Remove |
| Window step = 0 | WindowHelper.ts | Arrow keys broken |
