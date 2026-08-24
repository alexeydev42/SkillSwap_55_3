import React from 'react'
import styles from './Spinner.module.css'

export interface SpinnerProps {
  size?: number | string
  className?: string
  label?: string
  centered?: boolean
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  className = '',
  label = 'Загрузка...',
  centered = false,
}) => {
  return (
    <div
      className={`${styles.spinner} ${className} ${centered ? styles.centered : ''}`}
      style={{ '--spinner-size': `${size}px` } as React.CSSProperties}
      role="status"
      aria-label={label}
    />
  )
}
