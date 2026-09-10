import NotificationIcon from '@/shared/assets/icons/icon-idea.svg?react'
import { DropdownContainer } from '@/shared/ui/DropdownContainer'
import type { NotificationView } from '@/store/slices/notificationsSlice'

import styles from './NotificationsDropdown.module.css'

export interface NotificationsDropdownProps {
  notifications: NotificationView[]
  onMarkAllAsRead: () => void
  onClearReadNotifications: () => void
}

interface NotificationItemProps {
  notification: NotificationView
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

// Преобразует дату уведомления в подпись для интерфейса.
const formatNotificationDate = (createdAt: string) => {
  const notificationDate = new Date(createdAt)

  if (Number.isNaN(notificationDate.getTime())) {
    return ''
  }

  const currentDate = new Date()

  const currentDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  )

  const notificationDay = new Date(
    notificationDate.getFullYear(),
    notificationDate.getMonth(),
    notificationDate.getDate(),
  )

  const differenceInDays = Math.round(
    (currentDay.getTime() - notificationDay.getTime()) / MILLISECONDS_IN_DAY,
  )

  if (differenceInDays === 0) {
    return 'сегодня'
  }

  if (differenceInDays === 1) {
    return 'вчера'
  }

  return notificationDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

// Отображает одно уведомление без переходов и дополнительных действий.
const NotificationItem = ({ notification }: NotificationItemProps) => (
  <li className={styles.item}>
    <div className={styles.itemContent}>
      <div className={styles.message}>
        <NotificationIcon className={styles.icon} aria-hidden="true" />

        <div className={styles.textBlock}>
          <p className={styles.title}>
            Вы предложили обмен пользователю {notification.toUser.name}
          </p>

          <p className={styles.description}>Навык: {notification.toUser.offeredSkill.title}</p>
        </div>
      </div>

      <span className={styles.date}>{formatNotificationDate(notification.createdAt)}</span>
    </div>
  </li>
)

export const NotificationsDropdown = ({
  notifications,
  onMarkAllAsRead,
  onClearReadNotifications,
}: NotificationsDropdownProps) => {
  // Разделяет итоговую выдачу по признаку прочтения.
  const unreadNotifications = notifications.filter((notification) => !notification.isRead)

  const readNotifications = notifications.filter((notification) => notification.isRead)

  return (
    <DropdownContainer className={styles.container}>
      {notifications.length === 0 && <p className={styles.empty}>Уведомлений нет</p>}

      {unreadNotifications.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Новые уведомления</h2>

            <button type="button" className={styles.sectionAction} onClick={onMarkAllAsRead}>
              Прочитать всё
            </button>
          </div>

          <ul className={styles.list}>
            {unreadNotifications.map((notification) => (
              <NotificationItem key={notification.requestId} notification={notification} />
            ))}
          </ul>
        </section>
      )}

      {readNotifications.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Просмотренные</h2>

            <button
              type="button"
              className={styles.sectionAction}
              onClick={onClearReadNotifications}
            >
              Очистить
            </button>
          </div>

          <ul className={styles.list}>
            {readNotifications.map((notification) => (
              <NotificationItem key={notification.requestId} notification={notification} />
            ))}
          </ul>
        </section>
      )}
    </DropdownContainer>
  )
}
