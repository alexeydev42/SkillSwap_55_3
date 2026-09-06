import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { CatalogFilters, CatalogSort } from '@/shared/types'

export interface CatalogFiltersState {
  filters: CatalogFilters
  sort: CatalogSort
}

// Задаёт начальные фильтры и сортировку каталога.
const initialState: CatalogFiltersState = {
  filters: {
    offerType: 'all',
    gender: 'all',
    subcategoryIds: [],
    cityIds: [],
  },
  sort: 'default',
}

const catalogFiltersSlice = createSlice({
  name: 'catalogFilters',
  initialState,
  reducers: {
    // Сохраняет выбранные фильтры каталога.
    setCatalogFilters(state, action: PayloadAction<CatalogFilters>) {
      state.filters = action.payload
    },

    // Сохраняет выбранную сортировку каталога.
    setCatalogSort(state, action: PayloadAction<CatalogSort>) {
      state.sort = action.payload
    },

    // Возвращает фильтры к начальным значениям.
    resetCatalogFilters(state) {
      state.filters = initialState.filters
    },
  },
})

export const { setCatalogFilters, setCatalogSort, resetCatalogFilters } =
  catalogFiltersSlice.actions

export default catalogFiltersSlice.reducer
