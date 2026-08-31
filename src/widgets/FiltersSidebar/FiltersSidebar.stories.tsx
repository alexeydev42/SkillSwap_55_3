import type { Meta, StoryObj } from '@storybook/react-vite'

import { FiltersSidebar } from './FiltersSidebar'

const meta = {
  title: 'Widgets/FiltersSidebar',
  component: FiltersSidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof FiltersSidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categories: [
      { category: 'Бизнес и карьера' },
      {
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
      },
      { category: 'Иностранные языки' },
      { category: 'Образование и развитие' },
      { category: 'Здоровье и лайфстайл' },
      { category: 'Дом и уют' },
    ],
    cities: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'],
  },
}
