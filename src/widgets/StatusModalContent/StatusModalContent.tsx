import { useState } from 'react'
import styles from './StatusModalContent.module.css'
import { Button } from '@/shared/ui/Button'

interface StatusModalContentProps {
  src: string
  title: string
  text: string
  buttonText: string
  onButtonClick: () => void
}

export const StatusModalContent = ({
  src,
  title,
  text,
  buttonText,
  onButtonClick,
}: StatusModalContentProps) => {
  const [isError, setIsError] = useState(false)

  return (
    <div className={styles['modal-content__wrapper']}>
      <div className={styles['modal-content__icon-wrapper']}>
        {src && !isError ? (
          <img
            className={styles['modal-content__icon']}
            src={src}
            alt=""
            onError={() => setIsError(true)}
          />
        ) : (
          <div className={styles['modal-content__icon-wrapper__no-icon']}></div>
        )}
      </div>
      <h2 className={styles['modal-content__title']}>{title}</h2>
      <p className={styles['modal-content__text']}>{text}</p>
      <Button className={styles['modal-content__button']} onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  )
}
