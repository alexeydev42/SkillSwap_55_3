import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession, SwapRequest, User } from '@/shared/types'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'Password1!',
}

const session: AuthSession = { userId: account.userId }

const localUser: User = {
  id: account.userId,
  name: 'Мария',
  birthDate: '1995-10-28',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Фотография',
    categoryId: 'creativity-art',
    subcategoryId: 'photography',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 0,
  createdAt: '2026-09-10T00:00:00.000Z',
}

const existingRequest: SwapRequest = {
  id: 'existing-request-id',
  fromUserId: account.userId,
  toUserId: 'recipient-id',
  createdAt: '2026-09-10T12:00:00.000Z',
}

describe('Интеграция: восстановление состояния после перезагрузки страницы (F5)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('одновременно восстанавливает session, localUser, Favorites, Requests и Notifications', async () => {
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    storageService.set(STORAGE_KEYS.AUTH_SESSION, session)
    storageService.set(STORAGE_KEYS.LOCAL_USER, localUser)
    storageService.set(STORAGE_KEYS.FAVORITES, ['recipient-id'])
    storageService.set(STORAGE_KEYS.REQUESTS, [existingRequest])
    storageService.set(STORAGE_KEYS.NOTIFICATIONS, [
      { requestId: existingRequest.id, isRead: false },
    ])

    // Имитирует F5: весь стор пересоздаётся заново, как при реальной
    // перезагрузке страницы, и каждый слайс читает своё состояние из
    // storage независимо от остальных — проверяем, что все домены
    // восстанавливаются согласованно за одну «перезагрузку».
    vi.resetModules()
    const { store: freshStore } = await import('@/store')

    const state = freshStore.getState()

    expect(state.auth.session).toEqual(session)
    expect(state.users.localUser).toEqual(localUser)
    expect(state.favorites.favoriteUserIds).toEqual(['recipient-id'])
    expect(state.requests.items).toEqual([existingRequest])
    expect(state.notifications.items).toEqual([
      { requestId: existingRequest.id, isRead: false },
    ])
  })
})
