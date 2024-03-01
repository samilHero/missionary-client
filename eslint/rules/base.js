// NOTE: https://eslint.org/docs/rules/
module.exports = {
  rules: {
    /**
     * @description 세미 콜론 여부
     * @link https://eslint.org/docs/latest/rules/semi
     */
    semi: [2, 'always'],
    /**
     * @description 최상위 모듈
     * @link https://eslint.org/docs/latest/rules/global-require
     */
    'global-require': 'off',
    /**
     * @description 외부 패키지 사용 금지
     * @link https://github.com/import-js/eslint-plugin-import/blob/v2.26.0/docs/rules/no-extraneous-dependencies.md
     */
    'import/no-extraneous-dependencies': 'off',
    /**
     * @description 매개변수 재할당 여부
     * @link https://eslint.org/docs/latest/rules/no-param-reassign
     */
    'no-param-reassign': 'off',
    /**
     * @description 외부 변수 재할당 여부
     * @link https://eslint.org/docs/latest/rules/no-shadow
     */
    'no-shadow': 'off',
    /**
     * @description 중첩 삼항연산자
     * @link https://eslint.org/docs/latest/rules/no-nested-ternary
     */
    'no-nested-ternary': 'warn',
    /**
     * @description 제한 없는 구문
     * @link https://eslint.org/docs/latest/rules/no-restricted-syntax
     */
    'no-restricted-syntax': 'off',
    /**
     * @description 반환값 명시 여부
     * @link https://eslint.org/docs/latest/rules/consistent-return
     */
    'consistent-return': 'off',
    /**
     * @description 콘솔 여부
     * @link https://eslint.org/docs/latest/rules/no-console
     */
    'no-console': 'warn',
  },
};
