import type { Meta, StoryObj } from '@storybook/react-vite'

import { CatalogPage } from './CatalogPage'
import { catalogPageMock } from './CatalogPage.mock'

const catalogPageViewports = {
  catalogPage: {
    name: 'CatalogPage 1440 × 1372',
    styles: {
      width: '1440px',
      height: '1372px',
    },
    type: 'desktop',
  },
} as const

const mockHeaderUser = {
  userName: 'Мария',
  avatarSrc: '/images/users/user-001/avatar.webp',
}

const meta = {
  title: 'Pages/CatalogPage',
  component: CatalogPage,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: catalogPageViewports,
    },
  },
  globals: {
    viewport: {
      value: 'catalogPage',
      isRotated: false,
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

export const ProfileMenuOpen: Story = {
  name: 'Открыто меню профиля',
  args: {
    ...catalogPageMock,

    // Переключаем Header в состояние авторизованного пользователя.
    headerUser: mockHeaderUser,

    // При открытии истории меню сразу показывается по макету.
    isProfileMenuInitiallyOpen: true,
  },
}
