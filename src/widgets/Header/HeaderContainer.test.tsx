import { configureStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { SwapRequest, User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import notificationsReducer from '@/store/slices/notificationsSlice'
import requestsReducer from '@/store/slices/requestsSlice'
import usersReducer from '@/store/slices/usersSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import registrationReducer from '@/store/slices/registrationSlice'
import { sendSwapRequest } from '@/store/thunks/sendSwapRequest'

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

const recipient: User = {
  id: 'recipient-id',
  name: 'Николай',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Игра на гитаре',
    categoryId: 'creativity-art',
    subcategoryId: 'music',
    description: '',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-09-01T00:00:00.000Z',
}

const existingRequest: SwapRequest = {
  id: 'existing-request-id',
  fromUserId: localUser.id,
  toUserId: recipient.id,
  createdAt: '2026-09-10T12:00:00.000Z',
}

const createTestStore = (withUnreadNotification = false) =>
  configureStore({
    reducer: {
      users: usersReducer,
      auth: authReducer,
      registration: registrationReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      notifications: notificationsReducer,
      catalogFilters: catalogFiltersReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: { userId: localUser.id },
        status: 'idle' as const,
        error: null,
      },
      users: {
        mockUsers: [recipient],
        localUser,
        status: 'success' as const,
        error: null,
      },
      requests: {
        items: withUnreadNotification ? [existingRequest] : [],
      },
      notifications: {
        items: withUnreadNotification
          ? [
              {
                requestId: existingRequest.id,
                isRead: false,
              },
            ]
          : [],
        error: null,
      },
    },
  })

const renderHeader = (withUnreadNotification = false) => {
  const testStore = createTestStore(withUnreadNotification)

  storageService.set(STORAGE_KEYS.AUTH_SESSION, {
    userId: localUser.id,
  })

  const renderResult = render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HeaderContainer />} />

          <Route path={ROUTES.PROFILE} element={<h1>Личный кабинет открыт</h1>} />

          <Route path={ROUTES.FAVORITES} element={<h1>Избранное открыто</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return {
    testStore,
    ...renderResult,
  }
}

const openProfileMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(
    screen.getByRole('button', {
      name: new RegExp(localUser.name),
    }),
  )
}

const openNotifications = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(
    screen.getByRole('button', {
      name: 'Кнопка уведомлений',
    }),
  )
}

describe('HeaderContainer', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('открывает меню пользователя по имени и аватару', async () => {
    const user = userEvent.setup()

    renderHeader()
    await openProfileMenu(user)

    expect(
      screen.getByRole('link', {
        name: 'Личный кабинет',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Выйти из аккаунта',
      }),
    ).toBeInTheDocument()
  })

  it('выполняет logout и показывает гостевой Header', async () => {
    const user = userEvent.setup()
    const { testStore } = renderHeader()

    await openProfileMenu(user)

    await user.click(
      screen.getByRole('button', {
        name: 'Выйти из аккаунта',
      }),
    )

    expect(testStore.getState().auth.session).toBeNull()

    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()

    expect(
      screen.getByRole('button', {
        name: 'Войти',
      }),
    ).toBeInTheDocument()
  })

  it('открывает страницу избранного', async () => {
    const user = userEvent.setup()

    renderHeader()

    await user.click(
      screen.getByRole('button', {
        name: 'Кнопка избранного',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Избранное открыто',
      }),
    ).toBeInTheDocument()
  })

  it('открывает личный кабинет', async () => {
    const user = userEvent.setup()

    renderHeader()
    await openProfileMenu(user)

    await user.click(
      screen.getByRole('link', {
        name: 'Личный кабинет',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Личный кабинет открыт',
      }),
    ).toBeInTheDocument()
  })

  it('показывает пустое состояние уведомлений', async () => {
    const user = userEvent.setup()

    renderHeader()
    await openNotifications(user)

    expect(screen.getByText('Уведомлений нет')).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Новые уведомления',
      }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Просмотренные',
      }),
    ).not.toBeInTheDocument()
  })

  it('читает и очищает уведомления, не закрывая dropdown', async () => {
    const user = userEvent.setup()

    renderHeader(true)

    expect(screen.getByLabelText('Есть новые уведомления')).toBeInTheDocument()

    await openNotifications(user)

    expect(
      screen.getByRole('heading', {
        name: 'Новые уведомления',
      }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Прочитать всё',
      }),
    )

    expect(
      screen.queryByRole('heading', {
        name: 'Новые уведомления',
      }),
    ).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Просмотренные',
      }),
    ).toBeInTheDocument()

    expect(screen.queryByLabelText('Есть новые уведомления')).not.toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Кнопка уведомлений',
      }),
    ).toHaveAttribute('aria-expanded', 'true')

    await user.click(
      screen.getByRole('button', {
        name: 'Очистить',
      }),
    )

    expect(screen.getByText('Уведомлений нет')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Кнопка уведомлений',
      }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('сразу показывает индикатор после создания заявки', () => {
    const { testStore } = renderHeader()

    expect(screen.queryByLabelText('Есть новые уведомления')).not.toBeInTheDocument()

    act(() => {
      testStore.dispatch(sendSwapRequest(recipient.id))
    })

    expect(screen.getByLabelText('Есть новые уведомления')).toBeInTheDocument()
  })

  it('показывает гостевой Header, если сессии нет', () => {
    const testStore = configureStore({
      reducer: {
        users: usersReducer,
        auth: authReducer,
        registration: registrationReducer,
        favorites: favoritesReducer,
        requests: requestsReducer,
        notifications: notificationsReducer,
        catalogFilters: catalogFiltersReducer,
      },
      preloadedState: {
        auth: {
          account: null,
          session: null,
          status: 'idle' as const,
          error: null,
        },
        users: {
          mockUsers: [recipient],
          localUser: null,
          status: 'success' as const,
          error: null,
        },
        requests: {
          items: [],
        },
        notifications: {
          items: [],
          error: null,
        },
      },
    })

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={[ROUTES.HOME]}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HeaderContainer />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    expect(
      screen.getByRole('button', {
        name: 'Войти',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Зарегистрироваться',
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'Кнопка уведомлений',
      }),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'Кнопка избранного',
      }),
    ).not.toBeInTheDocument()
  })
})
