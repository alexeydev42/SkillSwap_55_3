import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AuthAccount, AuthSession } from '@/shared/types'

export interface AuthState {
  account: AuthAccount | null
  session: AuthSession | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Задаёт начальное состояние авторизации.
const initialState: AuthState = {
  account: null,
  session: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Сохраняет данные учётной записи.
    setAuthAccount(state, action: PayloadAction<AuthAccount>) {
      state.account = action.payload
    },

    // Сохраняет текущую пользовательскую сессию.
    setAuthSession(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload
    },

    // Завершает текущую пользовательскую сессию.
    clearAuthSession(state) {
      state.session = null
    },

    // ОбновляеregistrationSlice.tsт состояние операции авторизации.
    setAuthStatus(state, action: PayloadAction<AuthState['status']>) {
      state.status = action.payload
    },

    // Сохраняет или очищает ошибку авторизации.
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const {
  setAuthAccount,
  setAuthSession,
  clearAuthSession,
  setAuthStatus,
  setAuthError,
} = authSlice.actions

export default authSlice.reducer
