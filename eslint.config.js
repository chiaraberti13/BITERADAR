import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// Email content (headers, body, attachments, file names) is always hostile, and the
// app makes no network requests or persistence outside the reviewed inventory. These
// selectors fail the build on the common frontend sinks that would break those rules.
const unsafeFrontendSyntax = [
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: 'Render text through React escaping; dangerouslySetInnerHTML is not allowed.'
  },
  {
    selector: "Property[key.name='dangerouslySetInnerHTML']",
    message: 'Passing dangerouslySetInnerHTML through an object or spread is not allowed.'
  },
  {
    selector:
      "AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(innerHTML|outerHTML|srcdoc)$/]",
    message: 'Unsafe HTML assignment is not allowed; use textContent or React rendering.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.property.name=/^(insertAdjacentHTML|setHTMLUnsafe|createContextualFragment)$/]",
    message: 'Unsafe HTML parsing or insertion is not allowed.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='document'][callee.property.name=/^(write|writeln)$/]",
    message: 'document.write is an unsafe DOM sink and is not allowed.'
  },
  {
    selector: "CallExpression[callee.name='fetch']",
    message: 'Network access is deny-by-default; document a reviewed network-inventory exception before adding fetch.'
  },
  {
    selector: "NewExpression[callee.name=/^(XMLHttpRequest|WebSocket|EventSource)$/]",
    message: 'Network access is deny-by-default; document and review an exception first.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='navigator'][callee.property.name='sendBeacon']",
    message: 'Telemetry and network beacons are not allowed without an explicit reviewed exception.'
  }
];

// Email content must never be persisted. Only src/store.ts may touch localStorage, and
// only for the versioned, allowlisted UI preferences (language, theme).
const restrictedPersistenceSyntax = [
  {
    selector: "Identifier[name='localStorage']",
    message: 'localStorage is allowed only in src/store.ts for allowlisted UI preferences; email data is never persisted.'
  },
  {
    selector: 'Identifier[name=/^(sessionStorage|indexedDB)$/]',
    message: 'Unreviewed browser persistence is not allowed; email data is never persisted.'
  },
  {
    selector: "MemberExpression[object.name='document'][property.name='cookie']",
    message: 'Client-side cookie access is not allowed in this static application.'
  }
];

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.worker }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax, ...restrictedPersistenceSyntax]
    }
  },
  {
    // The preference store is the single allowed owner of localStorage.
    files: ['src/store.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax]
    }
  },
  {
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': 'off'
    }
  }
);
