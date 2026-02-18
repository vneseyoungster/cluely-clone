# Dependency Audit Report

**Project:** cluely-clone / free-cluely (interview-coder)
**Date:** 2026-02-18
**Auditor:** dependency-researcher agent

---

## Dependency Summary

- **Total direct dependencies:** 18 (production) + 19 (dev) = 37
- **Direct production dependencies:** 18
- **Dev dependencies:** 19
- **Total vulnerabilities found:** 34 (13 high, 20 moderate, 1 low)

---

## Package Manager

**Primary lock files detected:**
- `package-lock.json` (11,158 lines) — npm lock file
- `pnpm-lock.yaml` (6,743 lines) — pnpm lock file

Both lock files are present, indicating the project may have been used with both npm and pnpm at different times. This creates a potential for dependency resolution inconsistencies. Recommend choosing one package manager and removing the other lock file.

**Recommended:** Use npm (package-lock.json) as it aligns with the scripts defined in package.json.

---

## Core (Production) Dependencies

| Package | Version (installed) | Purpose |
|---------|---------------------|---------|
| `@google/genai` | 0.12.0 | Google Generative AI SDK (newer unified client) |
| `@google/generative-ai` | 0.2.1 | Google Generative AI SDK (legacy — used actively in LLMHelper.ts) |
| `@radix-ui/react-dialog` | 1.1.2 | Accessible dialog/modal primitive |
| `@radix-ui/react-toast` | 1.2.2 | Accessible toast notification primitive |
| `axios` | 1.11.0 | HTTP client for API calls |
| `class-variance-authority` | 0.7.0 | Tailwind variant utility for component styling |
| `clsx` | 2.1.1 | Conditional className utility |
| `diff` | 7.0.0 | Text diff computation library |
| `form-data` | 4.0.1 | FormData polyfill for file/multipart uploads |
| `lucide-react` | 0.460.0 | Icon library for React |
| `react` | 18.3.1 | UI library |
| `react-code-blocks` | 0.1.6 | Code block display component |
| `react-dom` | 18.3.1 | React DOM renderer |
| `react-icons` | 5.3.0 | Icon pack collection |
| `react-query` | 3.39.3 | Server state / async data fetching |
| `react-syntax-highlighter` | 15.6.6 | Syntax highlighting component |
| `screenshot-desktop` | 1.15.2 | Desktop screenshot capture (Node.js native) |
| `sharp` | 0.33.5 | High-performance image processing |
| `tailwind-merge` | 2.6.0 | Tailwind class merging utility |
| `tesseract.js` | 5.1.1 | OCR (Optical Character Recognition) engine |
| `uuid` | 11.1.0 | UUID generation (used for screenshot file names) |

---

## Dev Dependencies

| Package | Version (installed) | Purpose |
|---------|---------------------|---------|
| `@types/color` | 4.2.0 | TypeScript types for color package |
| `@types/diff` | 6.0.0 | TypeScript types for diff |
| `@types/electron` | 1.4.38 | TypeScript types for Electron (legacy — superseded by electron built-in types) |
| `@types/node` | 22.18.1 | Node.js TypeScript types |
| `@types/react` | 18.3.24 | React TypeScript types |
| `@types/react-dom` | 18.3.7 | React DOM TypeScript types |
| `@types/react-syntax-highlighter` | 15.5.13 | Types for react-syntax-highlighter |
| `@types/screenshot-desktop` | 1.12.3 | Types for screenshot-desktop |
| `@types/uuid` | 9.0.8 | Types for uuid |
| `@typescript-eslint/eslint-plugin` | 8.43.0 | ESLint plugin for TypeScript |
| `@typescript-eslint/parser` | 8.43.0 | ESLint TypeScript parser |
| `@vitejs/plugin-react` | 4.7.0 | Vite React plugin (Babel/SWC transforms) |
| `autoprefixer` | 10.4.21 | PostCSS autoprefixer for CSS vendor prefixes |
| `concurrently` | 9.1.0 | Run multiple commands concurrently in development |
| `cross-env` | 7.0.3 | Cross-platform environment variable setting |
| `electron` | 33.4.11 | Electron desktop app runtime |
| `electron-builder` | 25.1.8 | Electron app packaging and distribution |
| `electron-is-dev` | 3.0.1 | Check if running in Electron dev mode |
| `postcss` | 8.4.49 | CSS transformation tool |
| `rimraf` | 6.0.1 | Cross-platform rm -rf utility |
| `tailwindcss` | 3.4.17 | Utility-first CSS framework |
| `typescript` | 5.9.2 | TypeScript compiler |
| `vite` | 5.4.11 | Frontend build tool / dev server |
| `vite-plugin-electron` | 0.28.8 | Vite plugin for Electron integration |
| `vite-plugin-electron-renderer` | 0.14.6 | Vite plugin for Electron renderer process |
| `wait-on` | 8.0.1 | Wait for files/ports/URLs to be available |

