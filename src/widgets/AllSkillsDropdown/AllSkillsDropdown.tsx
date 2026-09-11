import type { ReactNode } from 'react'

import BookIcon from '@/shared/assets/icons/icon-book.svg?react'
import BriefcaseIcon from '@/shared/assets/icons/icon-briefcase.svg?react'
import GlobalIcon from '@/shared/assets/icons/icon-global.svg?react'
import HomeIcon from '@/shared/assets/icons/icon-home.svg?react'
import LifestyleIcon from '@/shared/assets/icons/icon-lifestyle.svg?react'
import PaletteIcon from '@/shared/assets/icons/icon-palette.svg?react'
import { categories } from '@/shared/config'
import { DropdownContainer } from '@/shared/ui/DropdownContainer'
import { CategoryItem, type CategoryItemVariant } from '@/widgets/CategoryItem'

import styles from './AllSkillsDropdown.module.css'

interface CategoryPresentation {
  id: string
  icon: ReactNode
  variant: CategoryItemVariant
}

// Хранит только оформление и порядок категорий в dropdown.
const CATEGORY_PRESENTATION: CategoryPresentation[] = [
  {
    id: 'business-career',
    icon: <BriefcaseIcon />,
    variant: 'business',
  },
  {
    id: 'creativity-art',
    icon: <PaletteIcon />,
    variant: 'creative',
  },
  {
    id: 'foreign-languages',
    icon: <GlobalIcon />,
    variant: 'languages',
  },
  {
    id: 'education-development',
    icon: <BookIcon />,
    variant: 'education',
  },
  {
    id: 'home-comfort',
    icon: <HomeIcon />,
    variant: 'home',
  },
  {
    id: 'health-lifestyle',
    icon: <LifestyleIcon />,
    variant: 'health',
  },
]

// Дополняет UI-настройки данными из единого справочника.
const categoryItems = CATEGORY_PRESENTATION.flatMap(({ id, icon, variant }) => {
  const category = categories.find((categoryItem) => categoryItem.id === id)

  if (!category) {
    return []
  }

  return [
    {
      id,
      icon,
      variant,
      title: category.name,
      subcategories: category.subcategories.map(({ name }) => name),
    },
  ]
})

// Распределяет категории по двум колонкам в порядке макета.
const categoryColumns = [
  categoryItems.filter((_, index) => index % 2 === 0),
  categoryItems.filter((_, index) => index % 2 !== 0),
]

export const AllSkillsDropdown = () => {
  return (
    <DropdownContainer className={styles.dropdown}>
      <div className={styles.grid}>
        {categoryColumns.map((column, columnIndex) => (
          <div className={styles.column} key={columnIndex}>
            {column.map((category) => (
              <CategoryItem
                key={category.id}
                icon={category.icon}
                title={category.title}
                subcategories={category.subcategories}
                variant={category.variant}
              />
            ))}
          </div>
        ))}
      </div>
    </DropdownContainer>
  )
}
