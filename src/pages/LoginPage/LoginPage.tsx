import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import EyeIcon from '@/shared/assets/icons/icon-eye.svg?react'
import EyeOffIcon from '@/shared/assets/icons/icon-eye-slash.svg?react'
import LightBulb from '@/shared/assets/illustrations/illustration-light-bulb.svg?react'
import { ROUTES } from '@/shared/lib/constants'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/thunks/login'
import { AuthLayout } from '@/widgets/AuthLayout'

import styles from './LoginPage.module.css'

interface LoginPageProps {
  hasError?: boolean
}

interface LoginLocationState {
  destination?: string
}

export default function LoginPage({ hasError = false }: LoginPageProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const locationState = location.state as LoginLocationState | null
  const destination = locationState?.destination ?? ROUTES.HOME

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isLoggedIn = dispatch(login({ email, password }))

    setLoginError(!isLoggedIn)

    if (isLoggedIn) {
      navigate(destination, { replace: true })
    }
  }

  const showError = hasError || loginError

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

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            className={styles.input}
            label="Email"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setLoginError(false)
            }}
            error={showError ? ' ' : undefined}
          />

          <Input
            className={styles.input}
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setLoginError(false)
            }}
            error={showError ? 'Email или пароль введен неверно.' : undefined}
            showPasswordIcon={<EyeIcon />}
            hidePasswordIcon={<EyeOffIcon />}
          />

          <Button className={styles.submitButton} type="submit">
            Войти
          </Button>

          <Link to={ROUTES.REGISTER} className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </form>
      </div>
    </AuthLayout>
  )
}
