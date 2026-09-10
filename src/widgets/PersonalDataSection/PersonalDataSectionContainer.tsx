import { cities } from '@/shared/config'
import type { User } from '@/shared/types'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectLocalUser } from '@/store/slices/usersSlice'
import { updatePersonalData } from '@/store/thunks/updatePersonalData'
import { PersonalDataSection, type PersonalData } from './PersonalDataSection'

// Преобразует дату рождения User (строка YYYY-MM-DD) в Date для формы.
function parseBirthDate(birthDate: string): Date | null {
  if (!birthDate) {
    return null
  }

  const [year, month, day] = birthDate.split('-').map(Number)

  return new Date(year, month - 1, day)
}

// Собирает PersonalData из User (Redux) и email аккаунта для передачи в PersonalDataSection.
function mapUserToPersonalData(user: User, email: string): PersonalData {
  const city = cities.find(({ id }) => id === user.cityId)

  return {
    email,
    name: user.name,
    birthDate: parseBirthDate(user.birthDate),
    gender: user.gender,
    city: city?.name ?? user.cityId,
    about: user.description,
    avatar: user.avatarUrl ?? undefined,
  }
}

export function PersonalDataSectionContainer() {
  const dispatch = useAppDispatch()
  const localUser = useAppSelector(selectLocalUser)
  const email = useAppSelector((state) => state.auth.account?.email ?? '')

  if (!localUser) {
    return null
  }

  const data = mapUserToPersonalData(localUser, email)

  const handleSave = (formData: PersonalData) => {
    dispatch(updatePersonalData(formData))
  }

  return <PersonalDataSection data={data} onSave={handleSave} />
}
