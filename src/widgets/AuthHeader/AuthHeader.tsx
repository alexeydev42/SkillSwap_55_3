import { useNavigate } from 'react-router-dom'

import CrossIcon from '../../shared/assets/icons/icon-cross.svg?react'
import { ROUTES } from '../../shared/lib/constants'
import { Button } from '../../shared/ui/Button'
import { Logo } from '../../shared/ui/Logo'

import styles from './AuthHeader.module.css'

export const AuthHeader = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate(ROUTES.HOME)
  }

  return (
    <header className={styles.header}>
      <Logo compactOnMobile />

      <Button
        className={styles.closeButton}
        variant="tertiary"
        size="md"
        icon={<CrossIcon />}
        iconPosition="right"
        onClick={handleClose}
      >
        Закрыть
      </Button>
    </header>
  )
}
