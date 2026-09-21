import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthSession, SwapRequest } from '@/shared/types'
import type { AppDispatch, RootState } from '@/store'

// Описывает активное состояние заявок текущего пользователя.
export interface RequestsState {
  items: SwapRequest[]
}

// Загружает только заявки пользователя из сохранённой сессии.
const getStoredRequests = (): SwapRequest[] => {
  const session = storageService.get<AuthSession>(STORAGE_KEYS.AUTH_SESSION)

  if (!session) {
    return []
  }

  const storedRequests = storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS) ?? []

  return storedRequests.filter(({ fromUserId }) => fromUserId === session.userId)
}

// Восстанавливает заявки после F5 при активной сессии.
const initialState: RequestsState = {
  items: getStoredRequests(),
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // Заменяет активный список заявок.
    setRequests(state, action: PayloadAction<SwapRequest[]>) {
      state.items = action.payload
    },

    // Добавляет успешно сохранённую заявку.
    addRequest(state, action: PayloadAction<SwapRequest>) {
      state.items.push(action.payload)
    },

    removeRequest(state, action: PayloadAction<string>) {
      state.items = state.items.filter((request) => request.id !== action.payload)
    },

    // Очищает только активное состояние Redux.
    clearRequests(state) {
      state.items = []
    },
  },
})

export const { setRequests, addRequest, removeRequest, clearRequests } = requestsSlice.actions

// Создаёт и сохраняет новую заявку на обмен.
export const createSwapRequest =
  (toUserId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): SwapRequest | null => {
    const state = getState()
    const fromUserId = state.auth.session?.userId

    // Не создаёт заявку без активной сессии.
    if (!fromUserId) {
      return null
    }

    // Не позволяет отправить заявку самому себе.
    if (fromUserId === toUserId) {
      return null
    }

    // Не позволяет повторно предложить обмен тому же пользователю.
    const hasExistingRequest = state.requests.items.some(
      (request) => request.fromUserId === fromUserId && request.toUserId === toUserId,
    )

    if (hasExistingRequest) {
      return null
    }

    const request: SwapRequest = {
      id: crypto.randomUUID(),
      fromUserId,
      toUserId,
      createdAt: new Date().toISOString(),
    }

    const updatedRequests = [...state.requests.items, request]

    // Redux обновляется только после успешного сохранения.
    const isSaved = storageService.set(STORAGE_KEYS.REQUESTS, updatedRequests)

    if (!isSaved) {
      return null
    }

    dispatch(addRequest(request))

    return request
  }

// Восстанавливает заявки текущего пользователя после login.
export const restoreRequests =
  () =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const currentUserId = getState().auth.session?.userId

    if (!currentUserId) {
      dispatch(setRequests([]))
      return
    }

    const storedRequests = storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS) ?? []

    const currentUserRequests = storedRequests.filter(
      ({ fromUserId }) => fromUserId === currentUserId,
    )

    dispatch(setRequests(currentUserRequests))
  }

// Проверяет наличие заявки выбранному пользователю.
export const selectHasRequestToUser = (state: RootState, toUserId: string) => {
  const currentUserId = state.auth.session?.userId

  if (!currentUserId) {
    return false
  }

  return state.requests.items.some(
    (request) => request.fromUserId === currentUserId && request.toUserId === toUserId,
  )
}

export const removeSwapRequest =
  (requestId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const requests = getState().requests.items

    if (!requests.some((request) => request.id === requestId)) {
      return false
    }

    const updatedRequests = requests.filter((request) => request.id !== requestId)

    const isSaved = storageService.set(STORAGE_KEYS.REQUESTS, updatedRequests)

    if (!isSaved) {
      return false
    }

    dispatch(removeRequest(requestId))

    return true
  }

export default requestsSlice.reducer
