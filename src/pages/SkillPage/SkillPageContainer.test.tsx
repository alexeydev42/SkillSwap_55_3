import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ROUTES } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { store } from '@/store'
import { clearAuthSession, setAuthAccount, setAuthSession } from '@/store/slices/authSlice'
import { addFavorite, clearFavorites } from '@/store/slices/favoritesSlice'
import { clearRequests } from '@/store/slices/requestsSlice'
import {
  clearLocalUser,
  setLocalUser,
  setMockUsers,
  setUsersStatus,
} from '@/store/slices/usersSlice'

import { SkillPageContainer } from './SkillPageContainer'

vi.mock('./SkillPage', () => ({
  SkillPage: ({
    isOwnSkill,
    isFavorite,
    isFavoriteDisabled,
    onFavoriteClick,
    skills,
  }: {
    isOwnSkill: boolean
    isFavorite: boolean
    isFavoriteDisabled: boolean
    onFavoriteClick: () => void
    skills: {
      wantsToLearn: Array<{
        label: string
      }>
    }
  }) => (
    <div>
      <span>Страница навыка пользователя</span>

      <output data-testid="is-own-skill">{String(isOwnSkill)}</output>

      <output data-testid="learning-skills">
        {skills.wantsToLearn.map((skill) => skill.label).join(', ')}
      </output>

      {!isOwnSkill && (
        <button type="button" disabled={isFavoriteDisabled} onClick={onFavoriteClick}>
          {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        </button>
      )}
    </div>
  ),
}))

const localUser: User = {
  id: 'local-user-id',
  name: 'Алексей',
  birthDate: '1993-04-15',
  gender: 'preferNotToSay',
  cityId: 'saint-petersburg',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Видеомонтаж',
    categoryId: 'creativity-art',
    subcategoryId: 'video-editing',
    description: 'Научу основам видеомонтажа',
    imageUrls: ['data:image/png;base64,dGVzdA=='],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 0,
  createdAt: '2026-09-09T12:00:00.000Z',
}

const favoriteUser: User = {
  id: 'favorite-user-id',
  name: 'Мария',
  birthDate: '1995-06-20',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Фотография',
    categoryId: 'creativity-art',
    subcategoryId: 'photography',
    description: 'Научу основам фотографии',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 10,
  createdAt: '2026-08-01T12:00:00.000Z',
}

const LocationStateProbe = () => {
  const location = useLocation()

  return <output data-testid="location-state">{JSON.stringify(location.state)}</output>
}

const renderSkillPageContainer = (registrationCompleted: boolean, viewedUserId = localUser.id) =>
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/skill/${viewedUserId}`,
            state: registrationCompleted ? { registrationCompleted: true } : null,
          },
        ]}
      >
        <LocationStateProbe />

        <Routes>
          <Route path={ROUTES.SKILL} element={<SkillPageContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('SkillPageContainer', () => {
  beforeEach(() => {
    window.localStorage.clear()

    store.dispatch(clearLocalUser())
    store.dispatch(clearAuthSession())
    store.dispatch(clearFavorites())
    store.dispatch(clearRequests())
    store.dispatch(setMockUsers([favoriteUser]))
    store.dispatch(setUsersStatus('success'))

    store.dispatch(setLocalUser(localUser))

    store.dispatch(
      setAuthAccount({
        userId: localUser.id,
        email: 'user@example.com',
        password: 'Password1!',
      }),
    )

    store.dispatch(
      setAuthSession({
        userId: localUser.id,
      }),
    )
  })

  it('показывает модалку регистрации и закрывает её, сохраняя страницу навыка', async () => {
    const user = userEvent.setup()

    renderSkillPageContainer(true)

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Теперь вы можете предложить обмен')).toBeInTheDocument()

    expect(screen.getByTestId('location-state')).toHaveTextContent('{"registrationCompleted":true}')

    await user.click(
      screen.getByRole('button', {
        name: 'Готово',
      }),
    )

    expect(
      screen.queryByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(screen.getByTestId('location-state')).toHaveTextContent('null')
  })

  it('не показывает модалку при обычном открытии страницы навыка', () => {
    renderSkillPageContainer(false)

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(screen.getByTestId('is-own-skill')).toHaveTextContent('true')

    expect(
      screen.queryByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).not.toBeInTheDocument()
  })

  it('обновляет «Хочу научиться» собственной SkillPage после изменения Favorites', () => {
    renderSkillPageContainer(false)

    expect(screen.getByTestId('learning-skills')).toHaveTextContent('Английский')

    expect(screen.getByTestId('learning-skills')).not.toHaveTextContent('Фотография')

    act(() => {
      store.dispatch(addFavorite(favoriteUser.id))
    })

    expect(store.getState().favorites.favoriteUserIds).toContain(favoriteUser.id)

    expect(screen.getByTestId('learning-skills')).toHaveTextContent('Фотография')
  })

  it('переключает Favorite чужой SkillPage через общий state', async () => {
    const user = userEvent.setup()

    renderSkillPageContainer(false, favoriteUser.id)

    const addButton = screen.getByRole('button', {
      name: 'Добавить в избранное',
    })

    await user.click(addButton)

    expect(store.getState().favorites.favoriteUserIds).toEqual([favoriteUser.id])

    const removeButton = screen.getByRole('button', {
      name: 'Убрать из избранного',
    })

    await user.click(removeButton)

    expect(store.getState().favorites.favoriteUserIds).toEqual([])

    expect(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    ).toBeInTheDocument()
  })

  it('блокирует Favorites без сессии и включает после её восстановления', async () => {
    const user = userEvent.setup()

    // Account остаётся сохранённым, но активной сессии нет.
    store.dispatch(clearAuthSession())

    renderSkillPageContainer(false, favoriteUser.id)

    const favoriteButton = screen.getByRole('button', {
      name: 'Добавить в избранное',
    })

    expect(favoriteButton).toBeDisabled()

    await user.click(favoriteButton)

    expect(store.getState().favorites.favoriteUserIds).toEqual([])

    // Восстановление сессии сразу разблокирует действие.
    act(() => {
      store.dispatch(
        setAuthSession({
          userId: localUser.id,
        }),
      )
    })

    expect(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    ).toBeEnabled()

    await user.click(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    )

    expect(store.getState().favorites.favoriteUserIds).toEqual([favoriteUser.id])
  })
})
