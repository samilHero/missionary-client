module.exports = {
  rules: {
    /**
     * @description JSX 확장명 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
     */
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', 'tsx', 'ts'] },
    ],
    /**
     * @description React jsx 허용 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
     */
    'react/react-in-jsx-scope': 'off',
    /**
     * @description JSX props spread 허용 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
     */
    'react/jsx-props-no-spreading': 'off',
    /**
     * @description optional proptype 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
     */
    'react/require-default-props': 'off',
    /**
     * @description 함수 컴포넌트
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
     */
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    /**
     * @description 빈 JSX 반환 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
     */
    'react/jsx-no-useless-fragment': 'off',
    /**
     * @description 배열 내 index 키 사용 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
     */
    'react/no-array-index-key': 'off',
    /**
     * @description 미사용 proptype
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
     */
    'react/no-unused-prop-types': 'warn',
    /**
     * @description 컴포넌트 내 컴포넌트 구성
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
     */
    'react/no-unstable-nested-components': 'warn',
    /**
     * @description 버튼 엘리먼트 타입 명시 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
     */
    'react/button-has-type': 'off',
    /**
     * @description JSX 내 중괄호 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
     */
    'react/jsx-curly-brace-presence': 'off',
    /**
     * @description 구조분해할당 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
     */
    'react/destructuring-assignment': 'off',
    /**
     * @description PropTypes 사용 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md
     */
    'react/prop-types': 'off',
    /**
     * @description 알 수 없는 DOM 속성 작성 금지
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
     */
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
  },
};
