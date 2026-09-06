import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FavoritesState {
  userIds: string[]
}

// Задаёт пустой список избранных пользователей.
const initialState: FavoritesState = {
  userIds: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Добавляет пользователя в избранное.
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.userIds.includes(action.payload)) {
        state.userIds.push(action.payload)
      }
    },

    // Удаляет пользователя из избранного.
    removeFavorite(state, action: PayloadAction<string>) {
      state.userIds = state.userIds.filter((userId) => userId !== action.payload)
    },

    // Очищает список избранного.
    clearFavorites(state) {
      state.userIds = []
    },
  },
})

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer
