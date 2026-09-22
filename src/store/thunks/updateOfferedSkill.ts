import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { OfferedSkill, User } from '@/shared/types'
import type { AppDispatch, RootState } from '@/store'
import { setLocalUser } from '@/store/slices/usersSlice'

/**
 * Сохраняет изменения навыка текущего локального пользователя.
 * Остальные данные пользователя не изменяются.
 */
export const updateOfferedSkill =
  (offeredSkill: OfferedSkill) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const state = getState()
    const localUser = state.users.localUser
    const currentUserId = state.auth.session?.userId

    if (!localUser || !currentUserId || localUser.id !== currentUserId) {
      return false
    }

    const updatedUser: User = {
      ...localUser,
      offeredSkill: {
        ...offeredSkill,
        title: offeredSkill.title.trim(),
        description: offeredSkill.description.trim(),
        imageUrls: [...offeredSkill.imageUrls],
      },
    }

    const isSaved = storageService.set(STORAGE_KEYS.LOCAL_USER, updatedUser)

    if (!isSaved) {
      return false
    }

    dispatch(setLocalUser(updatedUser))

    return true
  }
