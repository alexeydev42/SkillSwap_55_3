import type { Meta, StoryObj } from '@storybook/react-vite'

import { FiltersSidebar } from './FiltersSidebar'

const meta = {
  title: 'Widgets/FiltersSidebar',
  component: FiltersSidebar,
  tags: ['autodocs'],
  // FiltersSidebar сам по себе не задаёт ширину — на странице он всегда
  // стоит в узкой колонке. В Storybook без обёртки он растягивается на
  // весь канвас, и внутренний justify-content: space-between в
  // FilterCategoryGroup (VERST-25) визуально "разъезжается". Ограничиваем
  // превью шириной колонки, как в макете, самого компонента не трогая.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 284 }}>
        <Story />
      </div>
    ),
  ],
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
    selectedFilters: ['Москва'],
    onChange: () => {},
  },
}
