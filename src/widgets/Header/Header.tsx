import { useCallback, useEffect, useRef, useState, type FC, type MouseEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import ChevronIcon from '@/shared/assets/icons/icon-chevron-down.svg?react'
import MoonIcon from '@/shared/assets/icons/icon-moon.svg?react'
import SunIcon from '@/shared/assets/icons/icon-sun.svg?react'
import { ROUTES } from '@/shared/lib/constants'
import { IconButton } from '@/shared/ui/IconButton'
import { Logo } from '@/shared/ui/Logo'
import { SearchInput } from '@/shared/ui/SearchInput'
import type { NotificationView } from '@/store/slices/notificationsSlice'

import { AllSkillsDropdown } from '../AllSkillsDropdown'
import { UserHeaderControls } from './UserHeaderControls'

import clsx from 'clsx'

import styles from './Header.module.css'

interface HeaderBaseProps {
  isDark?: boolean
  isProfileMenuOpen?: boolean
  isNotificationsMenuOpen?: boolean
  isAllSkillsMenuOpen?: boolean
  onToggleTheme?: () => void
  onProfileClick?: MouseEventHandler<HTMLButtonElement>
  onProfileMenuClose?: () => void
  onAllSkillsMenuOpenChange?: (isOpen: boolean) => void
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>
  onNotificationsMenuClose?: () => void
  onFavoritesClick?: MouseEventHandler<HTMLButtonElement>
  onLogin?: () => void
  onLogout?: () => void
  onRegister?: () => void
  onSearchChange?: (value: string) => void
  onSubcategorySelect?: (subcategoryId: string) => void
  searchQuery?: string
}

interface AuthenticatedHeaderProps extends HeaderBaseProps {
  isAuthenticated: true
  user: {
    userName: string
    avatarSrc: string
  }
  notifications: NotificationView[]
  hasUnreadNotifications: boolean
  onMarkAllNotificationsAsRead: () => void
  onClearReadNotifications: () => void
}

interface GuestHeaderProps extends HeaderBaseProps {
  isAuthenticated: false
  user?: never
  notifications?: never
  hasUnreadNotifications?: never
  onMarkAllNotificationsAsRead?: never
  onClearReadNotifications?: never
}

export type HeaderProps = AuthenticatedHeaderProps | GuestHeaderProps

export const Header: FC<HeaderProps> = (props) => {
  const navigate = useNavigate()

  const {
    isAuthenticated,
    user,
    isDark = false,
    isProfileMenuOpen = false,
    isNotificationsMenuOpen = false,
    isAllSkillsMenuOpen,
    onToggleTheme,
    onProfileClick,
    onProfileMenuClose,
    onAllSkillsMenuOpenChange,
    onSubcategorySelect,
    onNotificationsClick,
    onNotificationsMenuClose,
    onFavoritesClick,
    onLogin,
    onRegister,
    searchQuery,
    onSearchChange,
    onLogout,
  } = props

  const handleRegister = () => {
    if (onRegister) {
      onRegister()
      return
    }

    navigate(ROUTES.REGISTER)
  }

  const handleLogin = () => {
    if (onLogin) {
      onLogin()
      return
    }

    navigate(ROUTES.LOGIN)
  }

  // Хранит состояние меню навыков при отсутствии внешнего управления.
  const [internalIsSkillsMenuOpen, setInternalIsSkillsMenuOpen] = useState(false)

  const skillsRef = useRef<HTMLDivElement>(null)

  // Использует внешнее или внутреннее состояние меню навыков.
  const isSkillsMenuOpen = isAllSkillsMenuOpen ?? internalIsSkillsMenuOpen

  const setIsSkillsMenuOpen = useCallback(
    (isOpen: boolean) => {
      if (isAllSkillsMenuOpen !== undefined) {
        onAllSkillsMenuOpenChange?.(isOpen)
        return
      }

      setInternalIsSkillsMenuOpen(isOpen)
    },
    [isAllSkillsMenuOpen, onAllSkillsMenuOpenChange],
  )

  // Закрывает меню навыков при нажатии снаружи.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
        setIsSkillsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsSkillsMenuOpen])

  return (
    <header className={styles.header}>
      <Logo compactOnMobile />

      <nav className={styles.nav}>
        <Link to={ROUTES.ABOUT} className={styles.navLink}>
          О проекте
        </Link>

        <div className={styles.skillsWrapper} ref={skillsRef}>
          <button
            className={styles.navLink}
            onClick={() => setIsSkillsMenuOpen(!isSkillsMenuOpen)}
            type="button"
          >
            Все навыки
            <ChevronIcon
              className={`${styles.chevron} ${isSkillsMenuOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {isSkillsMenuOpen && (
            <div className={styles.dropdownPanel}>
              <AllSkillsDropdown
                onSubcategorySelect={(subcategoryId) => {
                  onSubcategorySelect?.(subcategoryId)
                  setIsSkillsMenuOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <SearchInput
        className={styles.search}
        wrapperClassName={styles.searchField}
        value={searchQuery}
        onValueChange={onSearchChange}
      />

      <div
        className={clsx(styles.right, {
          [styles.guestRight]: !isAuthenticated,
        })}
      >
        <IconButton
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          onClick={onToggleTheme}
          aria-label="Переключить тему"
        />

        {isAuthenticated ? (
          <UserHeaderControls
            userName={user.userName}
            avatarSrc={user.avatarSrc}
            notifications={props.notifications}
            hasUnreadNotifications={props.hasUnreadNotifications}
            isProfileMenuOpen={isProfileMenuOpen}
            isNotificationsMenuOpen={isNotificationsMenuOpen}
            onProfileClick={onProfileClick}
            onProfileMenuClose={onProfileMenuClose}
            onNotificationsClick={onNotificationsClick}
            onNotificationsMenuClose={onNotificationsMenuClose}
            onMarkAllNotificationsAsRead={props.onMarkAllNotificationsAsRead}
            onClearReadNotifications={props.onClearReadNotifications}
            onFavoritesClick={onFavoritesClick}
            onLogout={onLogout}
          />
        ) : (
          <div className={styles.authButtons}>
            <button type="button" className={styles.loginBtn} onClick={handleLogin}>
              Войти
            </button>

            <button type="button" className={styles.registerBtn} onClick={handleRegister}>
              Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
