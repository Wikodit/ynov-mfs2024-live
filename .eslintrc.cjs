// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  extends: ['@wikodit/eslint-config-typescript/configs/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },
  rules: {
    /** Those rules does not work correctly atm */
    '@typescript-eslint/no-invalid-this': 'off',
    'unicorn/expiring-todo-comments': 'off',
    '@typescript-eslint/quotes': 'off', // + prettier does the work

    /** Better */
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],

    /** Useless for typescript */
    'jsdoc/require-param': 0,
    'jsdoc/require-returns': 0,
    'jsdoc/newline-after-description': 0,
    'jsdoc/check-tag-names': ['warn', { definedTags: ['link'] }],

    /** Overrides */
    'unicorn/filename-case': 0,
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          Param: true,
          Req: true,
          Res: true,
          Props: true,
          Args: true,
          args: true,
          Env: true,
          env: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['**/*'],
      rules: {
        // Too slow
        'import/no-cycle': 'off',
        '@typescript-eslint/no-misused-promises': 'off',

        // Use VSCode prettier
        'prettier/prettier': 'off',
      },
    },
  ],
};
