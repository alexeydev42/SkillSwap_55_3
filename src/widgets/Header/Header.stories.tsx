import type { Meta, StoryObj } from '@storybook/react-vite'

import { Header } from './Header'

const meta = {
  title: 'Widgets/Header',
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

const MOCK_USER = {
  userName: 'Мария',
  avatarSrc: 'https://i.pravatar.cc/48?img=1',
}

export const Guest: Story = {
  name: 'Не авторизован',
  args: {
    isAuthenticated: false,
    onLogin: () => {},
    onRegister: () => {},
    onToggleTheme: () => {},
  },
}

export const Authenticated: Story = {
  name: 'Авторизован',
  args: {
    isAuthenticated: true,
    user: MOCK_USER,
    notifications: [],
    hasUnreadNotifications: false,
    onToggleTheme: () => {},
    onNotificationsClick: () => {},
    onNotificationsMenuClose: () => {},
    onMarkAllNotificationsAsRead: () => {},
    onClearReadNotifications: () => {},
    onFavoritesClick: () => {},
  },
}

export const AuthenticatedWithUnreadNotification: Story = {
  name: 'С новым уведомлением',
  args: {
    isAuthenticated: true,
    user: MOCK_USER,
    notifications: [],
    hasUnreadNotifications: true,
    onToggleTheme: () => {},
    onNotificationsClick: () => {},
    onNotificationsMenuClose: () => {},
    onMarkAllNotificationsAsRead: () => {},
    onClearReadNotifications: () => {},
    onFavoritesClick: () => {},
  },
}
