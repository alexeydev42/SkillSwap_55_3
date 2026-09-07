import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import catalogFiltersReducer, {
  defaultFilters,
  defaultSort,
} from '@/store/slices/catalogFiltersSlice'
import usersReducer from '@/store/slices/usersSlice'
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
        users={[]}
        categories={categories}
        cities={cities}
        onFavoriteClick={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    </Provider>,
  )
}

describe('CatalogPage — секция «Новое»', () => {
  it('показывает 3 карточки, раскрывает до 9 и сворачивает обратно', async () => {
    const user = userEvent.setup()
    renderCatalogPage(Array.from({ length: 10 }, (_, index) => createUser(index)))

    const newSection = screen.getByRole('region', { name: 'Новое' })

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(3)

    await user.click(within(newSection).getByRole('button', { name: 'Смотреть все' }))

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(9)
    expect(within(newSection).getByRole('button', { name: 'Свернуть' })).toBeInTheDocument()

    await user.click(within(newSection).getByRole('button', { name: 'Свернуть' }))

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
