import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { Logo } from '@/shared/ui/Logo'

import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Logo />

        <nav className={styles.nav} aria-label="Навигация в подвале">
          <Link to={ROUTES.ABOUT}>О проекте</Link>
          <Link to={ROUTES.HOME}>Все навыки</Link>
          <Link to={ROUTES.CONTACTS}>Контакты</Link>
        </nav>

        <div className={styles.copyright}>SkillSwap 2026</div>
      </div>
    </footer>
  )
}
