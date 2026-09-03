import { Modal } from '@/shared/ui/Modal'
import { StatusModalContent } from '@/widgets/StatusModalContent'
import DoneIcon from '@/shared/assets/icons/icon-done.svg?react'

import styles from './SuccessModal.module.css'

export interface SuccessModalProps {
  /** Клик по кнопке «Готово». */
  onDone: () => void
}

/**
 * SuccessModal (VERST-60) — модалка «Ваше предложение создано».
 * Полностью собрана из готовых компонентов (Modal, StatusModalContent) —
 * собственной вёрстки оверлея, контейнера модалки или кнопки здесь нет.
 */
export function SuccessModal({ onDone }: SuccessModalProps) {
  return (
    <Modal className={styles.modal}>
      <StatusModalContent
        icon={<DoneIcon />}
        title="Ваше предложение создано"
        text="Теперь вы можете предложить обмен"
        buttonText="Готово"
        onButtonClick={onDone}
      />
    </Modal>
  )
}
