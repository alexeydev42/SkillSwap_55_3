import { Link, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import iconLogo from '../../assets/icons/icon-logo.svg'
import styles from './Logo.module.css'

interface LogoProps {
  compactOnMobile?: boolean
}

export const Logo = ({ compactOnMobile = false }: LogoProps) => {
  const location = useLocation()
  const isHomePage = location.pathname === ROUTES.HOME
  const logoClassName = `${styles.logo} ${compactOnMobile ? styles.mobileCompact : ''}`

  const content = (
    <>
      <img className={styles.icon} src={iconLogo} alt="" />
      <span className={styles.text}>SkillSwap</span>
    </>
  )

  if (isHomePage) {
    return <div className={logoClassName}>{content}</div>
  }

  return (
    <Link to={ROUTES.HOME} className={logoClassName} aria-label="На главную">
      {content}
    </Link>
  )
}
