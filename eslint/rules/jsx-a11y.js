module.exports = {
  rules: {
    /**
     * @description click 이벤트 접근성
     * @link https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
     */
    'jsx-a11y/click-events-have-key-events': 'off',
    /**
     * @description role 관련 접근성
     * @link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md
     */
    'jsx-a11y/no-static-element-interactions': 'off',
    /**
     * @description label 접근성
     * @link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
     */
    'jsx-a11y/label-has-associated-control': 'off',
    /**
     * @description 인터렉티브 요소 역할 명시 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/20b082a890f8e27320c6b2b3587edc6d0b735c97/docs/rules/no-noninteractive-element-interactions.md
     */
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    /**
     * @description Anchor 하이퍼 링크 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/20b082a890f8e27320c6b2b3587edc6d0b735c97/docs/rules/anchor-is-valid.md
     */
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    /**
     * @description Anchor 내용 첨부 여부
     * @link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/93f78856655696a55309440593e0948c6fb96134/docs/rules/anchor-has-content.md
     */
    'jsx-a11y/anchor-has-content': 'off',
  },
};
