import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { User } from '@/shared/types'
import type { PersonalData } from '@/widgets/PersonalDataSection'
import type { AppDispatch, RootState } from '@/store'
import authReducer from '@/store/slices/authSlice'
import usersReducer, { setLocalUser } from '@/store/slices/usersSlice'
import { updatePersonalData } from '@/store/thunks/updatePersonalData'

const localUser: User = {
  id: 'local-user-id',
  name: 'Старое Имя',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Старое описание',
  offeredSkill: {
    title: 'Навык',
    categoryId: 'creativity-art',
    subcategoryId: 'photography',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
      auth: authReducer,
    },
  })

describe('Интеграция: редактирование профиля сохраняется после F5', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('сохранённые изменения профиля видны после имитации перезагрузки страницы', async () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(localUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, localUser)

    const editedData: PersonalData = {
      name: 'Новое Имя',
      email: 'user@example.com',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      city: 'Москва',
      about: 'Новое описание после редактирования',
      avatar: undefined,
    }

    const result = updatePersonalData(editedData)(
      testStore.dispatch as unknown as AppDispatch,
      testStore.getState as unknown as () => RootState,
    )

    expect(result).toBe(true)
    expect(testStore.getState().users.localUser?.name).toBe('Новое Имя')

    // Имитирует F5: слайс users пересоздаётся заново и читает localUser из storage.
    vi.resetModules()
    const { default: freshUsersReducer } = await import('@/store/slices/usersSlice')
    const restoredState = freshUsersReducer(undefined, { type: '@@INIT' })

    expect(restoredState.localUser?.name).toBe('Новое Имя')
    expect(restoredState.localUser?.description).toBe('Новое описание после редактирования')
  })
})
