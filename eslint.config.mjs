import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import _xo from 'eslint-config-xo';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
/*
Workaround for this error

```
Oops! Something went wrong! :(

ESLint: 9.38.0

TypeError: Key "languageOptions": allowTrailingCommas option is only available in JSONC.
```
*/
const omit = (property, { [property]: _, ...object }) => object;
const xo = _xo.map((config) =>
  config.languageOptions?.allowTrailingCommas
    ? {
        ...config,
        languageOptions: omit('allowTrailingCommas', config.languageOptions),
      }
    : config,
);

export default defineConfig([
  ...xo,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['apps/dashboard/.output', 'packages/ui', 'packages/api'],
  },
]);
