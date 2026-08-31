import { useState } from 'react'
import styles from './FilterCategoryGroup.module.css'
import { Checkbox } from '@/shared/ui/Checkbox'
import chevronDown from '../../shared/assets/icons/icon-chevron-down.svg'

interface FilterCategoryGroupProps {
  category: string
  subcategories: string[]
}

export const FilterCategoryGroup = ({ category, subcategories }: FilterCategoryGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Храним состояние каждой подкатегории
  const [checkedSubcategories, setCheckedSubcategories] = useState<Record<string, boolean>>({})

  // Вычисляем состояние родительского чекбокса
  const checkedCount = Object.values(checkedSubcategories).filter(Boolean).length
  const isAllChecked = subcategories.length > 0 && checkedCount === subcategories.length
  const isIndeterminate = checkedCount > 0 && !isAllChecked

  // Клик по дочернему чекбоксу (e.target.checked - так как VERST-05 пробрасывает нативное событие)
  const handleSubcategoryChange = (subcategory: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedSubcategories((prev) => ({
      ...prev,
      [subcategory]: e.target.checked,
    }))
  }

  // Клик по родительскому чекбоксу (выделяет/снимает все разом)
  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStates: Record<string, boolean> = {}
    subcategories.forEach((sub) => {
      newStates[sub] = e.target.checked
    })
    setCheckedSubcategories(newStates)
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
            />
          </div>

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
                checked={!!checkedSubcategories[subcategory]}
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
