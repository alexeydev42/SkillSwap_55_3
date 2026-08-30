import styles from './Footer.module.css'
import { Logo } from '../../shared/ui/Logo'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <nav className={styles.nav} aria-label="Навигация в подвале">
            <ul className={styles.menu}>
              <li>
                <a href="#">О проекте</a>
              </li>
              <li>
                <a href="#">Все навыки</a>
              </li>
            </ul>

            <ul className={styles.menu}>
              <li>
                <a href="#">Контакты</a>
              </li>
              <li>
                <a href="#">Блог</a>
              </li>
            </ul>

            <ul className={styles.menu}>
              <li>
                <a href="#">Политика конфиденциальности</a>
              </li>
              <li>
                <a href="#">Пользовательское соглашение</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span>SkillSwap — 2026</span>
        </div>
      </div>
    </footer>
  )
}
