# Patterns Analysis: free-cluely

**Date:** 2026-02-18
**Session:** free-cluely-analysis

---

## Architecture Patterns

### Main Process (Electron)

**Singleton AppState Pattern:**
```typescript
export class AppState {
  private windowHelper: WindowHelper
  private screenshotHelper: ScreenshotHelper
  public shortcutsHelper: ShortcutsHelper
  public processingHelper: ProcessingHelper
  // ...
}
```

**IPC Pattern:** All IPC uses `ipcMain.handle` (invoke/handle, not fire-and-forget)

**Helper Class Pattern:** Functionality split into focused helper classes:
- `WindowHelper` - BrowserWindow lifecycle
- `ScreenshotHelper` - Screen capture + queue
- `ProcessingHelper` - LLM orchestration
- `LLMHelper` - Provider abstraction
- `ShortcutsHelper` - Global shortcuts

---

## Frontend Patterns

### State Management

**React Query as Cache Store:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity, cacheTime: Infinity }
  }
})
```

Cache keys used:
- `["screenshots"]` - Captured screenshots
- `["extras"]` - Extra screenshots for debug
- `["problem_statement"]` - Extracted problem
- `["solution"]` - Initial solution
- `["new_solution"]` - Debug solution
- `["audio_result"]` - Audio transcription

### View Routing

Manual state machine (no router library):
```typescript
const [view, setView] = useState<"queue" | "solutions" | "debug">("queue")
```

### Component Organization

Feature-based grouping:
```
_pages/           # Page-level components
components/
  Queue/          # Queue feature components
  Solutions/      # Solutions feature components
  ui/             # Shared primitives
```

---

## Styling Patterns

### Tailwind + Custom CSS

All components use Tailwind utilities with custom liquid glass classes:
- `.liquid-glass` - Frosted glass panel
- `.liquid-glass-bar` - Command bar variant
- `.liquid-glass-dark` - Dark variant
- `.glass-content` - Prevents blur inheritance
- `.draggable-area` - Electron window drag region

### Class Name Helper

Custom `cn()` in `lib/utils.ts`:
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Data Flow Patterns

### Screenshot-to-LLM Flow

1. User presses `Cmd+H`
2. `ScreenshotHelper.takeScreenshot()` captures PNG
3. IPC sends `screenshot-taken` event to renderer
4. `Queue.tsx` calls `analyze-image-file` IPC
5. `LLMHelper.analyzeImageFile()` sends to Gemini/Ollama
6. Result appended to chat messages

### Processing Flow

1. User presses `Cmd+Enter`
2. `ProcessingHelper.processScreenshots()` called
3. LLM extracts problem info from screenshot
4. `PROBLEM_EXTRACTED` event triggers Solutions view
5. LLM generates solution code
6. `SOLUTION_SUCCESS` displays result

---

## Security Patterns

### Context Isolation

```typescript
webPreferences: {
  nodeIntegration: true,
  contextIsolation: true,
  preload: path.join(__dirname, "preload.js")
}
```

### Content Protection

```typescript
mainWindow.setContentProtection(true) // Prevents screen capture
```

### Environment Variables for Secrets

```typescript
const apiKey = process.env.GEMINI_API_KEY
```

---

## Anti-Patterns / Issues Found

| Issue | Location | Impact |
|-------|----------|--------|
| `nodeIntegration: true` redundant | WindowHelper.ts | Security ambiguity |
| Window step = 0 | WindowHelper.ts | Arrow keys non-functional |
| AbortController unused | ProcessingHelper.ts | Cancellation broken |
| Dual state sources | Solutions.tsx | Stale UI risk |
| `any` types in IPC | electron.d.ts | Type safety loss |
| console.log statements | Throughout | Violates code style |
| No error boundaries | React components | Crash risk |
| Inline chat JSX | Queue.tsx | Large file, hard to maintain |
