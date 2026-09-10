import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { validatePassword } from '@/shared/lib/validators'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setAuthAccount } from '@/store/slices/authSlice'
import type { AuthAccount } from '@/shared/types'

import EyeIcon from '@/shared/assets/icons/icon-eye.svg?react'
import EyeSlashIcon from '@/shared/assets/icons/icon-eye-slash.svg?react'

import styles from './ChangePasswordModal.module.css'

export interface ChangePasswordModalProps {
  onClose: () => void
}

export const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const dispatch = useAppDispatch()
  const account = useAppSelector((state) => state.auth.account)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string>()
  const [confirmError, setConfirmError] = useState<string>()

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordError(undefined)
  }

  const handleConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
    setConfirmError(undefined)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextPasswordError = validatePassword(password)
    const nextConfirmError =
      password !== confirmPassword ? 'Пароли не совпадают' : undefined

    setPasswordError(nextPasswordError?.message)
    setConfirmError(nextConfirmError)

    if (nextPasswordError || nextConfirmError || !account) {
      return
    }

    const updatedAccount: AuthAccount = { ...account, password }

    if (!storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, updatedAccount)) {
      setPasswordError('Не удалось сохранить пароль, попробуйте ещё раз')
      return
    }

    dispatch(setAuthAccount(updatedAccount))
    onClose()
  }

  return (
    <Modal>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>Изменить пароль</h2>

        <Input
          type="password"
          label="Новый пароль"
          placeholder="Придумайте надёжный пароль"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          showPasswordIcon={<EyeIcon />}
          hidePasswordIcon={<EyeSlashIcon />}
        />

        <Input
          type="password"
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={handleConfirmChange}
          error={confirmError}
          showPasswordIcon={<EyeIcon />}
          hidePasswordIcon={<EyeSlashIcon />}
        />

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  )
}
