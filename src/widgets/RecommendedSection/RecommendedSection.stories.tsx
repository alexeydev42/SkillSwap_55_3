import type { Meta, StoryObj } from '@storybook/react-vite'

import { RecommendedSection } from './RecommendedSection'
import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'

const items: UserSkillsSectionItem[] = [
  {
    id: '1',
    name: 'Виктория',
    city: 'Кемерово',
    age: 30,
    avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
  {
    id: '2',
    name: 'Елизавета',
    city: 'Владивосток',
    age: 25,
    avatarUrl: 'https://randomuser.me/api/portraits/women/24.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
  {
    id: '3',
    name: 'Виктория',
    city: 'Сочи',
    age: 31,
    avatarUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
  {
    id: '4',
    name: 'Елена',
    city: 'Красноярск',
    age: 28,
    avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
  {
    id: '5',
    name: 'Константин',
    city: 'Иркутск',
    age: 36,
    avatarUrl: 'https://randomuser.me/api/portraits/men/27.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
  {
    id: '6',
    name: 'София',
    city: 'Абакан',
    age: 24,
    avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    canTeach: { label: 'Игра на барабанах', variant: 'more' },
    learnTags: [
      { label: 'Тайм менеджмент', variant: 'more' },
      { label: 'Медитация', variant: 'health' },
      { label: 'Йога', variant: 'health' },
      { label: 'Фотография', variant: 'creative' },
    ],
  },
]

const meta = {
  title: 'Widgets/RecommendedSection',
  component: RecommendedSection,
  tags: ['autodocs'],
} satisfies Meta<typeof RecommendedSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items,
    isLoading: false,
  },
}

export const Loading: Story = {
  args: {
    items,
    isLoading: true,
  },
}
