import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession, User } from '@/shared/types'
import { listenerMiddleware } from '@/store/listenerMiddleware'
import authReducer, { setAuthSession } from '@/store/slices/authSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import registrationReducer from '@/store/slices/registrationSlice'
import requestsReducer, { setRequests } from '@/store/slices/requestsSlice'
import usersReducer, { setMockUsers } from '@/store/slices/usersSlice'
import { login } from '@/store/thunks/login'
import { logout } from '@/store/thunks/authThunks'
import { sendSwapRequest } from '@/store/thunks/sendSwapRequest'

import notificationsReducer, {
  clearNotifications,
  clearReadNotifications,
  markAllAsRead,
  selectVisibleNotifications,
  setNotifications,
} from './notificationsSlice'

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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  })

const recipient: User = {
  id: 'user-recipient',
  name: 'Толя',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Гитара',
    categoryId: 'creativity-art',
    subcategoryId: 'music',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

const accountA: AuthAccount = { userId: 'user-a', email: 'a@example.com', password: 'Password1!' }
const accountB: AuthAccount = { userId: 'user-b', email: 'b@example.com', password: 'Password1!' }

// Логинит testStore как accountA без прохождения полной формы логина.
function loginAsUserA(testStore: ReturnType<typeof createTestStore>) {
  const session: AuthSession = { userId: accountA.userId }
  storageService.set(STORAGE_KEYS.AUTH_SESSION, session)
  testStore.dispatch(setAuthSession(session))
}

describe('notificationsSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('одно успешно созданное request создаёт одно notification', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)

    const result = testStore.dispatch(sendSwapRequest(recipient.id))

    expect(result).toBe(true)
    expect(testStore.getState().requests.items).toHaveLength(1)
    expect(testStore.getState().notifications.items).toEqual([
      { requestId: testStore.getState().requests.items[0].id, isRead: false },
    ])
    expect(storageService.get(STORAGE_KEYS.NOTIFICATIONS)).toEqual(
      testStore.getState().notifications.items,
    )
  })

  it('не создаёт notification, если заявку создать не удалось', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    // Сессии нет — createSwapRequest вернёт null.

    const result = testStore.dispatch(sendSwapRequest(recipient.id))

    expect(result).toBe(false)
    expect(testStore.getState().notifications.items).toEqual([])
  })

  it('восстанавливает notification после перезагрузки страницы (F5)', async () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))

    // Имитирует F5: модуль слайса пересоздаётся, initialState читает данные заново из storage.
    vi.resetModules()
    const freshModule = await import('./notificationsSlice')
    const freshState = freshModule.default(undefined, { type: '@@INIT' })

    expect(freshState.items).toEqual(testStore.getState().notifications.items)
  })

  it('откатывает request, если notification сохранить не удалось', () => {
    const testStore = createTestStore()

    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)

    const originalSet = storageService.set.bind(storageService)

    vi.spyOn(storageService, 'set').mockImplementation((key, value) => {
      if (key === STORAGE_KEYS.NOTIFICATIONS) {
        return false
      }

      return originalSet(key, value)
    })

    const result = testStore.dispatch(sendSwapRequest(recipient.id))

    expect(result).toBe(false)

    expect(testStore.getState().requests.items).toEqual([])
    expect(storageService.get(STORAGE_KEYS.REQUESTS)).toEqual([])

    expect(testStore.getState().notifications.items).toEqual([])

    expect(testStore.getState().notifications.error).toBe('Не удалось сохранить уведомление.')
  })

  it('после logout state очищается, но сохраняется в localStorage; после login восстанавливается', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, accountA)
    testStore.dispatch(login({ email: accountA.email, password: accountA.password }))
    testStore.dispatch(sendSwapRequest(recipient.id))

    expect(testStore.getState().notifications.items).toHaveLength(1)
    const storedBeforeLogout = storageService.get(STORAGE_KEYS.NOTIFICATIONS)

    testStore.dispatch(logout())

    expect(testStore.getState().notifications.items).toEqual([])
    expect(storageService.get(STORAGE_KEYS.NOTIFICATIONS)).toEqual(storedBeforeLogout)

    testStore.dispatch(login({ email: accountA.email, password: accountA.password }))

    expect(testStore.getState().notifications.items).toEqual(storedBeforeLogout)
  })

  it('при смене аккаунта новый аккаунт не получает notifications предыдущего', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, accountA)
    testStore.dispatch(login({ email: accountA.email, password: accountA.password }))
    testStore.dispatch(sendSwapRequest(recipient.id))
    testStore.dispatch(logout())

    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, accountB)
    testStore.dispatch(login({ email: accountB.email, password: accountB.password }))

    expect(testStore.getState().notifications.items).toEqual([])
  })

  it('markAllAsRead переводит уведомления в isRead: true и сохраняет в storage', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))

    testStore.dispatch(markAllAsRead())

    expect(testStore.getState().notifications.items.every((item) => item.isRead)).toBe(true)
    expect(storageService.get(STORAGE_KEYS.NOTIFICATIONS)).toEqual(
      testStore.getState().notifications.items,
    )
  })

  it('clearReadNotifications удаляет только просмотренные и не трогает requests', () => {
    const testStore = createTestStore()
    const recipientTwo: User = { ...recipient, id: 'user-recipient-2' }
    testStore.dispatch(setMockUsers([recipient, recipientTwo]))
    loginAsUserA(testStore)

    // Первое уведомление создаём и сразу помечаем прочитанным.
    testStore.dispatch(sendSwapRequest(recipient.id))
    testStore.dispatch(markAllAsRead())

    // Второе создаём уже после — оно остаётся непрочитанным.
    testStore.dispatch(sendSwapRequest(recipientTwo.id))

    expect(testStore.getState().notifications.items).toHaveLength(2)
    const requestsCountBefore = testStore.getState().requests.items.length

    testStore.dispatch(clearReadNotifications())

    expect(testStore.getState().notifications.items).toHaveLength(1)
    expect(testStore.getState().notifications.items[0].isRead).toBe(false)
    expect(testStore.getState().requests.items).toHaveLength(requestsCountBefore)
  })

  it('очистка (clearNotifications) не удаляет requests', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))

    testStore.dispatch(clearNotifications())

    expect(testStore.getState().notifications.items).toEqual([])
    expect(testStore.getState().requests.items).toHaveLength(1)
  })

  it('selectVisibleNotifications не включает notification без связанной заявки', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))
    // Убираем заявку из requests, оставляя "осиротевшее" уведомление.
    testStore.dispatch(setRequests([]))

    expect(selectVisibleNotifications(testStore.getState())).toEqual([])
  })

  it('selectVisibleNotifications не включает notification, если пользователь-получатель не найден', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))
    // Получатель пропадает из справочника пользователей.
    testStore.dispatch(setMockUsers([]))

    expect(selectVisibleNotifications(testStore.getState())).toEqual([])
  })

  it('selectVisibleNotifications возвращает дату из заявки и данные получателя', () => {
    const testStore = createTestStore()
    testStore.dispatch(setMockUsers([recipient]))
    loginAsUserA(testStore)
    testStore.dispatch(sendSwapRequest(recipient.id))

    const [request] = testStore.getState().requests.items
    const visible = selectVisibleNotifications(testStore.getState())

    expect(visible).toEqual([
      {
        requestId: request.id,
        isRead: false,
        createdAt: request.createdAt,
        toUser: recipient,
      },
    ])
  })

  it('сортирует видимые уведомления от новых к старым', () => {
    const testStore = createTestStore()

    const secondRecipient: User = {
      ...recipient,
      id: 'user-recipient-2',
      name: 'Анна',
    }

    testStore.dispatch(setMockUsers([recipient, secondRecipient]))

    testStore.dispatch(
      setRequests([
        {
          id: 'older-request',
          fromUserId: accountA.userId,
          toUserId: recipient.id,
          createdAt: '2026-09-08T12:00:00.000Z',
        },
        {
          id: 'newer-request',
          fromUserId: accountA.userId,
          toUserId: secondRecipient.id,
          createdAt: '2026-09-10T12:00:00.000Z',
        },
      ]),
    )

    // Намеренно сохраняет старое уведомление первым.
    testStore.dispatch(
      setNotifications([
        {
          requestId: 'older-request',
          isRead: false,
        },
        {
          requestId: 'newer-request',
          isRead: true,
        },
      ]),
    )

    expect(
      selectVisibleNotifications(testStore.getState()).map(
        (notification) => notification.requestId,
      ),
    ).toEqual(['newer-request', 'older-request'])
  })
})
