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
 * Радиогруппы сделаны управляемыми (useState + checked/onChange), а не
 * через defaultChecked — так исходное выделение всегда предсказуемо.
 */
export function FiltersSidebar({ categories, cities, className }: FiltersSidebarProps) {
  const [offerType, setOfferType] = useState(OFFER_TYPES[1])
  const [gender, setGender] = useState(GENDERS[0])

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.group}>
        {OFFER_TYPES.map((label) => (
          <RadioButton
            key={label}
            name="offerType"
            label={label}
            checked={offerType === label}
            onChange={() => setOfferType(label)}
          />
        ))}
      </div>

      <section className={styles.section}>
        <h3 className={styles.heading}>Навыки</h3>
        <div className={styles.categories}>
          {categories.map(({ category, subcategories }) =>
            subcategories && subcategories.length > 0 ? (
              <FilterCategoryGroup key={category} category={category} subcategories={subcategories} />
            ) : (
              <Checkbox key={category} label={category} />
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
              onChange={() => setGender(label)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Город</h3>
        <div className={styles.group}>
          {cities.map((city) => (
            <Checkbox key={city} label={city} />
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
