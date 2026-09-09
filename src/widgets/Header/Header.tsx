import { useCallback, useState, useRef, useEffect, type FC, type MouseEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui/Logo'
import { SearchInput } from '@/shared/ui/SearchInput'
import { UserHeaderControls } from './UserHeaderControls'
import { AllSkillsDropdown } from '../AllSkillsDropdown'
import { IconButton } from '@/shared/ui/IconButton'
import ChevronIcon from '../../shared/assets/icons/icon-chevron-down.svg?react'
import MoonIcon from '../../shared/assets/icons/icon-moon.svg?react'
import SunIcon from '../../shared/assets/icons/icon-sun.svg?react'
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
  onNotificationsClick?: () => void
  onNotificationsMenuClose?: () => void
  onFavoritesClick?: () => void
  onLogin?: () => void
  onRegister?: () => void
  onSearchChange?: (value: string) => void
  searchQuery?: string
}

interface AuthenticatedHeaderProps extends HeaderBaseProps {
  isAuthenticated: true
  user: {
    userName: string
    avatarSrc: string
  }
}

interface GuestHeaderProps extends HeaderBaseProps {
  isAuthenticated: false
  user?: never
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
    onNotificationsClick,
    onNotificationsMenuClose,
    onFavoritesClick,
    onLogin,
    onRegister,
    searchQuery = '',
    onSearchChange,
  } = props

  const handleRegister = () => {
    if (onRegister) {
      onRegister()
      return
    }
    navigate(ROUTES.REGISTER)
  }

  // Хранит состояние меню, когда Header управляет им самостоятельно.
  const [internalIsSkillsMenuOpen, setInternalIsSkillsMenuOpen] = useState(false)
  const skillsRef = useRef<HTMLDivElement>(null)

  // Использует внешнее состояние страницы или внутреннее состояние Header.
  const isSkillsMenuOpen = isAllSkillsMenuOpen ?? internalIsSkillsMenuOpen

  // Обновляет состояние в родительском компоненте или непосредственно в Header.
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

  // Закрывает меню при нажатии за пределами его области.
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
      <Logo />

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
              <AllSkillsDropdown />
            </div>
          )}
        </div>
      </nav>

      <SearchInput
        className={styles.search}
        wrapperClassName={styles.searchField}
        onChange={(event) => onSearchChange?.(event.target.value)}
        value={searchQuery}
      />

      <div className={styles.right}>
        <IconButton
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          onClick={onToggleTheme}
          aria-label="Переключить тему"
        />

        {isAuthenticated ? (
          <UserHeaderControls
            userName={user.userName}
            avatarSrc={user.avatarSrc}
            isProfileMenuOpen={isProfileMenuOpen}
            isNotificationsMenuOpen={isNotificationsMenuOpen}
            onProfileClick={onProfileClick}
            onProfileMenuClose={onProfileMenuClose}
            onNotificationsClick={onNotificationsClick}
            onNotificationsMenuClose={onNotificationsMenuClose}
            onFavoritesClick={onFavoritesClick}
          />
        ) : (
          <div className={styles.authButtons}>
            <button className={styles.loginBtn} onClick={onLogin}>
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
