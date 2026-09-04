import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilterCategoryGroup } from './FilterCategoryGroup'

const meta: Meta<typeof FilterCategoryGroup> = {
  title: 'Components/FilterCategoryGroup',
  component: FilterCategoryGroup,
  parameters: {
    layout: 'centered',
  },
  args: {
    category: 'Творчество и искусство',
    subcategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актёрское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
    checkedSubcategories: [],
    onChange: () => {},
  },
}

export default meta

type Story = StoryObj<typeof FilterCategoryGroup>

export const Skills: Story = {}

export const Cities: Story = {
  args: {
    category: 'Города',
    subcategories: [
      'Москва',
      'Санкт-Петербург',
      'Казань',
      'Уфа',
      'Воронеж',
      'Вологда',
      'Петропавловск-Камчатский',
    ],
  },
}
