import { useState, useRef, useEffect, type FC, type MouseEventHandler } from 'react'
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
  onToggleTheme?: () => void
  onProfileClick?: MouseEventHandler<HTMLButtonElement>
  onNotificationsClick?: () => void
  onFavoritesClick?: () => void
  onLogin?: () => void
  onRegister?: () => void
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
  const {
    isAuthenticated,
    user,
    isDark = false,
    isProfileMenuOpen = false,
    onToggleTheme,
    onProfileClick,
    onNotificationsClick,
    onFavoritesClick,
    onLogin,
    onRegister,
  } = props

  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
        setIsSkillsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={styles.header}>
      <Logo />

      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>
          О проекте
        </a>

        <div className={styles.skillsWrapper} ref={skillsRef}>
          <button
            className={styles.navLink}
            onClick={() => setIsSkillsOpen((prev) => !prev)}
            type="button"
          >
            Все навыки
            <ChevronIcon
              className={`${styles.chevron} ${isSkillsOpen ? styles.chevronOpen : ''}`}
            />
          </button>

          {isSkillsOpen && (
            <div className={styles.dropdownPanel}>
              <AllSkillsDropdown />
            </div>
          )}
        </div>
      </nav>

      <SearchInput className={styles.search} borderless />

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
            onProfileClick={onProfileClick}
            onNotificationsClick={onNotificationsClick}
            onFavoritesClick={onFavoritesClick}
          />
        ) : (
          <div className={styles.authButtons}>
            <button className={styles.loginBtn} onClick={onLogin}>
              Войти
            </button>
            <button className={styles.registerBtn} onClick={onRegister}>
              Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
