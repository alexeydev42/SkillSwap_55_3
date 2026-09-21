import React, { useId } from 'react'
import styles from './Textarea.module.css'
import clsx from 'clsx'

interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export const Textarea = (props: TextareaProps) => {
  const textareaId = useId()
  const messageId = `${textareaId}-message`
  const { label, placeholder, value, onChange, error, helperText, disabled, className } = props

  return (
    <div className={clsx(styles['textarea-container'], className)}>
      {label && (
        <label className={styles['textarea-label']} htmlFor={textareaId}>
          {label}
        </label>
      )}

      <div
        className={clsx(
          styles['textarea-wrapper'],
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        <textarea
          id={textareaId}
          className={styles.textarea}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
        />
      </div>

      {error ? (
        <span id={messageId} className={styles['textarea-error']}>
          {error}
        </span>
      ) : (
        helperText && (
          <span id={messageId} className={styles['textarea-helperText']}>
            {helperText}
          </span>
        )
      )}
    </div>
  )
}
