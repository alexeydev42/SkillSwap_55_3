import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/shared/ui/Button'
import iconIdea from '@/shared/assets/icons/icon-idea.svg'

import { RequestCard } from './RequestCard'

const IdeaIcon = () => <img src={iconIdea} alt="" />

const meta = {
  title: 'Entities/Request/RequestCard',
  component: RequestCard,
  tags: ['autodocs'],
} satisfies Meta<typeof RequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const New: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    actions: <Button size="sm">Перейти</Button>,
  },
}

export const Viewed: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
  },
}

export const Moderation: Story = {
  args: {
    icon: <IdeaIcon />,
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
