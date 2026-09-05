import { useState } from 'react'
import clsx from 'clsx'

import { RadioButton } from '@/shared/ui/RadioButton'
import { Checkbox } from '@/shared/ui/Checkbox'
import { FilterCategoryGroup } from '@/widgets/FilterCategoryGroup'
import ChevronDownIcon from '@/shared/assets/icons/icon-chevron-down.svg?react'

import styles from './FiltersSidebar.module.css'

export interface FilterCategoryData {
  /** Название категории навыков. */
  category: string
  /**
   * Подкатегории. Если список непустой — категория рендерится через
   * FilterCategoryGroup (сворачиваемая группа с чекбоксами внутри).
   * Если подкатегорий нет — категория рендерится как обычный Checkbox.
   */
  subcategories?: string[]
}

export interface FiltersSidebarProps {
  categories: FilterCategoryData[]
  cities: string[]
  selectedFilters: string[]
  onChange: (filters: string[]) => void
  className?: string
}

const OFFER_TYPES = ['Всё', 'Хочу научиться', 'Могу научить']
const GENDERS = ['Не имеет значения', 'Мужской', 'Женский']

/**
 * FiltersSidebar (VERST-48) — левая панель фильтров каталога.
 * Все повторяющиеся элементы собраны из готовых компонентов:
 * RadioButton (тип предложения, пол), Checkbox (одиночные категории, город),
 * FilterCategoryGroup (категории с подкатегориями). Собственной вёрстки
 * для этих элементов нет — только контейнеры/заголовки секций.
 *
 * Компонент управляемый: список выбранных фильтров (навыки + города)
 * и колбек onChange прокидываются сверху. Радиогруппы (тип предложения, пол)
 * хранят своё состояние внутри, но при изменении тоже добавляют выбранное
 * значение в список фильтров через onChange.
 */
export function FiltersSidebar({
  categories,
  cities,
  selectedFilters,
  onChange,
  className,
}: FiltersSidebarProps) {
  // По умолчанию показывает каталог без фильтра по типу предложения.
  const [offerType, setOfferType] = useState(OFFER_TYPES[0])
  const [gender, setGender] = useState(GENDERS[0])

  const toggleFilter = (label: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedFilters, label])
    } else {
      onChange(selectedFilters.filter((item) => item !== label))
    }
  }

  const handleOfferType = (label: string) => {
    setOfferType(label)
    const withoutOfferType = selectedFilters.filter(
      (item) => !OFFER_TYPES.includes(item) || item === OFFER_TYPES[0],
    )
    if (label !== OFFER_TYPES[0]) {
      onChange([...withoutOfferType, label])
    } else {
      onChange(withoutOfferType)
    }
  }

  const handleGender = (label: string) => {
    setGender(label)
    const withoutGender = selectedFilters.filter(
      (item) => !GENDERS.includes(item) || item === GENDERS[0],
    )
    if (label !== GENDERS[0]) {
      onChange([...withoutGender, label])
    } else {
      onChange(withoutGender)
    }
  }

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.group}>
        {OFFER_TYPES.map((label) => (
          <RadioButton
            key={label}
            name="offerType"
            label={label}
            checked={offerType === label}
            onChange={() => handleOfferType(label)}
          />
        ))}
      </div>

      <section className={styles.section}>
        <h3 className={styles.heading}>Навыки</h3>
        <div className={styles.categories}>
          {categories.map(({ category, subcategories }) =>
            subcategories && subcategories.length > 0 ? (
              <FilterCategoryGroup
                key={category}
                category={category}
                subcategories={subcategories}
                checkedSubcategories={subcategories.filter((sub) => selectedFilters.includes(sub))}
                onChange={(checked) => {
                  const otherFilters = selectedFilters.filter(
                    (item) => !subcategories.includes(item),
                  )
                  onChange([...otherFilters, ...checked])
                }}
              />
            ) : (
              <Checkbox
                key={category}
                label={category}
                checked={selectedFilters.includes(category)}
                onChange={(e) => toggleFilter(category, e.target.checked)}
              />
            ),
          )}
        </div>
        <button type="button" className={styles.showMore}>
          Все категории
          <ChevronDownIcon className={styles.showMoreIcon} aria-hidden="true" />
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Пол автора</h3>
        <div className={styles.group}>
          {GENDERS.map((label) => (
            <RadioButton
              key={label}
              name="gender"
              label={label}
              checked={gender === label}
              onChange={() => handleGender(label)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Город</h3>
        <div className={styles.group}>
          {cities.map((city) => (
            <Checkbox
              key={city}
              label={city}
              checked={selectedFilters.includes(city)}
              onChange={(e) => toggleFilter(city, e.target.checked)}
            />
          ))}
        </div>
        <button type="button" className={styles.showMore}>
          Все города
          <ChevronDownIcon className={styles.showMoreIcon} aria-hidden="true" />
        </button>
      </section>
    </aside>
  )
}