---

## Environment Variables

Discovered from `electron/ProcessingHelper.ts`:

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GEMINI_API_KEY` | Yes (if not using Ollama) | — | Google Gemini API authentication key |
| `USE_OLLAMA` | No | `false` | Set to `"true"` to use Ollama instead of Gemini |
| `OLLAMA_MODEL` | No | auto-detect | Ollama model name (e.g. `llama3.2`, `gemma:latest`) |
| `OLLAMA_URL` | No | `http://localhost:11434` | Ollama server URL |
| `NODE_ENV` | No | — | `"development"` for dev mode |
| `IS_DEV_TEST` | No | `false` | Enable dev test mock mode |
| `MOCK_API_WAIT_TIME` | No | `500` | Milliseconds to wait in mock API mode |

**Note:** No `.env.example` file found. The variables above were inferred from source code analysis.

---

## Key Integrations

### AI / LLM
- **Google Gemini** (`@google/generative-ai` v0.2.1) — Primary AI provider using `gemini-2.0-flash` model
  - Used in `LLMHelper.ts` for: image analysis, audio analysis, chat, solution generation, debug
  - NOTE: `@google/genai` (v0.12.0) is also installed but appears unused — this is the newer unified SDK
- **Ollama** (local LLM via HTTP REST API) — Alternative AI provider
  - Connects to local Ollama instance at `http://localhost:11434`
  - Supports any locally downloaded model (auto-detects available models)
  - Used via native fetch, no special SDK required

### Screenshot
- **screenshot-desktop** (v1.15.2) — Captures desktop screenshots from Electron main process
  - Used in `ScreenshotHelper.ts`
  - Hides the app window before capture, shows it after
  - Saves PNG files to Electron app userData directory

### OCR
- **tesseract.js** (v5.1.1) — Browser/Node.js OCR engine
  - Listed as production dependency
  - Enables text extraction from images client-side

### Image Processing
- **sharp** (v0.33.5) — High-performance image processing
  - Rebuilt during postinstall with `SHARP_IGNORE_GLOBAL_LIBVIPS=1`
  - Used for image resizing/conversion before AI analysis

---

## Build Tooling Configuration

### Runtime / Platform
- **Electron** v33.4.11 — Desktop app framework
- **Node.js** — Required (version not pinned in package.json engines field)

### Build Pipeline
```
Renderer (React/Vite) --build--> dist/
Electron main (TypeScript) --tsc--> dist-electron/
electron-builder --packages--> release/ (DMG/NSIS/AppImage)
```

### Vite Configuration
- `@vitejs/plugin-react` — JSX transforms for renderer
- `vite-plugin-electron` — Integrates Electron main process with Vite
- `vite-plugin-electron-renderer` — Allows renderer to use Node.js APIs

### TypeScript Setup
- **Two tsconfig files:**
  - `tsconfig.json` — Renderer (src/) with ESNext target, no emit (Vite handles build)
  - `tsconfig.node.json` — Electron main process (electron/)
- Strict mode enabled
- Target: ESNext for renderer, separate config for electron process

### CSS
- **Tailwind CSS** v3 with custom config (animations, keyframes, Inter font)
- **PostCSS** with autoprefixer
- Custom animations: shimmer, text-gradient-wave, in/out transitions

### App Distribution Targets
| Platform | Format | Architecture |
|----------|--------|-------------|
| macOS | DMG | x64, arm64 |
| Windows | NSIS installer | x64, ia32 |
| Windows | Portable | x64 |
| Linux | AppImage | x64 |
| Linux | DEB | x64 |

---

## Security Issues

Total: **34 vulnerabilities** (13 high, 20 moderate, 1 low)

### High Severity

| Package | Vulnerability | Fix Version | Notes |
|---------|---------------|-------------|-------|
| `@electron/rebuild` | CVE via `tar` and `node-gyp` | electron-builder@26.8.1 (major) | Indirect via electron-builder |
| `@isaacs/brace-expansion` | Uncontrolled Resource Consumption (GHSA-7h2j-956f-4vf2) | Fixed (direct upgrade available) | ReDoS vulnerability |
| `tar` | Path traversal / arbitrary file write | Via electron-builder update | Indirect dependency |
| `node-gyp` | Multiple high | Via electron-builder update | Indirect dependency |
| Others (high) | Multiple via electron-builder | electron-builder@26.8.1 | Several transitive highs |

### Moderate Severity

| Package | Vulnerability | Notes |
|---------|---------------|-------|
| `ajv` (v6) | ReDoS when using `$data` option (GHSA-2g4f-4pwh-qvx6) | Fix requires ajv>=8.18.0 |
| `@develar/schema-utils` | Via ajv | Indirect via electron-builder |
| `eslint` | Multiple moderate | No direct fix available for current versions |
| `@eslint-community/eslint-utils` | Via eslint | Indirect |
| `@typescript-eslint/*` | Via eslint | Indirect |

