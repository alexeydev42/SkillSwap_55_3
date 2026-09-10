import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import usersReducer from '@/store/slices/usersSlice'

import ProfilePage, { type ProfileTab } from './ProfilePage'

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

const firstFavoriteUser: User = {
  id: 'favorite-user-1',
  name: 'Анна',
  birthDate: '1997-04-12',
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
  likesCount: 20,
  createdAt: '2026-08-01T00:00:00.000Z',
}

const secondFavoriteUser: User = {
  id: 'favorite-user-2',
  name: 'Иван',
  birthDate: '1992-06-15',
  gender: 'male',
  cityId: 'saint-petersburg',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Видеомонтаж',
    categoryId: 'creativity-art',
    subcategoryId: 'video-editing',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 40,
  createdAt: '2026-08-02T00:00:00.000Z',
}

const createTestStore = (mockUsers: User[] = [], favoriteUserIds: string[] = []) =>
  configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
      users: usersReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: { userId: localUser.id },
        status: 'idle' as const,
        error: null,
      },
      favorites: {
        favoriteUserIds,
      },
      users: {
        mockUsers,
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

const renderProfilePage = ({
  initialTab = 'personal',
  mockUsers = [],
  favoriteUserIds = [],
}: {
  initialTab?: ProfileTab
  mockUsers?: User[]
  favoriteUserIds?: string[]
} = {}) => {
  const testStore = createTestStore(mockUsers, favoriteUserIds)

  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
        <Routes>
          <Route path={ROUTES.PROFILE} element={<ProfilePage initialTab={initialTab} />} />
          <Route path={ROUTES.SKILL} element={<SkillPageProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return testStore
}

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('открывает SkillPage текущего пользователя по пункту «Мои навыки»', async () => {
    const user = userEvent.setup()

    renderProfilePage()

    await user.click(
      screen.getByRole('button', {
        name: 'Мои навыки',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: `Страница навыка пользователя ${localUser.id}`,
      }),
    ).toBeInTheDocument()
  })

  it('показывает избранных пользователей в порядке favoriteUserIds', () => {
    renderProfilePage({
      initialTab: 'favorites',
      mockUsers: [firstFavoriteUser, secondFavoriteUser],
      favoriteUserIds: [secondFavoriteUser.id, firstFavoriteUser.id],
    })

    const favoriteNames = screen.getAllByText(/^(Иван|Анна)$/).map((element) => element.textContent)

    expect(favoriteNames).toEqual(['Иван', 'Анна'])

    // 40 базовых лайков и один текущий Favorite.
    expect(screen.getByText('41')).toBeInTheDocument()
  })

  it('удаляет Favorite той же action и сразу убирает карточку', async () => {
    const user = userEvent.setup()

    const testStore = renderProfilePage({
      initialTab: 'favorites',
      mockUsers: [firstFavoriteUser, secondFavoriteUser],
      favoriteUserIds: [secondFavoriteUser.id, firstFavoriteUser.id],
    })

    const favoriteButtons = screen.getAllByRole('button', {
      name: 'Убрать из избранного',
    })

    await user.click(favoriteButtons[0])

    expect(screen.queryByText(secondFavoriteUser.name)).not.toBeInTheDocument()
    expect(screen.getByText(firstFavoriteUser.name)).toBeInTheDocument()

    expect(testStore.getState().favorites.favoriteUserIds).toEqual([firstFavoriteUser.id])

    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) ?? '[]')).toEqual([
      firstFavoriteUser.id,
    ])
  })

  it('показывает пустое состояние при отсутствии Favorites', () => {
    renderProfilePage({
      initialTab: 'favorites',
    })

    expect(screen.getByText('В избранном пока ничего нет')).toBeInTheDocument()
  })
})
