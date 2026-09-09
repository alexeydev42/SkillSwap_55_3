import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarUpload } from '../../entities/user/ui/AvatarUpload'
import UserInfoIllustration from '../../shared/assets/illustrations/illustration-user-info.svg'
import { Button } from '../../shared/ui/Button'
import { CityAutocomplete } from '../../shared/ui/CityAutocomplete'
import { DatePicker } from '../../shared/ui/DatePicker'
import { Input } from '../../shared/ui/Input'
import { Select } from '../../shared/ui/Select'
import {
  SelectMultiCheckbox,
  type SelectMultiCheckboxOption,
} from '../../shared/ui/SelectMultiCheckbox'
import { AuthLayout } from '../../widgets/AuthLayout'
import { RegistrationProgress } from '../../widgets/RegistrationProgress'
import { categories, cities } from '../../shared/config/referenceData'
import { ROUTES } from '../../shared/lib/constants'
import { validateBirthDate, validateName } from '../../shared/lib/validators'
import type { Gender } from '../../shared/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateStep2Draft } from '../../store/slices/registrationSlice'
import styles from './RegistrationStep2.module.css'

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  {
    value: 'preferNotToSay',
    label: 'Не указан',
  },
  {
    value: 'male',
    label: 'Мужской',
  },
  {
    value: 'female',
    label: 'Женский',
  },
]

const CATEGORY_OPTIONS: SelectMultiCheckboxOption[] = categories.map(({ id, name }) => ({
  value: id,
  label: name,
}))

const getCategoryId = (subcategoryId: string) =>
  categories.find(({ subcategories }) => subcategories.some(({ id }) => id === subcategoryId))?.id

const normalizeSubcategories = (subcategoryIds: string[]): string[] => {
  const categoryMap = new Map<string, string>()

  subcategoryIds.forEach((subcategoryId) => {
    const categoryId = getCategoryId(subcategoryId)
    if (categoryId) {
      categoryMap.set(categoryId, subcategoryId)
    }
  })

  return Array.from(categoryMap.values())
}

const getAvailableSubcategoryIds = (categoryIds: string[]): string[] =>
  categories
    .filter(({ id }) => categoryIds.includes(id))
    .flatMap(({ subcategories }) => subcategories.map(({ id }) => id))

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDate = (value?: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
    ? null
    : date
}

const isDataUrl = (value: string) => {
  return value.startsWith('data:image/')
}

