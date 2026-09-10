import { Link, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import iconLogo from '../../assets/icons/icon-logo.svg'
import styles from './Logo.module.css'

export const Logo = () => {
  const location = useLocation()
  const isHomePage = location.pathname === ROUTES.HOME

  const content = (
    <>
      <img className={styles.icon} src={iconLogo} alt="" />
      <span className={styles.text}>SkillSwap</span>
    </>
  )

  if (isHomePage) {
    return <div className={styles.logo}>{content}</div>
  }

  return (
    <Link to={ROUTES.HOME} className={styles.logo} aria-label="На главную">
      {content}
    </Link>
  )
}
