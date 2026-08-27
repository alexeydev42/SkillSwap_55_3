import { ChangeEventHandler, ReactNode, useState } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  showPasswordIcon?: ReactNode;
  hidePasswordIcon?: ReactNode;
  borderless?: boolean;
}

export const Input = (props: InputProps) => {
  const {
    label,
    placeholder,
    type = 'text',
    error,
    helperText,
    disabled,
    className,
    icon,
    trailingIcon,
    value,
    defaultValue,
    onChange,
    showPasswordIcon,
    hidePasswordIcon,
    borderless,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div className={clsx(styles['input-container'], className)}>
      {label && <label className={styles['input-label']}>{label}</label>}

      <div
        className={clsx(
          styles['input-wrapper'],
          borderless && styles.borderless,
          error && styles.error,
          disabled && styles.disabled
        )}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
            className={styles['password-button']}
          >
            {isPasswordVisible ? hidePasswordIcon : showPasswordIcon}
          </button>
        )}
        {trailingIcon && <span className={styles['trailing-icon']}>{trailingIcon}</span>}
      </div>

      {error ? (
        <span className={styles['error-text']}>{error}</span>
      ) : (
        helperText && <span className={styles['helper-text']}>{helperText}</span>
      )}
    </div>
  );
};