export const RegistrationStep2 = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.registration.draft)
  const savedCity = cities.find(({ id }) => id === draft.cityId)?.name ?? ''
  const [name, setName] = useState(draft.name ?? '')
  const [birthDate, setBirthDate] = useState<Date | null>(parseDate(draft.birthDate))
  const [gender, setGender] = useState<Gender | null>(
    GENDER_OPTIONS.find(({ value }) => value === draft.gender)?.value ?? null,
  )
  const [city, setCity] = useState(savedCity)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    categories
      .filter(({ subcategories }) =>
        subcategories.some((subcategory) => draft.learningSubcategoryIds?.includes(subcategory.id)),
      )
      .map(({ id }) => id),
  )
  const [subcategories, setSubcategories] = useState<string[]>(
    normalizeSubcategories(draft.learningSubcategoryIds ?? []),
  )
  const [avatar, setAvatar] = useState<string | undefined>(draft.avatarUrl ?? undefined)
  const [nameError, setNameError] = useState<string>()
  const [birthDateError, setBirthDateError] = useState<string>()
  const [genderError, setGenderError] = useState<string>()
  const [cityError, setCityError] = useState<string>()
  const [subcategoryError, setSubcategoryError] = useState<string>()
  const [avatarError, setAvatarError] = useState<string>()

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setNameError(undefined)
  }

  const handleSubcategoriesChange = (value: string[]) => {
    setSubcategories(normalizeSubcategories(value))
    setSubcategoryError(undefined)
  }

  const subcategoryOptions: SelectMultiCheckboxOption[] = categories
    .filter(({ id }) => selectedCategories.includes(id))
    .flatMap(({ subcategories: categorySubcategories }) =>
      categorySubcategories.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    )

  const handleCategoriesChange = (value: string[]) => {
    const availableSubcategoryIds = getAvailableSubcategoryIds(value)
    setSelectedCategories(value)
    setSubcategories((currentSubcategories) =>
      normalizeSubcategories(
        currentSubcategories.filter((subcategoryId) =>
          availableSubcategoryIds.includes(subcategoryId),
        ),
      ),
    )
    setSubcategoryError(undefined)
  }

  const handleAvatarChange = (value?: string) => {
    setAvatar(value)
    setAvatarError(undefined)
  }

  const handleAvatarError = (error?: string) => {
    setAvatarError(error)
  }

  const getStep2Draft = () => {
    const cityId = cities.find(({ name }) => name === city)?.id
    const availableSubcategoryIds = getAvailableSubcategoryIds(selectedCategories)
    const learningSubcategoryIds = subcategories.filter((subcategoryId) =>
      availableSubcategoryIds.includes(subcategoryId),
    )

    return {
      name: name.trim(),
      birthDate: birthDate ? formatDate(birthDate) : '',
      gender,
      ...(cityId ? { cityId } : {}),
      avatarUrl: avatar && isDataUrl(avatar) ? avatar : null,
      learningSubcategoryIds,
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextNameError = validateName(name)
    const birthDateValue = birthDate ? formatDate(birthDate) : ''
    const nextBirthDateError = validateBirthDate(birthDateValue)
    const cityId = cities.find(({ name }) => name === city)?.id
    const hasValidGender = GENDER_OPTIONS.some(({ value }) => value === gender)
    const nextGenderError = hasValidGender ? undefined : 'Пол: некорректное значение'
    const nextCityError = cityId ? undefined : 'Город: выберите значение из списка'

    const hasValidSubcategories =
      selectedCategories.length > 0 &&
      subcategories.length === selectedCategories.length &&
      selectedCategories.every((categoryId) =>
        subcategories.some((subcategoryId) => getCategoryId(subcategoryId) === categoryId),
      )

    const nextSubcategoryError = hasValidSubcategories
      ? undefined
      : 'Выберите по одной подкатегории для каждой категории'
    const nextAvatarError =
      avatar && !isDataUrl(avatar) ? 'Аватар должен быть в формате Data URL' : undefined

    setNameError(nextNameError?.message)
    setBirthDateError(nextBirthDateError?.message)
    setGenderError(nextGenderError)
    setCityError(nextCityError)
    setSubcategoryError(nextSubcategoryError)
    setAvatarError(nextAvatarError)

    if (
      nextNameError ||
      nextBirthDateError ||
      nextGenderError ||
      nextCityError ||
      nextSubcategoryError ||
      nextAvatarError ||
      !cityId ||
      !hasValidGender
    ) {
      return
    }

    dispatch(
      updateStep2Draft({
        name: name.trim(),
        birthDate: birthDateValue,
        gender: gender as Gender,
        cityId: cityId as string,
        avatarUrl: avatar && isDataUrl(avatar) ? avatar : null,
        learningSubcategoryIds: normalizeSubcategories(
          subcategories.filter((subcategoryId) =>
            getAvailableSubcategoryIds(selectedCategories).includes(subcategoryId),
          ),
        ),
      }),
    )

    navigate(ROUTES.REGISTER_STEP_3)
  }

  const handleBack = () => {
    dispatch(updateStep2Draft(getStep2Draft()))
    navigate(ROUTES.REGISTER)
  }

  return (
    <AuthLayout
      topContent={<RegistrationProgress currentStep={2} />}
      infoBlockProps={{
        illustration: <img className={styles.illustration} src={UserInfoIllustration} alt="" />,
        title: 'Расскажите немного о себе',
        description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <AvatarUpload
            image={avatar}
            error={avatarError}
            onImageChange={handleAvatarChange}
            onError={handleAvatarError}
          />
          <Input
            label="Имя"
            placeholder="Введите ваше имя"
            value={name}
            onChange={handleNameChange}
            error={nameError}
          />
          <div className={styles.row}>
            <DatePicker
              label="Дата рождения"
              selected={birthDate}
              onChange={(value) => {
                setBirthDate(value)
                setBirthDateError(undefined)
              }}
              error={birthDateError}
            />
            <div className={styles.field}>
              <span className={styles.label}>Пол</span>
              <Select
                className={styles.genderSelect}
                options={GENDER_OPTIONS}
                value={gender ?? ''}
                onChange={(value) => {
                  const selectedGender = GENDER_OPTIONS.find(
                    (option) => option.value === value,
                  )?.value

                  if (selectedGender) {
                    setGender(selectedGender)
                    setGenderError(undefined)
                  }
                }}
                error={genderError}
              />
            </div>
          </div>
          <div className={styles.cityField}>
            <span className={styles.label}>Город</span>
            <CityAutocomplete
              className={styles.cityAutocomplete}
              value={city}
              onChange={(value) => {
                setCity(value)
                setCityError(undefined)
              }}
              placeholder="Не указан"
            />
            {cityError && <span className={styles.error}>{cityError}</span>}
          </div>
          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Категория навыка, которому хотите научиться"
            options={CATEGORY_OPTIONS}
            value={selectedCategories}
            onChange={handleCategoriesChange}
            placeholder="Выберите категорию"
          />
          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Подкатегория навыка, которому хотите научиться"
            options={subcategoryOptions}
            value={subcategories}
            onChange={handleSubcategoriesChange}
            placeholder="Выберите подкатегорию"
          />
          {subcategoryError && <span className={styles.error}>{subcategoryError}</span>}
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} type="button" variant="secondary" onClick={handleBack}>
            Назад
          </Button>
          <Button className={styles.button} type="submit">
            Продолжить
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
