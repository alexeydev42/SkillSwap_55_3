import { Link } from 'react-router-dom'

import LogoutIcon from '@/shared/assets/icons/icon-logout.svg?react'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { DropdownContainer } from '@/shared/ui/DropdownContainer'

import styles from './ProfileMenuDropdown.module.css'

interface ProfileMenuDropdownProps {
  onLogout?: () => void
}

export const ProfileMenuDropdown = ({ onLogout }: ProfileMenuDropdownProps) => (
  <DropdownContainer className={styles.dropdown}>
    <Link className={styles.profileLink} to={ROUTES.PROFILE}>
      Личный кабинет
    </Link>

    <Button
      variant="tertiary"
      size="sm"
      className={styles.logoutItem}
      onClick={onLogout}
      icon={<LogoutIcon />}
      iconPosition="right"
    >
      Выйти из аккаунта
    </Button>
  </DropdownContainer>
)
