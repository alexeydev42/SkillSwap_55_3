import { ReactNode, useEffect, useRef } from 'react'
import styles from './Modal.module.css'
import clsx from 'clsx'

interface ModalProps {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

export const Modal = ({
  children,
  className,
  ariaLabel = 'Диалоговое окно',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement | null

    modalRef.current?.focus()

    return () => {
      previousActiveElement?.focus()
    }
  }, [])

  return (
    <>
      <div className={styles.overlay} aria-hidden="true" />

      <div
        ref={modalRef}
        className={clsx(styles['modal-wrapper'], className ?? styles.default)}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </div>
    </>
  )
}
