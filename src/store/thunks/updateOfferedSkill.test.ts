import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

import { updateOfferedSkill } from './updateOfferedSkill'

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

const existingUser: User = {
  id: 'user-1',
  name: 'Мария',
  birthDate: '1995-10-28',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Описание профиля',
  offeredSkill: {
    title: 'Игра на гитаре',
    categoryId: 'creativity-art',
    subcategoryId: 'music',
    description: 'Научу играть на гитаре с нуля',
    imageUrls: ['old-image'],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 12,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const updatedSkill: OfferedSkill = {
  title: '  Электрогитара  ',
  categoryId: 'creativity-art',
  subcategoryId: 'music',
  description: '  Помогу освоить основные техники игры  ',
  imageUrls: ['image-1', 'image-2'],
}

describe('updateOfferedSkill', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('возвращает false, если локального пользователя нет', () => {
    const testStore = createTestStore()

    testStore.dispatch(setAuthSession({ userId: existingUser.id }))

    const result = testStore.dispatch(updateOfferedSkill(updatedSkill))

    expect(result).toBe(false)
    expect(testStore.getState().users.localUser).toBeNull()
  })

  it('возвращает false, если текущая сессия принадлежит другому пользователю', () => {
    const testStore = createTestStore()

    testStore.dispatch(setLocalUser(existingUser))
    testStore.dispatch(setAuthSession({ userId: 'another-user' }))

    const result = testStore.dispatch(updateOfferedSkill(updatedSkill))

    expect(result).toBe(false)
    expect(testStore.getState().users.localUser).toEqual(existingUser)
  })

  it('сохраняет новый навык и не изменяет остальные данные пользователя', () => {
    const testStore = createTestStore()

    testStore.dispatch(setLocalUser(existingUser))
    testStore.dispatch(setAuthSession({ userId: existingUser.id }))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    const result = testStore.dispatch(updateOfferedSkill(updatedSkill))

    const expectedUser: User = {
      ...existingUser,
      offeredSkill: {
        ...updatedSkill,
        title: 'Электрогитара',
        description: 'Помогу освоить основные техники игры',
      },
    }

    expect(result).toBe(true)
    expect(testStore.getState().users.localUser).toEqual(expectedUser)
    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)).toEqual(expectedUser)

    expect(testStore.getState().users.localUser?.id).toBe(existingUser.id)
    expect(testStore.getState().users.localUser?.name).toBe(existingUser.name)
    expect(testStore.getState().users.localUser?.likesCount).toBe(existingUser.likesCount)
    expect(testStore.getState().users.localUser?.createdAt).toBe(existingUser.createdAt)
    expect(testStore.getState().users.localUser?.learningSubcategoryIds).toEqual(
      existingUser.learningSubcategoryIds,
    )
  })

  it('не обновляет Redux, если localStorage не удалось сохранить', () => {
    const testStore = createTestStore()

    testStore.dispatch(setLocalUser(existingUser))
    testStore.dispatch(setAuthSession({ userId: existingUser.id }))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const result = testStore.dispatch(updateOfferedSkill(updatedSkill))

    expect(result).toBe(false)
    expect(testStore.getState().users.localUser).toEqual(existingUser)
    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)).toEqual(existingUser)
  })
})
