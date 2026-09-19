import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import BookIcon from '../../shared/assets/icons/icon-book.svg?react'
import BriefcaseIcon from '../../shared/assets/icons/icon-briefcase.svg?react'
import GlobalIcon from '../../shared/assets/icons/icon-global.svg?react'
import HomeIcon from '../../shared/assets/icons/icon-home.svg?react'
import LifestyleIcon from '../../shared/assets/icons/icon-lifestyle.svg?react'
import PaletteIcon from '../../shared/assets/icons/icon-palette.svg?react'

import { CategoryItem } from './CategoryItem'
import type { CategoryItemVariant } from './CategoryItem'
import { categories as skillCategories } from '@/shared/config'
import type { Subcategory } from '@/shared/types'

const meta: Meta<typeof CategoryItem> = {
  title: 'Widgets/CategoryItem',
  component: CategoryItem,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof CategoryItem>

const getSubcategories = (categoryId: string): Subcategory[] =>
  skillCategories.find((category) => category.id === categoryId)?.subcategories ?? []

const categories: {
  icon: ReactNode
  title: string
  subcategories: Subcategory[]
  variant: CategoryItemVariant
}[] = [
  {
    icon: <BriefcaseIcon />,
    title: 'Бизнес и карьера',
    variant: 'business',
    subcategories: getSubcategories('business-career'),
  },
  {
    icon: <PaletteIcon />,
    title: 'Творчество и искусство',
    variant: 'creative',
    subcategories: getSubcategories('creativity-art'),
  },
  {
    icon: <GlobalIcon />,
    title: 'Иностранные языки',
    variant: 'languages',
    subcategories: getSubcategories('foreign-languages'),
  },
  {
    icon: <BookIcon />,
    title: 'Образование и развитие',
    variant: 'education',
    subcategories: getSubcategories('education-development'),
  },
  {
    icon: <HomeIcon />,
    title: 'Дом и уют',
    variant: 'home',
    subcategories: getSubcategories('home-comfort'),
  },
  {
    icon: <LifestyleIcon />,
    title: 'Здоровье и лайфстайл',
    variant: 'health',
    subcategories: getSubcategories('health-lifestyle'),
  },
]
export const Default: Story = {
  args: categories[0],
}

export const AllCategories: Story = {
  render: () => (
    <>
      {/*
        Эта раскладка используется только для визуальной демонстрации в Storybook.
        CategoryItem отвечает только за отображение одной категории.
        Расположение нескольких CategoryItem относится к ответственности родительского компонента.
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 488px)',
          columnGap: '40px',
          rowGap: '40px',
        }}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.title}
            icon={category.icon}
            title={category.title}
            subcategories={category.subcategories}
            variant={category.variant}
          />
        ))}
      </div>
    </>
  ),
}
