import { cities } from '@/shared/config'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { Gender, User } from '@/shared/types'
import type { PersonalData } from '@/widgets/PersonalDataSection'
import { setLocalUser } from '@/store/slices/usersSlice'
import type { AppDispatch, RootState } from '@/store'

// Преобразует Date из формы в строку YYYY-MM-DD для User.birthDate.
function formatBirthDate(date: Date | null): string {
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Сохраняет отредактированные личные данные текущего локального пользователя
 * (LOGIC-30). offeredSkill, learningSubcategoryIds, likesCount, createdAt и id
 * не затрагиваются — редактирование навыка вне рамок этой задачи. Email и
 * пароль также не меняются здесь — они не редактируются в этой форме.
 * Персистентность — по установленному в проекте паттерну (finalizeRegistration):
 * сначала storageService.set, затем dispatch, если запись удалась.
 */
export const updatePersonalData =
  (formData: PersonalData) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const { localUser } = getState().users

    if (!localUser) {
      return false
    }

    const city = cities.find(({ name }) => name === formData.city)

    const updatedUser: User = {
      ...localUser,
      name: formData.name.trim(),
      birthDate: formatBirthDate(formData.birthDate),
      gender: formData.gender as Gender,
      cityId: city?.id ?? localUser.cityId,
      description: formData.about.trim(),
      avatarUrl: formData.avatar ?? null,
    }

    const isUserSaved = storageService.set(STORAGE_KEYS.LOCAL_USER, updatedUser)

    if (!isUserSaved) {
      return false
    }

    dispatch(setLocalUser(updatedUser))

    return true
  }
