import { useEffect, useRef, type MouseEventHandler } from 'react'

import NotificationIcon from '@/shared/assets/icons/icon-notification.svg?react'
import LikeIcon from '@/shared/assets/icons/icon-like.svg?react'
import { Avatar } from '@/shared/ui/Avatar'
import { IconButton } from '@/shared/ui/IconButton'
import type { NotificationView } from '@/store/slices/notificationsSlice'

import { NotificationsDropdown } from '../NotificationsDropdown'
import { ProfileMenuDropdown } from '../ProfileMenuDropdown'

import styles from './UserHeaderControls.module.css'

export interface UserHeaderControlsProps {
  userName: string
  avatarSrc: string
  notifications: NotificationView[]
  hasUnreadNotifications: boolean
  isProfileMenuOpen?: boolean
  isNotificationsMenuOpen?: boolean
  onProfileClick?: MouseEventHandler<HTMLButtonElement>
  onProfileMenuClose?: () => void
  onLogout?: () => void
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>
  onNotificationsMenuClose?: () => void
  onMarkAllNotificationsAsRead: () => void
  onClearReadNotifications: () => void
  onFavoritesClick?: MouseEventHandler<HTMLButtonElement>
}

export const UserHeaderControls = ({
  userName,
  avatarSrc,
  notifications,
  hasUnreadNotifications,
  isProfileMenuOpen = false,
  isNotificationsMenuOpen = false,
  onProfileClick,
  onProfileMenuClose,
  onNotificationsClick,
  onNotificationsMenuClose,
  onMarkAllNotificationsAsRead,
  onClearReadNotifications,
  onFavoritesClick,
  onLogout,
}: UserHeaderControlsProps) => {
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Закрывает меню профиля при нажатии снаружи.
  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        onProfileMenuClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileMenuOpen, onProfileMenuClose])

  // Закрывает уведомления при нажатии снаружи.
  useEffect(() => {
    if (!isNotificationsMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        onNotificationsMenuClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationsMenuOpen, onNotificationsMenuClose])

  return (
    <div className={styles.controls}>
      <div className={styles.icons}>
        <div className={styles.notificationsWrapper} ref={notificationsRef}>
          <div className={styles.notificationButton}>
            <IconButton
              icon={<NotificationIcon />}
              onClick={onNotificationsClick}
              aria-label="Кнопка уведомлений"
              aria-expanded={isNotificationsMenuOpen}
            />

            {hasUnreadNotifications && (
              <span className={styles.unreadIndicator} aria-label="Есть новые уведомления" />
            )}
          </div>

          {/* Показывает итоговый список уведомлений. */}
          {isNotificationsMenuOpen && (
            <div className={styles.notificationsDropdown}>
              <NotificationsDropdown
                notifications={notifications}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onClearReadNotifications={onClearReadNotifications}
              />
            </div>
          )}
        </div>

        <IconButton icon={<LikeIcon />} onClick={onFavoritesClick} aria-label="Кнопка избранного" />
      </div>

      <div className={styles.profileWrapper} ref={profileRef}>
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

        {/* Показывает меню авторизованного пользователя. */}
        {isProfileMenuOpen && <ProfileMenuDropdown onLogout={onLogout} />}
      </div>
    </div>
  )
}
