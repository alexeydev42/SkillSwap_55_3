import { useState } from 'react'
import styles from './FilterCategoryGroup.module.css'
import { Checkbox } from '@/shared/ui/Checkbox'
import chevronDown from '../../shared/assets/icons/icon-chevron-down.svg'
import chevronUp from '../../shared/assets/icons/icon-chevron-up.svg'

interface FilterCategoryGroupProps {
  category: string
  subcategories: string[]
}

export const FilterCategoryGroup = ({ category, subcategories }: FilterCategoryGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className={styles['filter-category-group__sidebar']}>
      <header className={styles['filter-category-group__header']}>
        <div
          className={styles['filter-category-group__header-title']}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p className={styles['filter-category-group__header-text']}>{category}</p>
          <span className={styles['filter-category-group__header-close-icon']}>
            <img src={isOpen ? chevronUp : chevronDown} alt="" />
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
                className={styles['filter-category-group__subcategories-item']}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  )
}
