import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './CategoryItem.module.css'

export type CategoryItemVariant =
  'business' | 'creative' | 'languages' | 'education' | 'home' | 'health'

type SubcategoryItem = {
  id: string
  name: string
}

type CategoryItemProps = {
  icon: ReactNode
  title: string
  subcategories: SubcategoryItem[]
  variant: CategoryItemVariant
  onSubcategoryClick?: (subcategoryId: string) => void
}

export const CategoryItem = ({
  icon,
  title,
  subcategories,
  variant,
  onSubcategoryClick,
}: CategoryItemProps) => {
  return (
    <div className={styles.item}>
      <div className={clsx(styles.icon, styles[`icon-${variant}`])} aria-hidden="true">
        {icon}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <ul className={styles.subcategories}>
          {subcategories.map((subcategory) => (
            <li className={styles.subcategory} key={subcategory.id}>
              <button
                type="button"
                className={styles.subcategoryButton}
                onClick={() => onSubcategoryClick?.(subcategory.id)}
              >
                {subcategory.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
