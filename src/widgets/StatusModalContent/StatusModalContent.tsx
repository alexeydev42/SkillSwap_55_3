import styles from './StatusModalContent.module.css'
import { Button } from '@/shared/ui/Button'

interface StatusModalContentProps {
  icon: string
  title: string
  text: string
  buttonText: string
}

export const StatusModalContent = ({ icon, title, text, buttonText }: StatusModalContentProps) => {
  return (
    <div className={styles['modal-content__wrapper']}>
      <div className={styles['modal-content__icon-wrapper']}>
        <img className={styles['modal-content__icon']} src={icon} alt="" />
      </div>
      <h2 className={styles['modal-content__title']}>{title}</h2>
      <p className={styles['modal-content__text']}>{text}</p>
      <Button className={styles['modal-content__button']}>{buttonText}</Button>
    </div>
  )
}
