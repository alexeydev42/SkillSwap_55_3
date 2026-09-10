import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import catalogFiltersReducer, {
  resetCatalogFilters,
  setCatalogFilters,
  setCatalogSort,
} from '@/store/slices/catalogFiltersSlice'

import { listenerMiddleware } from './listenerMiddleware'

const buildTestStore = () =>
  configureStore({
    reducer: {
      catalogFilters: catalogFiltersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  })

describe('listenerMiddleware — синхронизация фильтров с sessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('сохраняет фильтры при setCatalogFilters', async () => {
    const store = buildTestStore()

    const newFilters = {
      offerType: 'teaching' as const,
      gender: 'all' as const,
      subcategoryIds: ['sub-1'],
      cityIds: [],
    }

    store.dispatch(setCatalogFilters(newFilters))

    await vi.waitFor(() => {
      expect(
        JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS) ?? 'null'),
      ).toEqual(newFilters)
    })
  })

  it('сохраняет сортировку при setCatalogSort', async () => {
    const store = buildTestStore()

    store.dispatch(setCatalogSort('newest'))

    await vi.waitFor(() => {
      expect(JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT) ?? 'null')).toBe(
        'newest',
      )
    })
  })

  it('удаляет фильтры и сортировку при resetCatalogFilters', async () => {
    const store = buildTestStore()

    store.dispatch(
      setCatalogFilters({
        offerType: 'learning',
        gender: 'male',
        subcategoryIds: [],
        cityIds: ['c-1'],
      }),
    )
    store.dispatch(setCatalogSort('newest'))

    await vi.waitFor(() => {
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS)).not.toBeNull()

      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT)).not.toBeNull()
    })

    store.dispatch(resetCatalogFilters())

    await vi.waitFor(() => {
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS)).toBeNull()

      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT)).toBeNull()
    })
  })
})
