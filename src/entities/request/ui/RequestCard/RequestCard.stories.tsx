import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/shared/ui/Button'

import { RequestCard } from './RequestCard'

const LampIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeDasharray="2 2" />
    <path
      d="M9 16h6M10 19h4M12 6a4 4 0 0 0-2 7.465V15h4v-1.535A4 4 0 0 0 12 6Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const meta = {
  title: 'Entities/Request/RequestCard',
  component: RequestCard,
  tags: ['autodocs'],
} satisfies Meta<typeof RequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const New: Story = {
  args: {
    icon: <LampIcon />,
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    actions: <Button size="sm">Перейти</Button>,
  },
}

export const Viewed: Story = {
  args: {
    icon: <LampIcon />,
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
  },
}

export const Moderation: Story = {
  args: {
    icon: <LampIcon />,
    title: 'Заявка на модерацию',
    description: 'Примите решение по заявке',
    date: 'сегодня',
    actions: (
      <>
        <Button size="sm">Принять</Button>
        <Button size="sm" variant="secondary">
          Отклонить
        </Button>
      </>
    ),
  },
}
