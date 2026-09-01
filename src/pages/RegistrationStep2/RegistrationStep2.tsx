import { useState, type ChangeEvent, type FormEvent } from 'react'

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

import styles from './RegistrationStep2.module.css'

// Содержит статические варианты пола для обычного Select.
const GENDER_OPTIONS = [
  {
    value: 'not-specified',
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

// Содержит статические категории навыков для первого мультиселекта.
const CATEGORY_OPTIONS: SelectMultiCheckboxOption[] = [
  {
    value: 'business',
    label: 'Бизнес и карьера',
  },
  {
    value: 'creative',
    label: 'Творчество и искусство',
  },
  {
    value: 'languages',
    label: 'Иностранные языки',
  },
  {
    value: 'health',
    label: 'Здоровье и лайфстайл',
  },
  {
    value: 'home',
    label: 'Дом и уют',
  },
]

// Содержит статические подкатегории без зависимости от выбранной категории.
const SUBCATEGORY_OPTIONS: SelectMultiCheckboxOption[] = [
  {
    value: 'drawing',
    label: 'Рисование и иллюстрация',
  },
  {
    value: 'photography',
    label: 'Фотография',
  },
  {
    value: 'video-editing',
    label: 'Видеомонтаж',
  },
  {
    value: 'music',
    label: 'Музыка и звук',
  },
  {
    value: 'acting',
    label: 'Актёрское мастерство',
  },
  {
    value: 'creative-writing',
    label: 'Креативное письмо',
  },
  {
    value: 'art-therapy',
    label: 'Арт-терапия',
  },
  {
    value: 'diy',
    label: 'Декор и DIY',
  },
]

export const RegistrationStep2 = () => {
  // Хранит локальные значения полей, необходимые контролируемым компонентам формы.
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [gender, setGender] = useState('not-specified')
  const [city, setCity] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<string[]>([])

  // Обновляет значение текстового поля имени.
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  // Отключает реальную отправку формы до подключения перехода на следующий шаг.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
        {/* Объединяет аватар и поля формы в вертикальную группу. */}
        <div className={styles.fields}>
          <AvatarUpload />

          <Input
            label="Имя"
            placeholder="Введите ваше имя"
            value={name}
            onChange={handleNameChange}
          />

          {/* Располагает дату рождения и пол в одной строке. */}
          <div className={styles.row}>
            <DatePicker label="Дата рождения" selected={birthDate} onChange={setBirthDate} />

            <div className={styles.field}>
              <span className={styles.label}>Пол</span>

              <Select
                className={styles.genderSelect}
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender}
              />
            </div>
          </div>

          {/* Использует отдельный автокомплит со статическим списком городов. */}
          <div className={styles.cityField}>
            <span className={styles.label}>Город</span>

            <CityAutocomplete
              className={styles.cityAutocomplete}
              value={city}
              onChange={setCity}
              placeholder="Не указан"
            />
          </div>

          {/* Позволяет выбрать несколько категорий навыков. */}
          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Категория навыка, которому хотите научиться"
            options={CATEGORY_OPTIONS}
            value={categories}
            onChange={setCategories}
            placeholder="Выберите категорию"
          />

          {/* Выводит независимый статический список подкатегорий. */}
          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Подкатегория навыка, которому хотите научиться"
            options={SUBCATEGORY_OPTIONS}
            value={subcategories}
            onChange={setSubcategories}
            placeholder="Выберите подкатегорию"
          />
        </div>

        {/* Навигация пока не меняет шаг регистрации. */}
        <div className={styles.buttons}>
          <Button className={styles.button} type="button" variant="secondary">
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
