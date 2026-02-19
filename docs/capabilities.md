# Capabilities

## Core Purpose

Interview coding assistant that helps users by:
1. Capturing screenshots of coding problems
2. Analyzing them with AI (Gemini/Ollama)
3. Generating solutions and explanations
4. Providing debug assistance with code diffs

## Features

### Screenshot Capture

- **Trigger:** `Cmd+H` global shortcut
- **Behavior:** Hides window, captures screen, queues PNG
- **Queue:** Up to 5 screenshots (FIFO eviction)
- **Storage:** Electron userData directory
- **Extra queue:** Separate queue for debug screenshots

### AI Analysis

**Gemini (Cloud - Default):**
- Model: `gemini-2.0-flash`
- Requires: `GEMINI_API_KEY` env var
- Capabilities: Image analysis, audio analysis, structured JSON, chat

**Ollama (Local - Optional):**
- URL: `http://localhost:11434`
- Auto-detects installed models
- Config: `USE_OLLAMA`, `OLLAMA_MODEL`, `OLLAMA_URL`
- Runtime switching via UI

### Problem Extraction

Analyzes screenshots to extract:
- Problem statement
- Context and constraints
- Suggested approaches
- Reasoning steps

### Solution Generation

Generates code solutions with:
- Working code implementation
- Step-by-step thoughts
- Time/space complexity analysis
- Alternative approaches

### Debug Mode

- Takes additional screenshots of errors/output
- Compares original solution with corrected version
- Side-by-side code diff visualization
- Uses `diff` library for line-by-line comparison

### Voice Input (ElevenLabs Scribe STT)

- **Technology:** ElevenLabs Scribe real-time streaming STT
- **Model:** `scribe_v2_realtime`
- **Features:**
  - Real-time streaming transcription via WebSocket
  - Partial transcripts shown while speaking
  - Committed transcripts accumulated for final result
  - Microphone settings: echo cancellation, noise suppression, auto gain
- **Authentication:** Single-use tokens generated server-side via `@elevenlabs/elevenlabs-js`
- **React Integration:** `useScribeSTT` custom hook wraps `@elevenlabs/react`
- **Flow:** Click Voice -> Get token -> Connect WebSocket -> Stream audio -> Show partials -> Stop -> Send to Gemini

### Chat Interface

- Direct text chat with LLM
- Context-aware responses
- Routes to Gemini or Ollama based on current mode

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+Space` | Show/center window |
| `Cmd+H` | Take screenshot |
| `Cmd+Enter` | Process with AI |
| `Cmd+R` | Reset all |
| `Cmd+B` | Toggle visibility |
| `Cmd+Arrows` | Move window |

## UI/UX

### Overlay Window

- Frameless, transparent, always-on-top
- Content protection (invisible to screen capture)
- Hidden from Mission Control and taskbar
- Keyboard-driven positioning
- Adaptive width (50% normal, 75% debug mode)

### Liquid Glass Design

- Frosted glass aesthetic with backdrop blur
- Shimmer and pulse animations
- Dark/light variants

### Views

| View | Purpose |
|------|---------|
| Queue | Screenshot capture, chat, model selection |
| Solutions | Problem display, solution code, complexity |
| Debug | Side-by-side diff comparison |

## System Tray

- Menu: Show, Toggle, Screenshot, Quit
- Double-click to show window

## Platform Support

| Platform | Format |
|----------|--------|
| macOS | DMG installer |
| Windows | NSIS installer + portable |
| Linux | AppImage + DEB |

## Known Limitations

| Issue | Impact |
|-------|--------|
| Window movement broken (step=0) | Arrow keys don't move window |
| AbortController not wired | Can't cancel in-flight LLM requests |
| Ollama limited to text | No multimodal support |
| Worker script unused | Placeholder code |
| No tests | Zero test coverage |
