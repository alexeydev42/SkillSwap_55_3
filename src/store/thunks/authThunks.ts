import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AppDispatch } from '@/store'
import { clearAuthSession } from '@/store/slices/authSlice'
import { resetCatalogFilters } from '@/store/slices/catalogFiltersSlice'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import { resetRegistrationDraft } from '@/store/slices/registrationSlice'
import { clearRequests } from '@/store/slices/requestsSlice'

// Выполняет полную очистку активного состояния при выходе пользователя.
export const logout =
  () =>
  (dispatch: AppDispatch): void => {
    storageService.remove(STORAGE_KEYS.AUTH_SESSION)

    dispatch(clearAuthSession())
    dispatch(clearFavorites())
    dispatch(clearRequests())
    dispatch(resetRegistrationDraft())

    // Одновременно сбрасывает Redux-state и через listener удаляет
    // сохранённые фильтры и сортировку из sessionStorage.
    dispatch(resetCatalogFilters())
  }
