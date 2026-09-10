import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import iconLogo from '../../assets/icons/icon-logo.svg'
import styles from './Logo.module.css'

export const Logo = () => {
  return (
    <Link to={ROUTES.HOME} className={styles.logo} aria-label="На главную">
      <img className={styles.icon} src={iconLogo} alt="" />
      <span className={styles.text}>SkillSwap</span>
    </Link>
  )
}
