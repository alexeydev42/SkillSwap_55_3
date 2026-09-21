import { useState, useRef, useEffect, useId } from 'react'
import clsx from 'clsx'
import styles from './Select.module.css'

export type SelectOption = {
  value: string
  label: string
}

export type SelectProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  error?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Выберите значение',
  label,
  disabled = false,
  error,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const selectedLabel = options.find((opt) => opt.value === value)?.label

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div className={clsx(styles.root, className)} ref={rootRef}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        className={clsx(styles.trigger, {
          [styles.triggerOpen]: isOpen,
          [styles.disabled]: disabled,
          [styles.error]: error,
        })}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={!!error}
      >
        <span className={selectedLabel ? styles.value : styles.placeholder}>
          {selectedLabel ?? placeholder}
        </span>
        <span
          className={clsx(styles.chevron, { [styles.chevronOpen]: isOpen })}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul className={styles.list} role="listbox">
          {options.length === 0 ? (
            <li
              className={styles.option}
              style={{ color: 'var(--color-disabled-text)' }}
              aria-disabled="true"
            >
              Нет доступных опций
            </li>
          ) : (
            options.map((option) => (
              <li
                key={option.value}
                className={clsx(styles.option, {
                  [styles.optionSelected]: option.value === value,
                })}
                role="option"
                aria-selected={option.value === value}
                tabIndex={0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelect(option.value)
                  }
                }}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
