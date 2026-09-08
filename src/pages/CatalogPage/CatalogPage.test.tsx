import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import catalogFiltersReducer, {
  defaultFilters,
  defaultSort,
} from '@/store/slices/catalogFiltersSlice'
import usersReducer, { type UsersState } from '@/store/slices/usersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import type { Category, City, User } from '@/shared/types'
import type { UserSkillsSectionProps } from '@/widgets/UserSkillsSection'

import { CatalogPage } from './CatalogPage'

vi.mock('@/widgets/Header', () => ({ Header: () => null }))
vi.mock('@/widgets/Footer', () => ({ Footer: () => null }))
vi.mock('@/widgets/FiltersSidebar', () => ({ FiltersSidebar: () => null }))
vi.mock('@/widgets/RecommendedSection', () => ({
  RecommendedSection: () => null,
}))
vi.mock('@/widgets/AppliedFiltersBar', () => ({ AppliedFiltersBar: () => null }))
vi.mock('@/widgets/SortButton', () => ({ SortButton: () => null }))
vi.mock('@/widgets/UserSkillCard', () => ({ UserSkillCard: () => null }))
vi.mock('@/widgets/UserSkillsSection', () => ({
  UserSkillsSection: ({
    title,
    items,
    showViewAll,
    viewAllLabel,
    onViewAllClick,
  }: UserSkillsSectionProps) => (
    <section aria-label={title}>
      {items.map((item) => (
        <span key={item.id} data-testid="new-user-card">
          {item.name}
        </span>
      ))}

      {showViewAll && (
        <button type="button" onClick={onViewAllClick}>
          {viewAllLabel}
        </button>
      )}
    </section>
  ),
}))

const categories: Category[] = [
  {
    id: 'business-career',
    name: 'Бизнес и карьера',
    subcategories: [
      {
        id: 'team-management',
        name: 'Управление командой',
      },
    ],
  },
]

const cities: City[] = [{ id: 'moscow', name: 'Москва' }]

