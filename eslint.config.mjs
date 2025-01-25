// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { flatConfigs } from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          tsconfigRootDir: import.meta.url,
        },
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowWithDecorator: true,
        },
      ],
      '@typescript-eslint/require-await': [
        'off',
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'angle-bracket',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      'no-return-await': 'off',
      '@typescript-eslint/return-await': [
        'error',
        'always',
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'off',
      ],
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true
          },
          'newlines-between': 'always',
        },
      ],
      'spaced-comment': [
        'error',
        'always',
      ],
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 0,
          maxBOF: 0,
        },
      ],
      indent: [
        'error',
        2,
      ],
      'linebreak-style': [
        'error',
        'unix',
      ],
      quotes: [
        'error',
        'single',
      ],
      semi: [
        'error',
        'always',
      ],
      'no-loop-func': [
        'error',
      ],
      'block-spacing': [
        'error',
        'always',
      ],
      camelcase: [
        'error',
      ],
      'brace-style': [
        'error',
        '1tbs',
        { allowSingleLine: true },
      ],
      'comma-style': [
        'error',
        'last',
      ],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'eol-last': [
        'error',
      ],
      'func-call-spacing': [
        'error',
        'never',
      ],
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'minimum',
        },
      ],
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
          overrides: {
            function: {
              after: false,
            },
          },
        },
      ],
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreUrls: true,
        },
      ],
      'max-nested-callbacks': [
        'error',
        {
          max: 7,
        },
      ],
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
          properties: true,
        },
      ],
      'new-parens': [
        'error',
      ],
      'no-lonely-if': [
        'error',
      ],
      'no-trailing-spaces': [
        'error',
      ],
      'no-unneeded-ternary': [
        'error',
      ],
      'no-whitespace-before-property': [
        'error',
      ],
      'object-curly-spacing': [
        'error',
        'always',
      ],
      'operator-assignment': [
        'error',
        'always',
      ],
      'operator-linebreak': [
        'error',
        'after',
      ],
      'semi-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'space-before-blocks': [
        'error',
        'always',
      ],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'space-in-parens': [
        'error',
        'never',
      ],
      'space-infix-ops': [
        'error',
      ],
      'space-unary-ops': [
        'error',
        {
          words: true,
          nonwords: false,
          overrides: {
            typeof: false,
          },
        },
      ],
      'no-unreachable': [
        'error',
      ],
      'no-global-assign': [
        'error',
      ],
      'no-self-compare': [
        'error',
      ],
      'no-unmodified-loop-condition': [
        'error',
      ],
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],
      'no-console': [
        'error',
      ],
      'no-useless-concat': [
        'error',
      ],
      'no-useless-escape': [
        'error',
      ],
      'no-shadow-restricted-names': [
        'error',
      ],
      'no-use-before-define': [
        'error',
        {
          functions: false,
        },
      ],
      'arrow-parens': [
        'error',
        'always',
      ],
      'arrow-body-style': [
        'error',
        'as-needed',
      ],
      'arrow-spacing': [
        'error',
      ],
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true,
        },
      ],
      'no-useless-computed-key': [
        'error',
      ],
      'no-useless-rename': [
        'error',
      ],
      'no-var': [
        'error',
      ],
      'object-shorthand': [
        'error',
        'always',
      ],
      'prefer-arrow-callback': [
        'error',
      ],
      'prefer-const': [
        'error',
      ],
      'prefer-numeric-literals': [
        'error',
      ],
      'prefer-rest-params': [
        'error',
      ],
      'prefer-spread': [
        'error',
      ],
      'rest-spread-spacing': [
        'error',
        'never',
      ],
      'template-curly-spacing': [
        'error',
        'never',
      ],
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
    },
  },
);