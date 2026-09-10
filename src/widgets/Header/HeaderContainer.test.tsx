import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import usersReducer from '@/store/slices/usersSlice'

import { HeaderContainer } from './HeaderContainer'

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

describe('HeaderContainer', () => {
  it('выполняет logout и показывает гостевой Header', async () => {
    const user = userEvent.setup()
    const testStore = createTestStore()

    storageService.set(STORAGE_KEYS.AUTH_SESSION, {
      userId: localUser.id,
    })

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <HeaderContainer isProfileMenuOpen />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText(localUser.name)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Выйти из аккаунта' }))

    expect(testStore.getState().auth.session).toBeNull()
    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })
})
