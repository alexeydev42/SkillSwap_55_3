import type { Meta, StoryObj } from '@storybook/react-vite'

import type { User } from '@/shared/types'
import type { NotificationView } from '@/store/slices/notificationsSlice'

import { NotificationsDropdown } from './NotificationsDropdown'

const recipient: User = {
  id: 'notification-recipient',
  name: 'Николай',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Игра на гитаре',
    categoryId: 'creativity-art',
    subcategoryId: 'music',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-09-01T12:00:00.000Z',
}

const notifications: NotificationView[] = [
  {
    requestId: 'request-new',
    isRead: false,
    createdAt: new Date().toISOString(),
    toUser: recipient,
  },
  {
    requestId: 'request-read',
    isRead: true,
    createdAt: '2026-09-08T12:00:00.000Z',
    toUser: {
      ...recipient,
      id: 'notification-recipient-read',
      name: 'Татьяна',
      offeredSkill: {
        ...recipient.offeredSkill,
        title: 'Английский язык',
      },
    },
  },
]

const meta = {
  title: 'Widgets/Header/NotificationsDropdown',
  component: NotificationsDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    notifications,
    onMarkAllAsRead: () => {},
    onClearReadNotifications: () => {},
  },
} satisfies Meta<typeof NotificationsDropdown>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    notifications: [],
  },
}
