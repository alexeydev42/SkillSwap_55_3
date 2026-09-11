import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AvatarUpload } from '@/entities/user/ui/AvatarUpload'
import { validateBirthDate, validateName, validateUserDescription } from '@/shared/lib/validators'
import { Button } from '@/shared/ui/Button'
import { CityAutocomplete } from '@/shared/ui/CityAutocomplete'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Input } from '@/shared/ui/Input'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import styles from './PersonalDataSection.module.css'

export interface PersonalData {
  email: string
  name: string
  birthDate: Date | null
  gender: string
  /**
   * Название города (см. CityAutocomplete, который работает с именами, а не
   * id) — конвертация в/из cityId выполняется в PersonalDataSectionContainer.
   */
  city: string
  about: string
  avatar?: string
}

export interface PersonalDataSectionProps {
  data?: PersonalData
  onChangePassword?: () => void
  onSave?: (data: PersonalData) => void
  disabled?: boolean
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'female', label: 'Женский' },
  { value: 'male', label: 'Мужской' },
  { value: 'preferNotToSay', label: 'Не указан' },
]

const defaultData: PersonalData = {
  email: 'Mariia@gmail.com',
  name: 'Мария',
  birthDate: new Date(1995, 9, 28),
  gender: 'female',
  city: 'Москва',
  about: 'Люблю активный отдых и изучение новых языков',
  avatar: undefined,
}

// Преобразует Date локальной формы в строку YYYY-MM-DD для валидатора и User.birthDate.
function formatBirthDate(date: Date | null): string {
  if (!date) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function PersonalDataSection({
  data = defaultData,
  onChangePassword,
  onSave,
  disabled = false,
}: PersonalDataSectionProps) {
  const [name, setName] = useState(data.name)
  const [birthDate, setBirthDate] = useState<Date | null>(data.birthDate)
  const [gender, setGender] = useState(data.gender)
  const [city, setCity] = useState(data.city)
  const [about, setAbout] = useState(data.about)
  const [avatar, setAvatar] = useState(data.avatar)

  const [nameError, setNameError] = useState<string>()
  const [birthDateError, setBirthDateError] = useState<string>()
  const [aboutError, setAboutError] = useState<string>()
  const [avatarError, setAvatarError] = useState<string>()

  const hasChanges =
    name.trim() !== data.name.trim() ||
    formatBirthDate(birthDate) !== formatBirthDate(data.birthDate) ||
    gender !== data.gender ||
    city !== data.city ||
    about.trim() !== data.about.trim() ||
    avatar !== data.avatar

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setNameError(undefined)
  }

  const handleBirthDateChange = (date: Date | null) => {
    setBirthDate(date)
    setBirthDateError(undefined)
  }

  const handleAboutChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(event.target.value)
    setAboutError(undefined)
  }

  const handleAvatarChange = (image: string | undefined) => {
    setAvatar(image)
    setAvatarError(undefined)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextNameError = validateName(name)
    const nextBirthDateError = validateBirthDate(formatBirthDate(birthDate))
    const nextAboutError = validateUserDescription(about)

    setNameError(nextNameError?.message)
    setBirthDateError(nextBirthDateError?.message)
    setAboutError(nextAboutError?.message)

    if (nextNameError || nextBirthDateError || nextAboutError) {
      return
    }

    onSave?.({
      email: data.email,
      name: name.trim(),
      birthDate,
      gender,
      city,
      about: about.trim(),
      avatar,
    })
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.form}>
        <div className={styles.fieldWithLink}>
          <Input label="Почта" type="email" value={data.email} disabled />

          <button
            type="button"
            className={styles.changePasswordLink}
            onClick={onChangePassword}
            disabled={disabled}
          >
            Изменить пароль
          </button>
        </div>

        <Input
          label="Имя"
          value={name}
          onChange={handleNameChange}
          error={nameError}
          disabled={disabled}
        />

        <div className={styles.row}>
          <DatePicker
            label="Дата рождения"
            selected={birthDate}
            onChange={handleBirthDateChange}
            error={birthDateError}
            disabled={disabled}
          />

          <Select
            label="Пол"
            options={GENDER_OPTIONS}
            value={gender}
            onChange={setGender}
            disabled={disabled}
          />
        </div>

        <div>
          <span className={styles.label}>Город</span>
          <CityAutocomplete value={city} onChange={setCity} placeholder="Введите город" />
        </div>

        <Textarea
          label="О себе"
          value={about}
          onChange={handleAboutChange}
          error={aboutError}
          disabled={disabled}
        />

        <Button type="submit" className={styles.saveButton} disabled={disabled || !hasChanges}>
          Сохранить
        </Button>
      </div>

      <div className={styles.avatarWrapper}>
        <AvatarUpload
          image={avatar}
          size="large"
          error={avatarError}
          onImageChange={handleAvatarChange}
          onError={setAvatarError}
        />
      </div>
    </form>
  )
}
