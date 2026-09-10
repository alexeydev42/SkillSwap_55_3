import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, User } from '@/shared/types'
import type { PersonalData } from '@/widgets/PersonalDataSection'
import authReducer, { setAuthAccount } from '@/store/slices/authSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import notificationsReducer from '@/store/slices/notificationsSlice'
import registrationReducer from '@/store/slices/registrationSlice'
import requestsReducer from '@/store/slices/requestsSlice'
import usersReducer, { setLocalUser } from '@/store/slices/usersSlice'

import { updatePersonalData } from './updatePersonalData'

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
  description: 'Старое описание',
  offeredSkill: {
    title: 'Игра на гитаре',
    categoryId: 'creativity-art',
    subcategoryId: 'music',
    description: 'Научу играть на гитаре с нуля',
    imageUrls: ['image-1'],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 12,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const validFormData: PersonalData = {
  email: 'maria@example.com',
  name: 'Мария Иванова',
  birthDate: new Date(1996, 2, 15),
  gender: 'preferNotToSay',
  city: 'Санкт-Петербург',
  about: 'Новое описание профиля',
  avatar: 'data:image/png;base64,dGVzdA==',
}

describe('updatePersonalData', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('возвращает false и ничего не меняет, если локального пользователя нет', () => {
    const testStore = createTestStore()

    const result = testStore.dispatch(updatePersonalData(validFormData))

    expect(result).toBe(false)
    expect(testStore.getState().users.localUser).toBeNull()
    expect(storageService.get(STORAGE_KEYS.LOCAL_USER)).toBeNull()
  })

  it('сохраняет отредактированные поля, не трогая offeredSkill и остальные данные', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    const result = testStore.dispatch(updatePersonalData(validFormData))

    const expectedUser: User = {
      ...existingUser,
      name: 'Мария Иванова',
      birthDate: '1996-03-15',
      gender: 'preferNotToSay',
      cityId: 'saint-petersburg',
      description: 'Новое описание профиля',
      avatarUrl: 'data:image/png;base64,dGVzdA==',
    }

    expect(result).toBe(true)
    expect(testStore.getState().users.localUser).toEqual(expectedUser)
    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)).toEqual(expectedUser)

    // offeredSkill, id, likesCount, createdAt, learningSubcategoryIds — без изменений.
    expect(testStore.getState().users.localUser?.offeredSkill).toEqual(existingUser.offeredSkill)
    expect(testStore.getState().users.localUser?.id).toBe(existingUser.id)
    expect(testStore.getState().users.localUser?.likesCount).toBe(existingUser.likesCount)
    expect(testStore.getState().users.localUser?.createdAt).toBe(existingUser.createdAt)
    expect(testStore.getState().users.localUser?.learningSubcategoryIds).toEqual(
      existingUser.learningSubcategoryIds,
    )
  })

  it('оставляет cityId прежним, если название города не найдено в справочнике', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    testStore.dispatch(updatePersonalData({ ...validFormData, city: 'Неизвестный город' }))

    expect(testStore.getState().users.localUser?.cityId).toBe(existingUser.cityId)
  })

  it('сохраняет avatarUrl как null, если аватар не выбран', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    testStore.dispatch(updatePersonalData({ ...validFormData, avatar: undefined }))

    expect(testStore.getState().users.localUser?.avatarUrl).toBeNull()
  })

  it('обрезает пробелы по краям у имени и описания', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    testStore.dispatch(
      updatePersonalData({ ...validFormData, name: '  Мария Иванова  ', about: '  Текст  ' }),
    )

    const { localUser } = testStore.getState().users
    expect(localUser?.name).toBe('Мария Иванова')
    expect(localUser?.description).toBe('Текст')
  })

  it('обновляет auth.account.email и localStorage, если email в форме отличается от текущего', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    const existingAccount: AuthAccount = {
      userId: existingUser.id,
      email: 'old@example.com',
      password: 'Password1!',
    }
    testStore.dispatch(setAuthAccount(existingAccount))
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, existingAccount)

    testStore.dispatch(updatePersonalData({ ...validFormData, email: 'new@example.com' }))

    const expectedAccount: AuthAccount = { ...existingAccount, email: 'new@example.com' }

    expect(testStore.getState().auth.account).toEqual(expectedAccount)
    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(expectedAccount)
    // Остальные поля аккаунта (userId, password) не затронуты.
    expect(testStore.getState().auth.account?.userId).toBe(existingAccount.userId)
    expect(testStore.getState().auth.account?.password).toBe(existingAccount.password)
  })

  it('не трогает auth.account, если email в форме совпадает с текущим', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    const existingAccount: AuthAccount = {
      userId: existingUser.id,
      email: validFormData.email,
      password: 'Password1!',
    }
    testStore.dispatch(setAuthAccount(existingAccount))
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, existingAccount)

    testStore.dispatch(updatePersonalData(validFormData))

    expect(testStore.getState().auth.account).toEqual(existingAccount)
    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(existingAccount)
  })

  it('не падает, если auth.account отсутствует (аккаунт не загружен)', () => {
    const testStore = createTestStore()
    testStore.dispatch(setLocalUser(existingUser))
    storageService.set(STORAGE_KEYS.LOCAL_USER, existingUser)

    const result = testStore.dispatch(
      updatePersonalData({ ...validFormData, email: 'new@example.com' }),
    )

    expect(result).toBe(true)
    expect(testStore.getState().auth.account).toBeNull()
  })
})
