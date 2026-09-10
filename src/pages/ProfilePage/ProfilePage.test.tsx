import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import usersReducer from '@/store/slices/usersSlice'

import ProfilePage from './ProfilePage'

const localUser: User = {
  id: 'local-user-id',
  name: 'Мария',
  birthDate: '1995-10-28',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
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

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: { userId: localUser.id },
        status: 'idle' as const,
        error: null,
      },
      users: {
        mockUsers: [],
        localUser,
        status: 'success' as const,
        error: null,
      },
    },
  })

const SkillPageProbe = () => {
  const { userId } = useParams<{ userId: string }>()

  return <h1>Страница навыка пользователя {userId}</h1>
}

describe('ProfilePage', () => {
  it('открывает SkillPage текущего пользователя по пункту «Мои навыки»', async () => {
    const user = userEvent.setup()
    const testStore = createTestStore()

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
          <Routes>
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SKILL} element={<SkillPageProbe />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    await user.click(screen.getByRole('button', { name: 'Мои навыки' }))

    expect(
      screen.getByRole('heading', {
        name: `Страница навыка пользователя ${localUser.id}`,
      }),
    ).toBeInTheDocument()
  })
})
