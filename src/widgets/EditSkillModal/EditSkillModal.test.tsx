import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { OfferedSkill, User } from '@/shared/types'
import authReducer, { setAuthSession } from '@/store/slices/authSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import notificationsReducer from '@/store/slices/notificationsSlice'
import registrationReducer from '@/store/slices/registrationSlice'
import requestsReducer from '@/store/slices/requestsSlice'
import usersReducer, { setLocalUser } from '@/store/slices/usersSlice'

import { EditSkillModal } from './EditSkillModal'

const existingSkill: OfferedSkill = {
  title: 'Видеомонтаж',
  categoryId: 'creativity-art',
  subcategoryId: 'video-editing',
  description: 'Научу базовым приёмам видеомонтажа',
  imageUrls: ['data:image/png;base64,b2xk'],
}

const existingUser: User = {
  id: 'user-1',
  name: 'Алексей',
  birthDate: '1993-04-15',
  gender: 'preferNotToSay',
  cityId: 'saint-petersburg',
  avatarUrl: null,
  description: 'Описание профиля',
  offeredSkill: existingSkill,
  learningSubcategoryIds: ['english'],
  likesCount: 3,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
      auth: authReducer,
      registration: registrationReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      notifications: notificationsReducer,
      catalogFilters: catalogFiltersReducer,
    },
  })

const renderModal = () => {
  const store = createTestStore()

  store.dispatch(setLocalUser(existingUser))
  store.dispatch(setAuthSession({ userId: existingUser.id }))

  storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

  const onClose = vi.fn()
  const user = userEvent.setup()

  render(
    <Provider store={store}>
      <EditSkillModal skill={existingSkill} onClose={onClose} />
    </Provider>,
  )

  return {
    store,
    onClose,
    user,
  }
}

describe('EditSkillModal', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('показывает текущие данные навыка', () => {
    renderModal()

    expect(screen.getByLabelText('Название навыка')).toHaveValue(existingSkill.title)
    expect(screen.getByLabelText('Категория навыка')).toHaveTextContent('Творчество и искусство')
    expect(screen.getByLabelText('Подкатегория навыка')).toHaveTextContent('Видеомонтаж')
    expect(screen.getByLabelText('Описание')).toHaveValue(existingSkill.description)
    expect(screen.getByAltText('Превью изображения 1')).toBeInTheDocument()
  })

  it('закрывает модалку без сохранения по кнопке Отмена', async () => {
    const { store, onClose, user } = renderModal()

    const titleInput = screen.getByLabelText('Название навыка')

    await user.clear(titleInput)
    await user.type(titleInput, 'Новое название')

    await user.click(screen.getByRole('button', { name: 'Отмена' }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(store.getState().users.localUser?.offeredSkill).toEqual(existingSkill)
    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)?.offeredSkill).toEqual(existingSkill)
  })

  it('сбрасывает подкатегорию при смене категории', async () => {
    const { user } = renderModal()

    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Иностранные языки'))

    expect(screen.getByLabelText('Подкатегория навыка')).toHaveTextContent(
      'Выберите подкатегорию навыка',
    )

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByText('Подкатегория навыка: выберите значение из списка')).toBeInTheDocument()
  })

  it('сохраняет изменения навыка и закрывает модалку', async () => {
    const { store, onClose, user } = renderModal()

    const titleInput = screen.getByLabelText('Название навыка')
    const descriptionInput = screen.getByLabelText('Описание')

    await user.clear(titleInput)
    await user.type(titleInput, 'Монтаж видео')

    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Помогу освоить основные приёмы монтажа видео с нуля')

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    const expectedSkill: OfferedSkill = {
      ...existingSkill,
      title: 'Монтаж видео',
      description: 'Помогу освоить основные приёмы монтажа видео с нуля',
    }

    expect(store.getState().users.localUser?.offeredSkill).toEqual(expectedSkill)
    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)?.offeredSkill).toEqual(expectedSkill)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('не закрывает модалку и показывает ошибку при сбое localStorage', async () => {
    const { store, onClose, user } = renderModal()

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const titleInput = screen.getByLabelText('Название навыка')

    await user.clear(titleInput)
    await user.type(titleInput, 'Монтаж видео')

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Не удалось сохранить изменения. Попробуйте ещё раз.',
    )

    expect(store.getState().users.localUser?.offeredSkill).toEqual(existingSkill)
    expect(onClose).not.toHaveBeenCalled()
  })
})
