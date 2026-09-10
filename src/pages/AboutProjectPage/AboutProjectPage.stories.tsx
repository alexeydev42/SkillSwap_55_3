import type { Meta, StoryObj } from '@storybook/react-vite'

import type { User } from '@/shared/types'
import { store } from '@/store'
import { clearAuthSession, setAuthSession } from '@/store/slices/authSlice'
import { setLocalUser } from '@/store/slices/usersSlice'

import { AboutProjectPage } from './AboutProjectPage'

const localUser: User = {
  id: 'local-user-id',
  name: 'Мария',
  birthDate: '1995-10-28',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: '/images/users/user-001/avatar.webp',
  description: '',
  offeredSkill: {
    title: 'Фотография',
    categoryId: 'creativity-art',
    subcategoryId: 'photography',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 0,
  createdAt: '2026-09-10T00:00:00.000Z',
}

const meta = {
  title: 'Pages/AboutProjectPage',
  component: AboutProjectPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AboutProjectPage>

export default meta

type Story = StoryObj<typeof meta>

export const Guest: Story = {
  name: 'Не авторизован',
  loaders: [
    () => {
      store.dispatch(clearAuthSession())
      return {}
    },
  ],
}

export const Authenticated: Story = {
  name: 'Авторизован',
  loaders: [
    () => {
      store.dispatch(setLocalUser(localUser))
      store.dispatch(setAuthSession({ userId: localUser.id }))
      return {}
    },
  ],
}
