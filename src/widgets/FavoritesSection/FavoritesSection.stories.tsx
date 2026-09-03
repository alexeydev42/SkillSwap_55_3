import type { Meta, StoryObj } from '@storybook/react-vite'

import { FavoritesSection } from './FavoritesSection'
import { UserSkillCardData } from '../UserSkillCard/UserSkillCard'

const meta: Meta<typeof FavoritesSection> = {
  title: 'Widgets/FavoritesSection',
  component: FavoritesSection,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '1020px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof FavoritesSection>

export const Empty: Story = {
  args: {
    favoriteUsers: [],
  },
}

const users: UserSkillCardData[] = [
  {
      name: 'Анна',
      city: 'Москва',
      age: 29,
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      canTeach: { label: 'Французский язык', variant: 'languages' },
      learnTags: [
        { label: 'Фотография', variant: 'creative' },
        { label: 'Йога', variant: 'health' },
      ],
    },
  {
      name: 'Дмитрий',
      city: 'Казань',
      age: 41,
      avatarUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
      canTeach: { label: 'Программирование', variant: 'education' },
      learnTags: [
        { label: 'Испанский язык', variant: 'languages' },
        { label: 'Публичные выступления', variant: 'more' },
      ],
    },
  {
      name: 'Екатерина',
      city: 'Новосибирск',
      age: 26,
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      canTeach: { label: 'Графический дизайн', variant: 'creative' },
      learnTags: [
        { label: 'Финансовая грамотность', variant: 'more' },
        { label: 'Бег', variant: 'health' },
      ],
    },
  {
      name: 'Сергей',
      city: 'Екатеринбург',
      age: 37,
      avatarUrl: 'https://randomuser.me/api/portraits/men/71.jpg',
      canTeach: { label: 'Шахматы', variant: 'more' },
      learnTags: [
        { label: 'Веб-разработка', variant: 'business' },
        { label: 'Английский язык', variant: 'languages' },
      ],
    },
  {
      name: 'Мария',
      city: 'Нижний Новгород',
      age: 32,
      avatarUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
      canTeach: { label: 'Маркетинг', variant: 'business' },
      learnTags: [
        { label: 'Медитация', variant: 'health' },
        { label: 'UI/UX дизайн', variant: 'creative' },
      ],
    },
]

export const Filled: Story = {
  args: {
    favoriteUsers: users,
  },
}

// [
//       {
//         name: 'Иван',
//         city: 'Санкт-Петербург',
//         age: 34,
//         avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
//         canTeach: {
//           label: 'Английский язык',
//           variant: 'languages',
//         },
//         learnTags: [
//           {
//             label: 'Тайм-менеджмент',
//             variant: 'more',
//           },
//           {
//             label: 'Медитация',
//             variant: 'more',
//           },
//         ],
//       },
//       {
//         name: 'Мария',
//         city: 'Москва',
//         age: 28,
//         avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
//         canTeach: {
//           label: 'Дизайн',
//           variant: 'creative',
//         },
//         learnTags: [
//           {
//             label: 'React',
//             variant: 'more',
//           },
//           {
//             label: 'TypeScript',
//             variant: 'more',
//           },
//         ],
//       },
//     ],
