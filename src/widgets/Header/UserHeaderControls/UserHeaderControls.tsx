import type { MouseEventHandler } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { Avatar } from '@/shared/ui/Avatar'
import NotificationIcon from '../../../shared/assets/icons/icon-notification.svg?react'
import LikeIcon from '../../../shared/assets/icons/icon-like.svg?react'
import { ProfileMenuDropdown } from '../ProfileMenuDropdown'
import styles from './UserHeaderControls.module.css'

export interface UserHeaderControlsProps {
  userName: string
  avatarSrc: string
  isProfileMenuOpen?: boolean
  onProfileClick?: MouseEventHandler<HTMLButtonElement>
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>
  onFavoritesClick?: MouseEventHandler<HTMLButtonElement>
}

export const UserHeaderControls = ({
  userName,
  avatarSrc,
  isProfileMenuOpen = false,
  onProfileClick,
  onNotificationsClick,
  onFavoritesClick,
}: UserHeaderControlsProps) => {
  return (
    <div className={styles['controls']}>
      <div className={styles.icons}>
        <IconButton
          icon={<NotificationIcon />}
          onClick={onNotificationsClick}
          aria-label="Кнопка уведомлений"
        />
        <IconButton icon={<LikeIcon />} onClick={onFavoritesClick} aria-label="Кнопка избранного" />
      </div>

      <div className={styles.profileWrapper}>
        <button
          className={styles.userInfo}
          type="button"
          onClick={onProfileClick}
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="menu"
        >
          <span className={styles.userName}>{userName}</span>
          <Avatar src={avatarSrc} size="small" />
        </button>

        {/* Меню появляется только в открытом состоянии. */}
        {isProfileMenuOpen && <ProfileMenuDropdown />}
      </div>
    </div>
  )
}