const baseUser: User = {
  id: 'user-001',
  name: 'Пользователь 1',
  birthDate: '2000-01-01',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Тестовый пользователь',
  offeredSkill: {
    title: 'Управление командой',
    categoryId: 'business-career',
    subcategoryId: 'team-management',
    description: 'Тестовое описание',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function createUser(index: number): User {
  const day = String(index + 1).padStart(2, '0')

  return {
    ...baseUser,
    id: `user-${index + 1}`,
    name: `Пользователь ${index + 1}`,
    createdAt: `2026-01-${day}T00:00:00.000Z`,
  }
}

function renderCatalogPage(mockUsers: User[], localUser: User | null = null) {
  const users = localUser
    ? [...mockUsers.filter((user) => user.id !== localUser.id), localUser]
    : mockUsers

  const testStore = configureStore({
    reducer: {
      users: usersReducer,
      catalogFilters: catalogFiltersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      users: {
        mockUsers,
        localUser,
        status: 'success' as const,
        error: null,
      },
      catalogFilters: {
        filters: defaultFilters,
        sort: defaultSort,
      },
      favorites: {
        favoriteUserIds: [],
      },
    },
  })

  render(
    <Provider store={testStore}>
      <CatalogPage
        users={users}
        categories={categories}
        cities={cities}
        usersStatus="success"
        usersError={null}
        hasMockUsers={mockUsers.length > 0}
        onRetry={vi.fn()}
        onFavoriteClick={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    </Provider>,
  )

  return { testStore }
}

function renderCatalogState({
  mockUsers = [],
  localUser = null,
  status,
  error = null,
  onRetry = vi.fn(),
}: {
  mockUsers?: User[]
  localUser?: User | null
  status: UsersState['status']
  error?: string | null
  onRetry?: () => void
}) {
  const users = localUser
    ? [...mockUsers.filter((user) => user.id !== localUser.id), localUser]
    : mockUsers

  const testStore = configureStore({
    reducer: {
      users: usersReducer,
      catalogFilters: catalogFiltersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      users: {
        mockUsers,
        localUser,
        status,
        error,
      },
      catalogFilters: {
        filters: defaultFilters,
        sort: defaultSort,
      },
      favorites: {
        favoriteUserIds: [],
      },
    },
  })

  render(
    <Provider store={testStore}>
      <CatalogPage
        users={users}
        categories={categories}
        cities={cities}
        usersStatus={status}
        usersError={error}
        hasMockUsers={mockUsers.length > 0}
        onRetry={onRetry}
        onFavoriteClick={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    </Provider>,
  )

  return { testStore }
}

describe('CatalogPage — секция «Популярное»', () => {
  it('показывает 3 карточки, раскрывает до 9 и сворачивает обратно', async () => {
    const user = userEvent.setup()
    const users = Array.from({ length: 10 }, (_, index) => ({
      ...createUser(index),
      likesCount: 100 - index,
    }))

    renderCatalogPage(users)

    const popularSection = screen.getByRole('region', { name: 'Популярное' })

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(3)

    await user.click(
      within(popularSection).getByRole('button', {
        name: 'Смотреть все',
      }),
    )

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(9)
    expect(
      within(popularSection).getByRole('button', {
        name: 'Свернуть',
      }),
    ).toBeInTheDocument()

    await user.click(
      within(popularSection).getByRole('button', {
        name: 'Свернуть',
      }),
    )

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(3)
  })

  it('не показывает кнопку раскрытия, если пользователей не больше трёх', () => {
    renderCatalogPage([createUser(0), createUser(1), createUser(2)])

    const popularSection = screen.getByRole('region', { name: 'Популярное' })

    expect(
      within(popularSection).queryByRole('button', {
        name: 'Смотреть все',
      }),
    ).not.toBeInTheDocument()
  })
})

describe('CatalogPage — секция «Новое»', () => {
  it('показывает 3 карточки, раскрывает до 9 и сворачивает обратно', async () => {
    const user = userEvent.setup()

    renderCatalogPage(Array.from({ length: 10 }, (_, index) => createUser(index)))

    const newSection = screen.getByRole('region', { name: 'Новое' })

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(3)

    await user.click(
      within(newSection).getByRole('button', {
        name: 'Смотреть все',
      }),
    )

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(9)

    expect(
      within(newSection).getByRole('button', {
        name: 'Свернуть',
      }),
    ).toBeInTheDocument()

    await user.click(
      within(newSection).getByRole('button', {
        name: 'Свернуть',
      }),
    )

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(3)
  })

  it('показывает локально зарегистрированного пользователя среди новейших', () => {
    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
      createdAt: '2026-02-01T00:00:00.000Z',
    }

    renderCatalogPage([createUser(0), createUser(1), createUser(2)], localUser)

    const newSection = screen.getByRole('region', { name: 'Новое' })

    expect(within(newSection).getByText('Локальный пользователь')).toBeInTheDocument()
  })
})

describe('CatalogPage — loading/error states', () => {
  it('показывает Spinner уже в idle до запуска первоначального thunk', () => {
    renderCatalogState({
      status: 'idle',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Загрузка...')).toBeInTheDocument()
  })

  it('показывает Spinner при первой загрузке, даже если существует локальный пользователь', () => {
    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
    }

    renderCatalogState({
      localUser,
      status: 'loading',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Загрузка...')).toBeInTheDocument()
  })

  it('не показывает Spinner при повторной загрузке уже имеющихся моковых пользователей', () => {
    renderCatalogState({
      mockUsers: [baseUser],
      status: 'loading',
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    expect(screen.getByRole('region', { name: 'Популярное' })).toBeInTheDocument()
  })

  it('показывает ошибку и retry, если первая загрузка упала при наличии локального пользователя', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
    }

    renderCatalogState({
      localUser,
      status: 'error',
      error: 'Network Error',
      onRetry,
    })

    expect(screen.getByText('Не удалось загрузить пользователей')).toBeInTheDocument()

    expect(screen.getByText('Network Error')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('показывает error-state после ошибки повторного запроса и сохраняет данные в Redux', () => {
    const { testStore } = renderCatalogState({
      mockUsers: [baseUser],
      status: 'error',
      error: 'Network Error',
    })

    expect(screen.getByText('Не удалось загрузить пользователей')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()

    expect(testStore.getState().users.mockUsers).toEqual([baseUser])
  })
})
