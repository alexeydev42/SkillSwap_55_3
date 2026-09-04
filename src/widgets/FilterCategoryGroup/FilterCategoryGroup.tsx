import { useState } from 'react'
import styles from './FilterCategoryGroup.module.css'
import { Checkbox } from '@/shared/ui/Checkbox'
import chevronDown from '../../shared/assets/icons/icon-chevron-down.svg'

export interface FilterCategoryGroupProps {
  category: string
  subcategories: string[]
  checkedSubcategories: string[]
  onChange: (subcategories: string[]) => void
}

export const FilterCategoryGroup = ({
  category,
  subcategories,
  checkedSubcategories,
  onChange,
}: FilterCategoryGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Вычисляем состояние родительского чекбокса
  const checkedCount = checkedSubcategories.length
  const isAllChecked = subcategories.length > 0 && checkedCount === subcategories.length
  const isIndeterminate = checkedCount > 0 && !isAllChecked

  // Клик по дочернему чекбоксу (e.target.checked - так как VERST-05 пробрасывает нативное событие)
  const handleSubcategoryChange = (subcategory: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange([...checkedSubcategories, subcategory])
    } else {
      onChange(checkedSubcategories.filter((item) => item !== subcategory))
    }
  }

  // Клик по родительскому чекбоксу (выделяет/снимает все разом)
  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCategories = new Set([...checkedSubcategories, ...subcategories])
      onChange(Array.from(allCategories))
    } else {
      onChange(checkedSubcategories.filter((item) => !subcategories.includes(item)))
    }
  }

  return (
    <section className={styles['filter-category-group__sidebar']}>
      <header className={styles['filter-category-group__header']}>
        <div
          className={styles['filter-category-group__header-title']}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div
            className={styles['filter-category-group__header-checkbox']}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              label=""
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleParentChange}
            />          </div>

          <p className={styles['filter-category-group__header-text']}>{category}</p>

          <span
            className={`${styles['filter-category-group__header-icon']} ${isOpen ? styles['is-open'] : ''}`}
          >
            <img src={chevronDown} alt="Открыть/Закрыть" />
          </span>
        </div>
      </header>

      {isOpen && (
        <div className={styles['filter-category-group__subcategories-wrapper']}>
          <section className={styles['filter-category-group__subcategories-list']}>
            {subcategories.map((subcategory) => (
              <Checkbox
                key={subcategory}
                label={subcategory}
                checked={checkedSubcategories.includes(subcategory)}
                onChange={(e) => handleSubcategoryChange(subcategory, e)}
                className={styles['filter-category-group__subcategories-item']}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  )
}
