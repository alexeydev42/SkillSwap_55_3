import { useEffect, useState, type MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCatalogFilters } from '@/store/slices/catalogFiltersSlice'
import {
  clearReadNotifications,
  markAllAsRead,
  selectVisibleNotifications,
} from '@/store/slices/notificationsSlice'
import { selectCurrentUser } from '@/store/slices/usersSlice'
import { logout } from '@/store/thunks/authThunks'

import Header, { type HeaderProps } from './Header'

type HeaderContainerProps = Omit<
  HeaderProps,
  | 'isAuthenticated'
  | 'user'
  | 'notifications'
  | 'hasUnreadNotifications'
  | 'onMarkAllNotificationsAsRead'
  | 'onClearReadNotifications'
>

export const HeaderContainer = ({
  isProfileMenuOpen,
  isNotificationsMenuOpen,
  onProfileClick,
  onProfileMenuClose,
  onNotificationsClick,
  onNotificationsMenuClose,
  onFavoritesClick,
  onSubcategorySelect,
  onLogout,
  ...headerProps
}: HeaderContainerProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)

    if (savedTheme === 'dark') {
      return true
    }

    if (savedTheme === 'light') {
      return false
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    return false
  })

  const session = useAppSelector((state) => state.auth.session)

  const currentUser = useAppSelector(selectCurrentUser)

  const catalogFilters = useAppSelector((state) => state.catalogFilters.filters)

  // Получает только итоговую валидную выдачу уведомлений.
  const notifications = useAppSelector(selectVisibleNotifications)

  // Индикатор зависит от наличия непрочитанных уведомлений.
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead)

  // Хранит локальное состояние меню профиля.
  const [internalIsProfileMenuOpen, setInternalIsProfileMenuOpen] = useState(false)

  // Хранит локальное состояние dropdown уведомлений.
  const [internalIsNotificationsMenuOpen, setInternalIsNotificationsMenuOpen] = useState(false)

  const isProfileMenuControlled = isProfileMenuOpen !== undefined

  const isNotificationsMenuControlled = isNotificationsMenuOpen !== undefined

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'

    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [isDark])

  const handleToggleTheme = () => {
    setIsDark((currentValue) => !currentValue)
  }

  const resolvedIsProfileMenuOpen = isProfileMenuControlled
    ? isProfileMenuOpen
    : internalIsProfileMenuOpen

  const resolvedIsNotificationsMenuOpen = isNotificationsMenuControlled
    ? isNotificationsMenuOpen
    : internalIsNotificationsMenuOpen

  const handleProfileClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onProfileClick?.(event)

    if (!isProfileMenuControlled) {
      setInternalIsProfileMenuOpen((currentValue) => !currentValue)

      if (!isNotificationsMenuControlled) {
        setInternalIsNotificationsMenuOpen(false)
      }
    }
  }

  const handleProfileMenuClose = () => {
    onProfileMenuClose?.()

    if (!isProfileMenuControlled) {
      setInternalIsProfileMenuOpen(false)
    }
  }

  const handleNotificationsClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onNotificationsClick?.(event)

    if (!isNotificationsMenuControlled) {
      setInternalIsNotificationsMenuOpen((currentValue) => !currentValue)

      if (!isProfileMenuControlled) {
        setInternalIsProfileMenuOpen(false)
      }
    }
  }

  const handleNotificationsMenuClose = () => {
    onNotificationsMenuClose?.()

    if (!isNotificationsMenuControlled) {
      setInternalIsNotificationsMenuOpen(false)
    }
  }

  // Переводит все уведомления в просмотренные.
  const handleMarkAllNotificationsAsRead = () => {
    dispatch(markAllAsRead())
  }

  // Удаляет только просмотренные уведомления.
  const handleClearReadNotifications = () => {
    dispatch(clearReadNotifications())
  }

  const handleSubcategorySelect = (subcategoryId: string) => {
    dispatch(
      setCatalogFilters({
        ...catalogFilters,
        subcategoryIds: [subcategoryId],
      }),
    )

    onSubcategorySelect?.(subcategoryId)

    navigate(ROUTES.HOME)
  }

  const handleFavoritesClick = () => {
    navigate(ROUTES.FAVORITES)
  }

  const handleLogout = () => {
    dispatch(logout())
    onLogout?.()
  }

  if (!session || !currentUser) {
    return (
      <Header
        {...headerProps}
        isAuthenticated={false}
        onSubcategorySelect={handleSubcategorySelect}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
    )
  }

  return (
    <Header
      {...headerProps}
      isAuthenticated
      onSubcategorySelect={handleSubcategorySelect}
      user={{
        userName: currentUser.name,
        avatarSrc: currentUser.avatarUrl ?? '',
      }}
      notifications={notifications}
      hasUnreadNotifications={hasUnreadNotifications}
      isProfileMenuOpen={resolvedIsProfileMenuOpen}
      isNotificationsMenuOpen={resolvedIsNotificationsMenuOpen}
      onProfileClick={handleProfileClick}
      onProfileMenuClose={handleProfileMenuClose}
      onNotificationsClick={handleNotificationsClick}
      onNotificationsMenuClose={handleNotificationsMenuClose}
      onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      onClearReadNotifications={handleClearReadNotifications}
      onFavoritesClick={onFavoritesClick ?? handleFavoritesClick}
      onLogout={handleLogout}
      isDark={isDark}
      onToggleTheme={handleToggleTheme}
    />
  )
}
