import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { User } from '@/shared/types'

export interface UsersState {
  mockUsers: User[]
  localUser: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Задаёт начальное состояние пользователей.
const initialState: UsersState = {
  mockUsers: [],
  localUser: null,
  status: 'idle',
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Сохраняет список пользователей каталога.
    setMockUsers(state, action: PayloadAction<User[]>) {
      state.mockUsers = action.payload
    },

    // Добавляет одного пользователя в общий список.
    addUser(state, action: PayloadAction<User>) {
      state.mockUsers.push(action.payload)
    },

    // Сохраняет пользователя, зарегистрированного в браузере.
    setLocalUser(state, action: PayloadAction<User>) {
      state.localUser = action.payload
    },

    // Удаляет локального пользователя из Redux.
    clearLocalUser(state) {
      state.localUser = null
    },

    // Обновляет состояние загрузки пользователей.
    setUsersStatus(state, action: PayloadAction<UsersState['status']>) {
      state.status = action.payload
    },

    // Сохраняет или очищает сообщение об ошибке.
    setUsersError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const {
  setMockUsers,
  addUser,
  setLocalUser,
  clearLocalUser,
  setUsersStatus,
  setUsersError,
} = usersSlice.actions

export default usersSlice.reducer
