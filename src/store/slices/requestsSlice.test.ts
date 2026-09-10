import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthSession, SwapRequest } from '@/shared/types'
import type { AppDispatch, RootState } from '@/store'
import authReducer from '@/store/slices/authSlice'

import requestsReducer, { clearRequests, createSwapRequest, restoreRequests } from './requestsSlice'

const currentUserId = 'current-user-id'
const targetUserId = 'target-user-id'

const existingRequest: SwapRequest = {
  id: 'existing-request-id',
  fromUserId: currentUserId,
  toUserId: targetUserId,
  createdAt: '2026-09-10T12:00:00.000Z',
}

const createTestStore = (
  session: AuthSession | null = {
    userId: currentUserId,
  },
  requests: SwapRequest[] = [],
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      requests: requestsReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session,
        status: 'idle' as const,
        error: null,
      },
      requests: {
        items: requests,
      },
    },
  })

type TestStore = ReturnType<typeof createTestStore>

const runCreateSwapRequest = (testStore: TestStore, toUserId: string) =>
  createSwapRequest(toUserId)(
    testStore.dispatch as unknown as AppDispatch,
    testStore.getState as unknown as () => RootState,
  )

const runRestoreRequests = (testStore: TestStore) =>
  restoreRequests()(
    testStore.dispatch as unknown as AppDispatch,
    testStore.getState as unknown as () => RootState,
  )

describe('requestsSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('создаёт request и сохраняет его перед добавлением в Redux', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-10T15:30:00.000Z'))

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001',
    )

    const testStore = createTestStore()

    const result = runCreateSwapRequest(testStore, targetUserId)

    const expectedRequest: SwapRequest = {
      id: '00000000-0000-4000-8000-000000000001',
      fromUserId: currentUserId,
      toUserId: targetUserId,
      createdAt: '2026-09-10T15:30:00.000Z',
    }

    expect(result).toEqual(expectedRequest)
    expect(testStore.getState().requests.items).toEqual([expectedRequest])
    expect(storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS)).toEqual([expectedRequest])
  })

  it('не добавляет request в Redux при ошибке сохранения', () => {
    const testStore = createTestStore()

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const result = runCreateSwapRequest(testStore, targetUserId)

    expect(result).toBeNull()
    expect(testStore.getState().requests.items).toEqual([])
  })

  it('не создаёт повторную заявку тому же пользователю', () => {
    const testStore = createTestStore(null, [existingRequest])

    testStore.dispatch({
      type: 'auth/setAuthSession',
      payload: { userId: currentUserId },
    })

    const result = runCreateSwapRequest(testStore, targetUserId)

    expect(result).toBeNull()
    expect(testStore.getState().requests.items).toEqual([existingRequest])
  })

  it('не позволяет создать заявку самому себе', () => {
    const testStore = createTestStore()

    const result = runCreateSwapRequest(testStore, currentUserId)

    expect(result).toBeNull()
    expect(testStore.getState().requests.items).toEqual([])
  })

  it('не создаёт заявку без активной сессии', () => {
    const testStore = createTestStore(null)

    const result = runCreateSwapRequest(testStore, targetUserId)

    expect(result).toBeNull()
    expect(testStore.getState().requests.items).toEqual([])
  })

  it('восстанавливает только заявки текущего пользователя', () => {
    const anotherUserRequest: SwapRequest = {
      id: 'another-request-id',
      fromUserId: 'another-user-id',
      toUserId: 'another-target-id',
      createdAt: '2026-09-09T12:00:00.000Z',
    }

    storageService.set(STORAGE_KEYS.REQUESTS, [existingRequest, anotherUserRequest])

    const testStore = createTestStore()

    runRestoreRequests(testStore)

    expect(testStore.getState().requests.items).toEqual([existingRequest])
  })

  it('восстанавливает заявки после F5 при активной сессии', async () => {
    storageService.set(STORAGE_KEYS.AUTH_SESSION, {
      userId: currentUserId,
    })
    storageService.set(STORAGE_KEYS.REQUESTS, [existingRequest])

    vi.resetModules()

    const { default: freshRequestsReducer } = await import('./requestsSlice')

    const restoredState = freshRequestsReducer(undefined, {
      type: 'unknown',
    })

    expect(restoredState.items).toEqual([existingRequest])
  })

  it('не восстанавливает заявки без активной сессии', async () => {
    storageService.set(STORAGE_KEYS.REQUESTS, [existingRequest])

    vi.resetModules()

    const { default: freshRequestsReducer } = await import('./requestsSlice')

    const restoredState = freshRequestsReducer(undefined, {
      type: 'unknown',
    })

    expect(restoredState.items).toEqual([])
  })

  it('clearRequests очищает только Redux, localStorage не трогает', () => {
    storageService.set(STORAGE_KEYS.REQUESTS, [existingRequest])

    const testStore = createTestStore(
      { userId: currentUserId },
      [existingRequest],
    )

    testStore.dispatch(clearRequests())

    expect(testStore.getState().requests.items).toEqual([])
    expect(storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS)).toEqual([existingRequest])
  })
})
