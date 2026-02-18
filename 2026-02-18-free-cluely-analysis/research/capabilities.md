# Capabilities Analysis: free-cluely

**Date:** 2026-02-18
**Session:** free-cluely-analysis

---

## Core Purpose

**Interview Coding Assistant** - A desktop overlay application that helps users during coding interviews by:
1. Capturing screenshots of coding problems
2. Analyzing them with AI (Gemini/Ollama)
3. Generating solutions and explanations
4. Providing debug assistance with code diffs

---

## Feature Set

### 1. Screenshot Capture

- **Trigger:** `Cmd+H` global shortcut
- **Behavior:** Hides window, captures screen, queues PNG
- **Queue:** Up to 5 screenshots (FIFO eviction)
- **Storage:** Electron userData directory
- **Extra queue:** Separate queue for debug screenshots

### 2. AI Analysis (LLM Integration)

**Gemini (Cloud - Default):**
- Model: `gemini-2.0-flash`
- Requires: `GEMINI_API_KEY` env var
- Capabilities: Image analysis, audio analysis, structured JSON, chat

**Ollama (Local - Optional):**
- URL: `http://localhost:11434`
- Auto-detects installed models
- Controlled via: `USE_OLLAMA`, `OLLAMA_MODEL`, `OLLAMA_URL`
- Runtime switching via UI

### 3. Problem Extraction

- Analyzes screenshot(s) to extract:
  - Problem statement
  - Context and constraints
  - Suggested approaches
  - Reasoning steps

### 4. Solution Generation

- Generates code solutions with:
  - Working code implementation
  - Step-by-step thoughts
  - Time/space complexity analysis
  - Alternative approaches

### 5. Debug Mode

- Takes additional screenshots of errors/output
- Compares original solution with corrected version
- Side-by-side code diff visualization
- Uses `diff` library for line-by-line comparison

### 6. Voice Input

- MediaRecorder captures mic audio
- Sends base64 audio to Gemini for transcription
- Results displayed in audio result area

### 7. Chat Interface

- Direct text chat with LLM
- Context-aware responses
- Routed to Gemini or Ollama based on current mode

---

## UI/UX Features

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

1. **Queue View:** Screenshot capture, chat, model selection
2. **Solutions View:** Problem display, solution code, complexity
3. **Debug View:** Side-by-side diff comparison

---

## System Integration

### Global Shortcuts

| Shortcut | Function |
|----------|----------|
| `Cmd+Shift+Space` | Show/center window |
| `Cmd+H` | Take screenshot |
| `Cmd+Enter` | Process with LLM |
| `Cmd+R` | Reset all |
| `Cmd+B` | Toggle visibility |
| `Cmd+Arrows` | Move window |

### System Tray

- Menu: Show, Toggle, Screenshot, Quit
- Double-click to show window

### Platform Support

- macOS: DMG installer
- Windows: NSIS installer + portable
- Linux: AppImage + DEB

---

## Known Limitations / Bugs

| Issue | Impact |
|-------|--------|
| Window movement broken (step=0) | Arrow keys don't move window |
| AbortController not wired | Can't cancel in-flight LLM requests |
| Ollama limited to text | No multimodal support in Ollama path |
| Worker script unused | Placeholder code, not integrated |
| No tests | Zero test coverage |

---

## Environment Configuration

| Variable | Purpose | Default |
|----------|---------|---------|
| `GEMINI_API_KEY` | Gemini API key | Required |
| `USE_OLLAMA` | Enable local Ollama | `false` |
| `OLLAMA_MODEL` | Ollama model name | Auto-detect |
| `OLLAMA_URL` | Ollama server URL | `localhost:11434` |
| `NODE_ENV` | Environment | - |
| `IS_DEV_TEST` | Mock testing mode | `false` |
