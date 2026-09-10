import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilterCategoryGroup, type FilterCategoryGroupProps } from './FilterCategoryGroup'

// Обеспечивает интерактивное раскрытие категории внутри Storybook.
const FilterCategoryGroupPreview = (args: FilterCategoryGroupProps) => {
  const [isOpen, setIsOpen] = useState(args.isOpen)

  return <FilterCategoryGroup {...args} isOpen={isOpen} onOpenChange={setIsOpen} />
}

const meta = {
  title: 'Components/FilterCategoryGroup',
  component: FilterCategoryGroup,
  parameters: {
    layout: 'centered',
  },
  args: {
    category: 'Творчество и искусство',
    subcategories: [
      { id: 'drawing-illustration', name: 'Рисование и иллюстрация' },
      { id: 'photography', name: 'Фотография' },
      { id: 'video-editing', name: 'Видеомонтаж' },
      { id: 'music-sound', name: 'Музыка и звук' },
      { id: 'acting', name: 'Актёрское мастерство' },
      { id: 'creative-writing', name: 'Креативное письмо' },
      { id: 'art-therapy', name: 'Арт-терапия' },
      { id: 'decor-diy', name: 'Декор и DIY' },
    ],
    checkedSubcategoryIds: [],
    isOpen: false,
    onChange: () => {},
    onOpenChange: () => {},
  },
  render: (args) => <FilterCategoryGroupPreview {...args} />,
} satisfies Meta<typeof FilterCategoryGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Expanded: Story = {
  args: {
    isOpen: true,
  },
}
