import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonIconPosition = 'left' | 'right'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Визуальный вариант кнопки. По умолчанию primary. */
  variant?: ButtonVariant
  /** Размер кнопки. По умолчанию md. */
  size?: ButtonSize
  /** Иконка слева или справа от текста (см. iconPosition). */
  icon?: ReactNode
  /** Сторона, с которой рендерится icon. По умолчанию left. */
  iconPosition?: ButtonIconPosition
  /** Текст кнопки. */
  children?: ReactNode
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], styles[`size-${size}`], className)}
      {...rest}
    >
      {icon ? (
        <span className={cx(styles.icon, styles[`icon-${iconPosition}`])} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  )
}
