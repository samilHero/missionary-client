module.exports = {
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    /**
     * @description 블록에 단 하나의 문이 포함될 경우 블록을 생략할 수 있다
     * @link https://github.com/prettier/eslint-config-prettier#curly
     */
    curly: ['error', 'all'],
  },
};
