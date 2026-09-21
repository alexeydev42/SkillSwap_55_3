import type { ReactNode } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { StatusModalContent } from '@/widgets/StatusModalContent'
import DoneIcon from '@/shared/assets/icons/icon-done.svg?react'
import NotificationIcon from '@/shared/assets/icons/icon-notification.svg?react'
import styles from './SuccessModal.module.css'

export type SuccessModalVariant = 'created' | 'proposed'

export interface SuccessModalProps {
  /** Какое состояние модалки показать. По умолчанию — «Ваше предложение создано» */
  variant?: SuccessModalVariant
  /** Клик по кнопке «Готово». */
  onDone: () => void
}

const CONTENT: Record<SuccessModalVariant, { icon: ReactNode; title: string; text: string }> = {
  created: {
    icon: <DoneIcon />,
    title: 'Ваше предложение создано',
    text: 'Теперь вы можете предложить обмен',
  },
  proposed: {
    icon: <NotificationIcon />,
    title: 'Вы предложили обмен',
    text: 'Теперь дождитесь подтверждения. Вам придёт уведомление',
  },
}

 //SuccessModal — модалка успешного действия, два состояния: "Ваше предложение создано" и "Вы предложили обмен"

 export function SuccessModal({ variant = 'created', onDone }: SuccessModalProps) {
  const { icon, title, text } = CONTENT[variant]
  return (
    <Modal className={styles.modal} ariaLabel={title}>
      <StatusModalContent
        icon={icon}
        title={title}
        text={text}
        buttonText="Готово"
        onButtonClick={onDone}
      />
    </Modal>
  )
}
