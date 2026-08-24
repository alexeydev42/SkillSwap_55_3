import { ReactNode } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  children: ReactNode
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles['modal-wrapper']}>{children}</div>
    </>
  )
}
