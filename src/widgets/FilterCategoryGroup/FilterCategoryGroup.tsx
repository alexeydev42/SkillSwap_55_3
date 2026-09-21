import type { ChangeEvent } from 'react'
import clsx from 'clsx'

import type { Subcategory } from '@/shared/types'
import { Checkbox } from '@/shared/ui/Checkbox'
import ChevronDownIcon from '@/shared/assets/icons/icon-chevron-down.svg?react'

import styles from './FilterCategoryGroup.module.css'

export interface FilterCategoryGroupProps {
  category: string
  subcategories: Subcategory[]
  checkedSubcategoryIds: string[]
  isOpen: boolean
  onChange: (subcategoryIds: string[]) => void
  onOpenChange: (isOpen: boolean) => void
}

export const FilterCategoryGroup = ({
  category,
  subcategories,
  checkedSubcategoryIds,
  isOpen,
  onChange,
  onOpenChange,
}: FilterCategoryGroupProps) => {
  // Определяет состояние родительского чекбокса.
  const checkedCount = checkedSubcategoryIds.length
  const isAllChecked = subcategories.length > 0 && checkedCount === subcategories.length
  const isIndeterminate = checkedCount > 0 && !isAllChecked

  // Добавляет или удаляет идентификатор выбранной подкатегории.
  const handleSubcategoryChange = (subcategoryId: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChange([...checkedSubcategoryIds, subcategoryId])
      return
    }

    onChange(checkedSubcategoryIds.filter((id) => id !== subcategoryId))
  }

  // Выбирает или сбрасывает все подкатегории текущей категории.
  const handleParentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChange(subcategories.map(({ id }) => id))
      return
    }

    onChange([])
  }

  return (
    <section className={styles['filter-category-group__sidebar']}>
      <header className={styles['filter-category-group__header']}>
        <div className={styles['filter-category-group__header-checkbox']}>
          <Checkbox
            label=""
            aria-label={`Выбрать все навыки категории ${category}`}
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={handleParentChange}
          />
        </div>

        <button
          type="button"
          className={styles['filter-category-group__header-title']}
          onClick={() => onOpenChange(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className={styles['filter-category-group__header-text']}>{category}</span>

          <span
            className={clsx(
              styles['filter-category-group__header-icon'],
              isOpen && styles['is-open'],
            )}
          >
            <ChevronDownIcon aria-hidden="true" />
          </span>
        </button>
      </header>

      {isOpen && (
        <div className={styles['filter-category-group__subcategories-wrapper']}>
          <section className={styles['filter-category-group__subcategories-list']}>
            {subcategories.map(({ id, name }) => (
              <Checkbox
                key={id}
                label={name}
                checked={checkedSubcategoryIds.includes(id)}
                onChange={(event) => handleSubcategoryChange(id, event)}
                className={styles['filter-category-group__subcategories-item']}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  )
}
