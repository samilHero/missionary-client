import React, { InputHTMLAttributes } from 'react';
interface ICommonInput extends InputHTMLAttributes<HTMLInputElement> {
  inputType: string;
  disabled: boolean;
  value: string;
  onChange: () => void;
  onClick: () => void;
}

function CommonInput({
  inputType = 'text',
  disabled = false,
  value,
  onChange,
  onClick,
  ...rest
}: ICommonInput): JSX.Element {
  const handlerChangeInput = () => {};

  return (
    <div>
      <input
        type={inputType}
        disabled={disabled}
        autoComplete="off"
        value={value}
        onChange={onChange}
        onClick={onClick}
        {...rest}
      />
    </div>
  );
}

export default CommonInput;
