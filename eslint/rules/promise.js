module.exports = {
  rules: {
    /**
     * @description Callback 보다 Async/Await 선호
     * @link https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-callbacks.md
     */
    'promise/prefer-await-to-callbacks': 'error',
    /**
     * @description Promise 보다 Async/Await 선호
     * @link https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-then.md
     */
    'promise/prefer-await-to-then': 'off',
  },
};
