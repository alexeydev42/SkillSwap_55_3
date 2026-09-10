import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { SwapRequest } from '@/shared/types'
import type { AppDispatch } from '@/store'
import authReducer, { setAuthSession } from '@/store/slices/authSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import registrationReducer from '@/store/slices/registrationSlice'
import requestsReducer, { setRequests } from '@/store/slices/requestsSlice'

import { logout } from './authThunks'

const savedRequest: SwapRequest = {
  id: 'saved-request-id',
  fromUserId: 'current-user-id',
  toUserId: 'target-user-id',
  createdAt: '2026-09-10T12:00:00.000Z',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      catalogFilters: catalogFiltersReducer,
      favorites: favoritesReducer,
      registration: registrationReducer,
      requests: requestsReducer,
    },
  })

describe('logout', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('очищает Requests из Redux, но сохраняет их в localStorage', () => {
    storageService.set(STORAGE_KEYS.AUTH_SESSION, {
      userId: savedRequest.fromUserId,
    })
    storageService.set(STORAGE_KEYS.REQUESTS, [savedRequest])

    const testStore = createTestStore()

    testStore.dispatch(
      setAuthSession({
        userId: savedRequest.fromUserId,
      }),
    )
    testStore.dispatch(setRequests([savedRequest]))

    logout()(testStore.dispatch as unknown as AppDispatch)

    expect(testStore.getState().auth.session).toBeNull()
    expect(testStore.getState().requests.items).toEqual([])

    expect(storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS)).toEqual([savedRequest])
  })
})
