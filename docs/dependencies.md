# Dependencies

## Summary

- **Production:** 18 packages
- **Dev:** 19 packages
- **Vulnerabilities:** 34 (13 high, 20 moderate, 1 low)

## Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/generative-ai` | 0.2.1 | Gemini AI SDK |
| `@radix-ui/react-dialog` | 1.1.2 | Dialog primitive |
| `@radix-ui/react-toast` | 1.2.2 | Toast primitive |
| `axios` | 1.11.0 | HTTP client |
| `lucide-react` | 0.460.0 | Icons |
| `react` | 18.3.1 | UI framework |
| `react-dom` | 18.3.1 | React DOM |
| `react-query` | 3.39.3 | Server state |
| `react-syntax-highlighter` | 15.6.6 | Code highlighting |
| `screenshot-desktop` | 1.15.2 | Screen capture |
| `sharp` | 0.33.5 | Image processing |
| `tesseract.js` | 5.1.1 | OCR engine |
| `uuid` | 11.1.0 | UUID generation |

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `electron` | 33.4.11 | Desktop runtime |
| `electron-builder` | 25.1.8 | App packaging |
| `vite` | 5.4.11 | Build tool |
| `typescript` | 5.9.2 | Type system |
| `tailwindcss` | 3.4.17 | CSS framework |

## Security Issues

### High Severity

| Package | Issue | Fix |
|---------|-------|-----|
| `@electron/rebuild` | CVE via tar/node-gyp | electron-builder@26.8.1 |
| `tar` | Path traversal | Via electron-builder update |
| `node-gyp` | Multiple high | Via electron-builder update |

### Priority Fixes

```bash
# 1. Security - upgrade electron-builder
npm install --save-dev electron-builder@^26.8.1

# 2. Run audit fix
npm audit fix

# 3. Safe upgrades
npm update axios autoprefixer typescript
```

## Outdated Packages

### Major Gaps

| Package | Installed | Latest | Notes |
|---------|-----------|--------|-------|
| `electron` | 33.4.11 | 40.4.1 | 7 majors behind |
| `react` | 18.3.1 | 19.2.4 | React 19 available |
| `tailwindcss` | 3.4.17 | 4.1.18 | v4 full rewrite |
| `tesseract.js` | 5.1.1 | 7.0.0 | 2 majors behind |
| `electron-builder` | 25.1.8 | 26.8.1 | Security fixes |

## Issues to Address

1. **Duplicate AI SDKs:** Both `@google/genai` and `@google/generative-ai` installed
   - Remove `@google/genai` (unused)

2. **Deprecated types:** `@types/electron` conflicts with built-in types
   - Run: `npm uninstall @types/electron`

3. **Old react-query:** v3 is unmaintained
   - Migrate to `@tanstack/react-query` v5

4. **Dual lock files:** Both npm and pnpm locks exist
   - Choose one, delete the other

5. **Duplicate icons:** Both `react-icons` and `lucide-react`
   - Consolidate to one library

## Missing Config

- No `.env.example` file
- No `.nvmrc` or `engines` field
- No ESLint config file
