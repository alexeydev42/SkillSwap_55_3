import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers as fetchUsersApi } from '@/api/users'
import type { User } from '@/shared/types'
import type { RootState } from '@/store'

export interface UsersState {
  mockUsers: User[]
  localUser: User | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}
// Задаёт начальное состояние пользователей.
const initialState: UsersState = {
  mockUsers: [],
  localUser: null,
  status: 'idle',
  error: null,
}

/**
 * LOGIC-05 — асинхронная загрузка моковых пользователей из public/db/users.json.
 * Разовый запрос (без фонового refresh-механизма) — обычно вызывается один
 * раз при старте приложения/каталога.
 */
export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => fetchUsersApi(),
)

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
        // Уже загруженных пользователей не очищаем — только статус/ошибку.
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'success'
        state.mockUsers = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Не удалось загрузить пользователей'
        // mockUsers намеренно не трогаем — при ошибке уже загруженные данные остаются.
      })
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

// Селекторы — доступ к пользователям и статусу загрузки из компонентов.
export const selectMockUsers = (state: RootState) => state.users.mockUsers
export const selectLocalUser = (state: RootState) => state.users.localUser
export const selectUsersStatus = (state: RootState) => state.users.status
export const selectUsersError = (state: RootState) => state.users.error

export default usersSlice.reducer
