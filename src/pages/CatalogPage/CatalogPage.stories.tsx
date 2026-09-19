import type { Meta, StoryObj } from '@storybook/react-vite'

import { store } from '@/store'
import { setMockUsers } from '@/store/slices/usersSlice'

import { CatalogPage } from './CatalogPage'
import { catalogPageMock } from './CatalogPage.mock'

const catalogPageViewports = {
  mobile: {
    name: 'Mobile 360 × 800',
    styles: {
      width: '360px',
      height: '800px',
    },
    type: 'mobile',
  },

  tablet: {
    name: 'Tablet 768 × 1024',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet',
  },

  catalogPage: {
    name: 'CatalogPage 1440 × 1372',
    styles: {
      width: '1440px',
      height: '1372px',
    },
    type: 'desktop',
  },
} as const

const meta = {
  title: 'Pages/CatalogPage',
  component: CatalogPage,
  loaders: [
    () => {
      store.dispatch(setMockUsers(catalogPageMock.users))
      return {}
    },
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: catalogPageViewports,
    },
  },
} satisfies Meta<typeof CatalogPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Базовое состояние',
  args: catalogPageMock,
}

export const AllSkillsMenuOpen: Story = {
  name: 'Открыто меню «Все навыки»',
  args: {
    ...catalogPageMock,

    // Открывает меню при запуске истории.
    isAllSkillsMenuInitiallyOpen: true,
  },
}

export const NotificationsMenuOpen: Story = {
  name: 'Открыты уведомления',
  args: {
    ...catalogPageMock,

    // Открывает уведомления при запуске истории.
    isNotificationsMenuInitiallyOpen: true,
  },
}

export const ProfileMenuOpen: Story = {
  name: 'Открыто меню профиля',
  args: {
    ...catalogPageMock,

    // При открытии истории меню сразу показывается по макету.
    isProfileMenuInitiallyOpen: true,
  },
}

export const Loading: Story = {
  name: 'Состояние загрузки',
  args: {
    ...catalogPageMock,
    users: [],
    usersStatus: 'loading',
    usersError: null,
    hasMockUsers: false,
  },
}

export const Error: Story = {
  name: 'Состояние ошибки',
  args: {
    ...catalogPageMock,
    users: [],
    usersStatus: 'error',
    usersError: 'Не удалось загрузить данные',
    hasMockUsers: false,
  },
}
