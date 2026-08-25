import { ReactNode, useState } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'

export interface InputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
  /** Иконка слева от поля ввода (например, лупа для поиска). */
  icon?: ReactNode
  showPasswordIcon?: ReactNode
  hidePasswordIcon?: ReactNode
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
    showPasswordIcon,
    hidePasswordIcon,
  } = props

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type

  return (
    <div className={clsx(styles['input-container'], className)}>
      {label && <label className={styles['input-label']}>{label}</label>}

      <div
        className={clsx(
          styles['input-wrapper'],
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
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
      </div>
      {error ? (
        <span className={styles['error-text']}>{error}</span>
      ) : (
        helperText && <span className={styles['helper-text']}>{helperText}</span>
      )}
    </div>
  )
}
