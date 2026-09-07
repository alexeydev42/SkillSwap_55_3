import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers as fetchUsersApi } from '@/api/users'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import { selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
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
  // Восстанавливает локального пользователя при создании store.
  localUser: storageService.get<User>(STORAGE_KEYS.LOCAL_USER),
  status: 'idle',
  error: null,
}
//Разовый запрос (без фонового refresh-механизма) — обычно вызывается один раз при старте приложения/каталога.
export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => fetchUsersApi())
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
// Получает id авторизованного пользователя из текущей сессии.
const selectAuthUserId = (state: RootState) => state.auth.session?.userId ?? null
// Объединяет моковых пользователей и локального пользователя для каталога.
export const selectAllUsers = createSelector(
  [selectMockUsers, selectLocalUser],
  (mockUsers, localUser) => {
    if (!localUser) {
      return mockUsers
    }
    // Исключает возможный дубль локального пользователя из общего каталога.
    const usersWithoutDuplicate = mockUsers.filter((user) => user.id !== localUser.id)
    return [...usersWithoutDuplicate, localUser]
  },
)
// Возвращает локального пользователя, если его id совпадает с текущей сессией.
export const selectCurrentUser = createSelector(
  [selectLocalUser, selectAuthUserId],
  (localUser, authUserId) => {
    if (!localUser || localUser.id !== authUserId) {
      return null
    }
    return localUser
  },
)
// Находит пользователя по id в общем каталоге.
export const selectUserById = createSelector(
  [selectAllUsers, (_state: RootState, userId: string) => userId],
  (users, userId) => users.find((user) => user.id === userId) ?? null,
)
// Сортирует пользователей по количеству лайков от большего к меньшему.
export const selectPopularUsers = createSelector([selectAllUsers], (users) =>
  [...users].sort((firstUser, secondUser) => secondUser.likesCount - firstUser.likesCount),
)
// Сортирует пользователей по дате создания от новых к старым.
export const selectNewUsers = createSelector([selectAllUsers], (users) =>
  [...users].sort(
    (firstUser, secondUser) => Date.parse(secondUser.createdAt) - Date.parse(firstUser.createdAt),
  ),
)
export const selectUsersStatus = (state: RootState) => state.users.status
export const selectUsersError = (state: RootState) => state.users.error
/**
 * Вычисляет актуальное количество лайков пользователя: базовый likesCount
 * (из users.json / локального пользователя) + 1, если пользователь есть в
 * Favorites. Отдельного стейта для overrides лайков нигде не хранится —
 * значение всегда пересчитывается заново из users + favorites, поэтому оно
 * корректно восстанавливается и после F5.
 */
export const selectEffectiveLikesCount = createSelector(
  [selectUserById, selectFavoriteUserIds],
  (user, favoriteUserIds) => {
    if (!user) {
      return 0
    }
    const baseLikes = Number(user.likesCount) || 0
    return baseLikes + (favoriteUserIds.includes(user.id) ? 1 : 0)
  },
)
/**
 * Вычисляет полный список подкатегорий «Хочу научиться» для пользователя.
 * Для локального пользователя добавляет к базовому списку подкатегории
 * навыков всех пользователей, находящихся в избранном.
 * Для мокового пользователя возвращает исходный список без вычислений.
 */
export const selectEffectiveLearningSubcategoryIds = createSelector(
  [selectUserById, selectLocalUser, selectFavoriteUserIds, selectAllUsers],
  (user, localUser, favoriteUserIds, allUsers) => {
    if (!user) {
      return []
    }

    if (!localUser || user.id !== localUser.id) {
      return user.learningSubcategoryIds
    }

    const favoriteSubcategoryIds = allUsers
      .filter((favoriteUser) => favoriteUserIds.includes(favoriteUser.id))
      .map((favoriteUser) => favoriteUser.offeredSkill.subcategoryId)

    return Array.from(
      new Set([...user.learningSubcategoryIds, ...favoriteSubcategoryIds]),
    )
  },
)

export default usersSlice.reducer
