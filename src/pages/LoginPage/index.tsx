import { Button } from '../../shared/ui/Button'
import { Input } from '../../shared/ui/Input'
import GoogleIcon from '../../shared/assets/icons/icon-google.svg?react'
import AppleIcon from '../../shared/assets/icons/icon-apple.svg?react'
import EyeIcon from '../../shared/assets/icons/icon-eye.svg?react'
import EyeOffIcon from '../../shared/assets/icons/icon-eye-slash.svg?react'
import LightBulb from '../../shared/assets/illustrations/illustration-light-bulb.svg?react'
import { AuthLayout } from '@/widgets/AuthLayout'
import styles from './LoginPage.module.css'

interface LoginPageProps {
  hasError?: boolean
}

export default function LoginPage({ hasError = false }: LoginPageProps) {
  return (
    <AuthLayout
      topContent={<h2 className={styles.header}>Вход</h2>}
      infoBlockProps={{
        illustration: <LightBulb />,
        title: 'С возвращением в SkillSwap!',
        description: 'Обменивайтесь знаниями и навыками с другими людьми',
      }}
    >
      <div className={styles.formSection}>
        <div className={styles.socialButtons}>
          <Button icon={<GoogleIcon />} className={styles.socialButton}>
            Продолжить с Google
          </Button>
          <Button icon={<AppleIcon />} className={styles.socialButton}>
            Продолжить с Apple
          </Button>
        </div>
        <div className={styles.divider}>
          <span>или</span>
        </div>
        <form className={styles.form}>
          <Input
            className={styles.input}
            label="Email"
            type="email"
            placeholder="Введите email"
            error={hasError ? ' ' : undefined}
          />
          <Input
            className={styles.input}
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            error={hasError ? 'Email или пароль введен неверно.' : undefined}
            showPasswordIcon={<EyeIcon />}
            hidePasswordIcon={<EyeOffIcon />}
          />
          <Button className={styles.submitButton} type="submit">
            Войти
          </Button>
          <a href="#" className={styles.registerLink}>
            Зарегистрироваться
          </a>
        </form>
      </div>
    </AuthLayout>
  )
}