---

## Outdated Packages

### Major Version Gaps (Breaking Changes Expected)

| Package | Installed | Latest | Gap Type | Notes |
|---------|-----------|--------|----------|-------|
| `@google/genai` | 0.12.0 | 1.41.0 | MAJOR | Newer unified Google AI SDK — large API changes |
| `@google/generative-ai` | 0.2.1 | 0.24.1 | MINOR+ | Core AI SDK — significant updates, check API compat |
| `tesseract.js` | 5.1.1 | 7.0.0 | MAJOR | Two major versions behind |
| `electron` | 33.4.11 | 40.4.1 | MAJOR | 7 major versions behind — security and API changes |
| `react` / `react-dom` | 18.3.1 | 19.2.4 | MAJOR | React 19 has breaking changes |
| `tailwind-merge` | 2.6.0 | 3.4.1 | MAJOR | Breaking changes in v3 |
| `tailwindcss` | 3.4.17 | 4.1.18 | MAJOR | Tailwind v4 is a full rewrite |
| `cross-env` | 7.0.3 | 10.1.0 | MAJOR | 3 major versions behind |
| `diff` | 7.0.0 | 8.0.3 | MAJOR | Check for API changes |
| `@types/uuid` | 9.0.8 | 10.0.0 | MAJOR | Type definition changes |
| `electron-builder` | 25.1.8 | 26.8.1 | MAJOR | Fixes high severity security issues |

### Safe Upgrades (Patch/Minor)

| Package | Installed | Latest |
|---------|-----------|--------|
| `@typescript-eslint/eslint-plugin` | 8.43.0 | 8.56.0 |
| `@typescript-eslint/parser` | 8.43.0 | 8.56.0 |
| `autoprefixer` | 10.4.21 | 10.4.24 |
| `axios` | 1.11.0 | 1.13.5 |
| `form-data` | 4.0.4 | 4.0.5 |
| `rimraf` | 6.0.1 | 6.1.3 |
| `screenshot-desktop` | 1.15.2 | 1.15.3 |
| `typescript` | 5.9.2 | 5.9.3 |

---

## Upgrade Recommendations

### Priority 1 — Security Fixes (Do First)

1. **Upgrade `electron-builder` to v26.8.1**
   - Fixes: multiple high severity vulnerabilities in `@electron/rebuild`, `tar`, `node-gyp`, `@develar/schema-utils`
   - This is a major bump — test packaging after upgrade
   ```bash
   npm install --save-dev electron-builder@^26.8.1
   ```

2. **Upgrade `@isaacs/brace-expansion`**
   - Direct fix available via npm audit fix
   ```bash
   npm audit fix
   ```

3. **Apply all patch/minor safe upgrades**
   ```bash
   npm update axios autoprefixer form-data rimraf screenshot-desktop typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser
   ```

### Priority 2 — Address Duplicate AI SDKs

The project has both `@google/genai` (v0.12.0) and `@google/generative-ai` (v0.2.1) installed. Only `@google/generative-ai` is actually imported in `LLMHelper.ts`. Consider:
- Remove `@google/genai` if unused, OR
- Migrate to `@google/genai` v1.x (the new unified SDK) and remove `@google/generative-ai`

### Priority 3 — Major Upgrades (Plan Carefully)

| Upgrade | Effort | Benefit |
|---------|--------|---------|
| `electron` 33 -> 40 | High | Security patches, Chromium updates, perf |
| `electron-builder` 25 -> 26 | Low-Medium | Fixes highs, new packaging features |
| `react` 18 -> 19 | Medium | New React features, compiler support |
| `tailwindcss` 3 -> 4 | High | Full rewrite — config format changed |
| `tesseract.js` 5 -> 7 | Medium | Performance improvements, API changes |

### Priority 4 — Deprecated Package Check

- `@types/electron` (v1.4.38) — This is an old, unofficial types package. The official `electron` package ships its own TypeScript definitions. Remove `@types/electron` to avoid conflicts.
  ```bash
  npm uninstall @types/electron
  ```

- `react-query` v3.39.3 — The package has been renamed to `@tanstack/react-query`. v3 is no longer maintained. Migrate to `@tanstack/react-query` v5.

---

## Dependency Conflicts

- Both `package-lock.json` and `pnpm-lock.yaml` exist. Using both package managers creates inconsistencies. Choose one and delete the other lock file.
- `@google/genai` and `@google/generative-ai` both installed — redundant Google AI SDKs.
- `react-icons` and `lucide-react` both installed — two icon libraries. Consider consolidating to one.

---

## Missing Configuration

- No `.env.example` file — add one documenting required environment variables
- No `.nvmrc` or `engines` field in `package.json` — Node.js version is unspecified
- No ESLint config file detected (only `@typescript-eslint` packages installed as devDependencies)

