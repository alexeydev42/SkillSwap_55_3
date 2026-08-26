import { ReactNode, useState } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'

interface InputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
  showPasswordIcon?: ReactNode
  hidePasswordIcon?: ReactNode
  value?: string;       
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

export const Input = (props: InputProps) => {
  const {
    label,
    placeholder,
    type = 'text',
    error,
    helperText,
    disabled,
    value,              
    onChange,           
    className,
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
        <input
          className={styles.input}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          value={value}           
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
      </div>
      {error ? (
        <span className={styles['error-text']}>{error}</span>
      ) : (
        helperText && <span className={styles['helper-text']}>{helperText}</span>
      )}
    </div>
  )
}
