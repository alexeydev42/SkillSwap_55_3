import { createListenerMiddleware, isAnyOf, type TypedStartListening } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AppDispatch, RootState } from '@/store'
import {
  resetCatalogFilters,
  setCatalogFilters,
  setCatalogSort,
} from '@/store/slices/catalogFiltersSlice'

export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
const startAppListening = listenerMiddleware.startListening as AppStartListening

// Сохраняет фильтры и сортировку каталога в sessionStorage при каждом изменении.
startAppListening({
  matcher: isAnyOf(setCatalogFilters, setCatalogSort),
  effect: (_action, listenerApi) => {
    const { filters, sort } = listenerApi.getState().catalogFilters

    storageService.set(STORAGE_KEYS.CATALOG_FILTERS, filters, 'session')
    storageService.set(STORAGE_KEYS.CATALOG_SORT, sort, 'session')
  },
})

// Удаляет сохранённые фильтры и сортировку каталога из sessionStorage при сбросе.
startAppListening({
  actionCreator: resetCatalogFilters,
  effect: () => {
    storageService.remove(STORAGE_KEYS.CATALOG_FILTERS, 'session')
    storageService.remove(STORAGE_KEYS.CATALOG_SORT, 'session')
  },
})
