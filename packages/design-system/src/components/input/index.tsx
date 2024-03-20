import React from 'react';
import type { InputHTMLAttributes } from 'react';
interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType: string;
  disabled: boolean;
  value: string;
  onChange: () => void;
  onClick: () => void;
}

const Input: React.FC<IInputProps> = React.forwardRef(
  (
    { inputType = 'text', disabled, value, onChange, onClick, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ): JSX.Element => {
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
  },
);

export default Input;
