import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount } from '@/shared/types'
import type { AppDispatch } from '@/store'
import authReducer from '@/store/slices/authSlice'
import { login } from '@/store/thunks/login'

import { ChangePasswordModal } from './ChangePasswordModal'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'OldPassword1!',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account,
        session: { userId: account.userId },
        status: 'succeeded' as const,
        error: null,
      },
    },
  })

const createLoggedOutStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: null,
        status: 'idle' as const,
        error: null,
      },
    },
  })

const renderModal = () => {
  const store = createTestStore()
  const onClose = vi.fn()
  const user = userEvent.setup()

  render(
    <Provider store={store}>
      <ChangePasswordModal onClose={onClose} />
    </Provider>,
  )

  return {
    store,
    onClose,
    user,
  }
}

const fillPasswordFields = async (
  user: ReturnType<typeof userEvent.setup>,
  password: string,
  confirmation: string,
) => {
  await user.type(screen.getByPlaceholderText('Придумайте надёжный пароль'), password)
  await user.type(screen.getByPlaceholderText('Повторите пароль'), confirmation)
}

describe('ChangePasswordModal', () => {
  beforeEach(() => {
    window.localStorage.clear()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('не сохраняет пароль, который не проходит общую валидацию', async () => {
    const { store, onClose, user } = renderModal()

    await fillPasswordFields(user, 'short', 'short')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByText('Пароль должен содержать от 8 до 64 символов')).toBeInTheDocument()
    expect(storageService.get(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(account)
    expect(store.getState().auth.account).toEqual(account)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('не сохраняет несовпадающие пароли', async () => {
    const { store, onClose, user } = renderModal()

    await fillPasswordFields(user, 'NewPassword1!', 'OtherPassword1!')
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument()
    expect(storageService.get(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(account)
    expect(store.getState().auth.account).toEqual(account)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('сохраняет валидный пароль в localStorage и обновляет Redux', async () => {
    const { store, onClose, user } = renderModal()
    const newPassword = 'NewPassword1!'

    await fillPasswordFields(user, newPassword, newPassword)
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    const expectedAccount: AuthAccount = {
      ...account,
      password: newPassword,
    }

    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(expectedAccount)
    expect(store.getState().auth.account).toEqual(expectedAccount)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('позволяет выполнить следующий login с новым паролем', async () => {
    const { user } = renderModal()
    const newPassword = 'NewPassword1!'

    await fillPasswordFields(user, newPassword, newPassword)
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    const loggedOutStore = createLoggedOutStore()

    const result = login({
      email: account.email,
      password: newPassword,
    })(loggedOutStore.dispatch as unknown as AppDispatch)

    expect(result).toBe(true)
    expect(loggedOutStore.getState().auth.account?.password).toBe(newPassword)
    expect(loggedOutStore.getState().auth.session).toEqual({
      userId: account.userId,
    })
  })

  it('не обновляет Redux, если AuthAccount не удалось сохранить', async () => {
    const { store, onClose, user } = renderModal()
    const newPassword = 'NewPassword1!'

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    await fillPasswordFields(user, newPassword, newPassword)
    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByText('Не удалось сохранить пароль, попробуйте ещё раз')).toBeInTheDocument()
    expect(store.getState().auth.account).toEqual(account)
    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(account)
    expect(onClose).not.toHaveBeenCalled()
  })
})
