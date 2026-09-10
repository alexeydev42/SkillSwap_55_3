import type { Meta, StoryObj } from '@storybook/react-vite'

import { UserHeaderControls } from './UserHeaderControls'

const meta = {
  title: 'Header/UserHeaderControls',
  component: UserHeaderControls,
  args: {
    userName: 'Мария',
    avatarSrc: 'https://i.pravatar.cc/48?img=1',
    notifications: [],
    hasUnreadNotifications: false,
    onNotificationsClick: () => {},
    onNotificationsMenuClose: () => {},
    onMarkAllNotificationsAsRead: () => {},
    onClearReadNotifications: () => {},
    onFavoritesClick: () => {},
  },
} satisfies Meta<typeof UserHeaderControls>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithUnreadNotification: Story = {
  args: {
    hasUnreadNotifications: true,
  },
}
