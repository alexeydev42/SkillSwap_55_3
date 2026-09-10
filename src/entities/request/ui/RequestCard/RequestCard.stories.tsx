import type { Meta, StoryObj } from '@storybook/react-vite'

import IdeaIcon from '@/shared/assets/icons/icon-idea.svg?react'
import { Button } from '@/shared/ui/Button'

import { RequestCard } from './RequestCard'

const meta = {
  title: 'Entities/Request/RequestCard',
  component: RequestCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '436px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const WithAction: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Николай предложил вам обмен',
    description: 'Перейдите в профиль, чтобы посмотреть предложение',
    date: 'сегодня',
    actions: <Button>Перейти</Button>,
  },
}

export const WithoutAction: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Вы предложили обмен пользователю Игорь',
    description: 'Договоритесь о времени и месте встречи',
    date: '23 мая',
  },
}
