import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, SwapRequest, User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import requestsReducer from '@/store/slices/requestsSlice'
import usersReducer from '@/store/slices/usersSlice'

import { SkillPageContainer } from './SkillPageContainer'

vi.mock('./SkillPage', () => ({
  SkillPage: ({
    onOffer,
    isOfferDisabled,
    offerText,
    requestError,
    isOwnSkill,
  }: {
    onOffer: () => void
    isOfferDisabled: boolean
    offerText: string
    requestError: string | null
    isOwnSkill: boolean
  }) => (
    <div>
      <output data-testid="is-own-skill">{String(isOwnSkill)}</output>
      <button type="button" onClick={onOffer} disabled={isOfferDisabled}>
        {offerText}
      </button>

      {requestError && <p role="alert">{requestError}</p>}
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
    imageUrls: [],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 0,
  createdAt: '2026-09-09T12:00:00.000Z',
}

const targetUser: User = {
  id: 'target-user-id',
  name: 'Иван',
  birthDate: '1990-01-10',
  gender: 'male',
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
  learningSubcategoryIds: ['english'],
  likesCount: 10,
  createdAt: '2026-08-01T12:00:00.000Z',
}

const account: AuthAccount = {
  userId: localUser.id,
  email: 'user@example.com',
  password: 'Password1!',
}

const existingRequest: SwapRequest = {
  id: 'existing-request-id',
  fromUserId: localUser.id,
  toUserId: targetUser.id,
  createdAt: '2026-09-10T12:00:00.000Z',
}

const createTestStore = ({
  isAuthenticated = true,
  requests = [],
}: {
  isAuthenticated?: boolean
  requests?: SwapRequest[]
} = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      users: usersReducer,
    },
    preloadedState: {
      auth: {
        account: isAuthenticated ? account : null,
        session: isAuthenticated ? { userId: localUser.id } : null,
        status: 'idle' as const,
        error: null,
      },
      favorites: {
        favoriteUserIds: [],
      },
      requests: {
        items: requests,
      },
      users: {
        mockUsers: [targetUser],
        localUser,
        status: 'success' as const,
        error: null,
      },
    },
  })

const LoginProbe = () => {
  const location = useLocation()

  return (
    <>
      <div>Страница входа</div>
      <output data-testid="login-state">{JSON.stringify(location.state)}</output>
    </>
  )
}

const renderSkillPage = ({
  viewedUserId = targetUser.id,
  isAuthenticated = true,
  requests = [],
}: {
  viewedUserId?: string
  isAuthenticated?: boolean
  requests?: SwapRequest[]
} = {}) => {
  const testStore = createTestStore({
    isAuthenticated,
    requests,
  })

  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[ROUTES.SKILL.replace(':userId', viewedUserId)]}>
        <Routes>
          <Route path={ROUTES.SKILL} element={<SkillPageContainer />} />
          <Route path={ROUTES.LOGIN} element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return testStore
}

describe('SkillPage — предложение обмена', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('перенаправляет гостя на login с текущей SkillPage как destination', async () => {
    const user = userEvent.setup()

    const testStore = renderSkillPage({
      isAuthenticated: false,
    })

    expect(screen.getByTestId('is-own-skill')).toHaveTextContent('false')

    await user.click(
      screen.getByRole('button', {
        name: 'Предложить обмен',
      }),
    )

    expect(screen.getByText('Страница входа')).toBeInTheDocument()

    expect(screen.getByTestId('login-state')).toHaveTextContent(
      JSON.stringify({
        destination: `/skill/${targetUser.id}`,
      }),
    )

    expect(testStore.getState().requests.items).toEqual([])
  })

  it('создаёт request и показывает success modal', async () => {
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-09-10T15:30:00.000Z')

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001',
    )

    const user = userEvent.setup()

    const testStore = renderSkillPage()

    await user.click(
      screen.getByRole('button', {
        name: 'Предложить обмен',
      }),
    )

    const expectedRequest: SwapRequest = {
      id: '00000000-0000-4000-8000-000000000001',
      fromUserId: localUser.id,
      toUserId: targetUser.id,
      createdAt: '2026-09-10T15:30:00.000Z',
    }

    expect(testStore.getState().requests.items).toEqual([expectedRequest])

    expect(storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS)).toEqual([expectedRequest])

    expect(
      screen.getByRole('heading', {
        name: 'Вы предложили обмен',
      }),
    ).toBeInTheDocument()
  })

  it('блокирует кнопку при существующей заявке', () => {
    renderSkillPage({
      requests: [existingRequest],
    })

    expect(
      screen.getByRole('button', {
        name: 'Обмен предложен',
      }),
    ).toBeDisabled()
  })

  it('не позволяет предложить обмен самому себе', () => {
    renderSkillPage({
      viewedUserId: localUser.id,
    })

    expect(screen.getByTestId('is-own-skill')).toHaveTextContent('true')
    expect(
      screen.getByRole('button', {
        name: 'Предложить обмен',
      }),
    ).toBeDisabled()
  })

  it('не считает страницу собственной для гостя с совпадающим userId в URL', () => {
    renderSkillPage({
      viewedUserId: localUser.id,
      isAuthenticated: false,
    })

    expect(screen.getByTestId('is-own-skill')).toHaveTextContent('false')
  })

  it('показывает ошибку и не открывает success modal при ошибке сохранения', async () => {
    const user = userEvent.setup()
    const testStore = renderSkillPage()

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    await user.click(
      screen.getByRole('button', {
        name: 'Предложить обмен',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Не удалось сохранить заявку. Попробуйте ещё раз.',
    )

    expect(testStore.getState().requests.items).toEqual([])

    expect(
      screen.queryByRole('heading', {
        name: 'Вы предложили обмен',
      }),
    ).not.toBeInTheDocument()
  })
})
