const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');
const unusedImports = require('eslint-plugin-unused-imports');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    prettierConfig,
    {
        files: ['src/**/*.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.webextensions,
            },
        },
        plugins: {
            prettier,
            'unused-imports': unusedImports,
            import: importPlugin,
        },
        rules: {
            'prettier/prettier': ['error', {
                printWidth: 120,
                semi: true,
                singleQuote: true,
                tabWidth: 2,
                trailingComma: 'all',
                useTabs: false,
                endOfLine: 'lf',
                arrowParens: 'avoid',
            }],

            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': ['warn', {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            }],

            'prefer-const': 'warn',
            'no-shadow': 'warn',
            'no-param-reassign': 'warn',
            'consistent-return': 'warn',
            'no-plusplus': 'warn',
            'camelcase': 'off',

            'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
            'import/no-extraneous-dependencies': 'off',
            'import/prefer-default-export': 'off',

            'padding-line-between-statements': ['error',
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any',    prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'any',    prev: 'import', next: 'import' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: '*', next: 'if' },
                { blankLine: 'always', prev: 'if', next: '*' },
                { blankLine: 'always', prev: '*', next: 'for' },
                { blankLine: 'always', prev: 'for', next: '*' },
                { blankLine: 'always', prev: '*', next: 'function' },
                { blankLine: 'always', prev: 'function', next: '*' },
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: ['case', 'default'], next: '*' },
            ],
        },
    },
    {
        ignores: ['dist/**'],
    },
];