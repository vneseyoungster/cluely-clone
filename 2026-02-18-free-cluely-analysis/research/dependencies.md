# Dependency Analysis: free-cluely

**Date:** 2026-02-18
**Session:** free-cluely-analysis

---

## Summary

- **Runtime dependencies:** 18
- **Dev dependencies:** 19
- **Security vulnerabilities:** 34 (1 low, 20 moderate, 13 high)
- **Lock files:** Both `package-lock.json` and `pnpm-lock.yaml` (inconsistent)

---

## Categorized Dependencies

### Electron / Desktop

| Package | Version | Purpose |
|---------|---------|---------|
| `electron` | ^33.2.0 | Desktop app runtime |
| `electron-builder` | ^25.1.8 | Cross-platform packaging |
| `electron-is-dev` | ^3.0.1 | Environment detection |
| `vite-plugin-electron` | ^0.28.8 | Vite + Electron main process |
| `vite-plugin-electron-renderer` | ^0.14.6 | Vite + Electron renderer |

### Build Toolchain

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.4.11 | Frontend bundler |
| `typescript` | ^5.6.3 | TypeScript compiler |
| `@vitejs/plugin-react` | ^4.3.3 | React fast refresh |
| `postcss` | ^8.4.49 | CSS transformations |
| `autoprefixer` | ^10.4.20 | CSS vendor prefixes |
| `tailwindcss` | ^3.4.15 | Utility CSS framework |

### UI / React

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | DOM rendering |
| `@radix-ui/react-dialog` | ^1.1.2 | Modal dialog |
| `@radix-ui/react-toast` | ^1.2.2 | Toast notifications |
| `lucide-react` | ^0.460.0 | SVG icons |
| `react-icons` | ^5.3.0 | Additional icons |
| `tailwind-merge` | ^2.5.4 | Class merging |
| `clsx` | ^2.1.1 | Conditional classes |
| `class-variance-authority` | ^0.7.0 | Variant styling |

### AI / Machine Learning

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/genai` | ^0.12.0 | Gemini SDK (newer) |
| `@google/generative-ai` | ^0.2.1 | Gemini SDK (older, redundant) |
| `tesseract.js` | ^5.0.5 | OCR |

### Code Display

| Package | Version | Purpose |
|---------|---------|---------|
| `react-syntax-highlighter` | ^15.6.1 | Syntax highlighting |
| `react-code-blocks` | ^0.1.6 | Code blocks (redundant) |

### HTTP / Data

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.7.7 | HTTP client |
| `react-query` | ^3.39.3 | Server state (OUTDATED) |
| `form-data` | ^4.0.1 | Multipart requests |

### Image / File Processing

| Package | Version | Purpose |
|---------|---------|---------|
| `sharp` | ^0.33.5 | Image processing |
| `screenshot-desktop` | ^1.15.0 | Screen capture |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `uuid` | ^11.0.3 | UUID generation |
| `diff` | ^7.0.0 | Text diff |

---

## Security Vulnerabilities

| Package | Severity | Issue |
|---------|----------|-------|
| `axios` | HIGH | DoS + Prototype pollution |
| `tar` | HIGH | Path traversal, symlink poisoning |
| `jws` | HIGH | Improper signature verification |
| `ajv` | MODERATE | ReDoS |
| `lodash` | MODERATE | Prototype pollution |
| `prismjs` | MODERATE | DOM Clobbering (unfixable) |

---

## Outdated Packages (Major Gaps)

| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `react-query` | ^3.39.3 | 5.x | EOL, renamed to @tanstack/react-query |
| `@google/genai` | ^0.12.0 | 1.41.0 | Major API changes |
| `react` | ^18.3.1 | 19.x | React 19 available |
| `tesseract.js` | ^5.0.5 | 7.0.0 | Breaking API changes |
| `uuid` | ^11.0.3 | 13.0.0 | Major version gap |

---

## Redundant/Deprecated Packages

| Package | Issue | Recommendation |
|---------|-------|----------------|
| `@google/generative-ai` | Old SDK, `@google/genai` is replacement | Remove |
| `react-code-blocks` | Wraps react-syntax-highlighter | Remove, use direct |
| `react-query` v3 | EOL | Migrate to @tanstack/react-query v5 |

---

## Package Manager Conflict

Both `package-lock.json` and `pnpm-lock.yaml` exist. This indicates mixed usage of npm and pnpm, which can cause inconsistent installs across environments.

**Recommendation:** Choose one package manager and delete the other lock file.
