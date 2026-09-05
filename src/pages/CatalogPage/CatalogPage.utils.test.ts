import { describe, expect, it } from 'vitest'

import type { User } from '@/shared/types'
import type { CatalogFilters } from '@/widgets/FiltersSidebar'

import { filterCatalogUsers, removeCatalogFilter } from './CatalogPage.utils'

const users: User[] = [
  {
    id: 'teacher-cooking',
    name: 'Альберт',
    birthDate: '1985-03-18',
    gender: 'male',
    cityId: 'moscow',
    avatarUrl: null,
    description: '',
    offeredSkill: {
      title: 'Домашняя кухня',
      categoryId: 'home-comfort',
      subcategoryId: 'cooking',
      description: '',
      imageUrls: [],
    },
    learningSubcategoryIds: ['english'],
    likesCount: 10,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'teacher-english',
    name: 'Анна',
    birthDate: '1990-04-20',
    gender: 'female',
    cityId: 'saint-petersburg',
    avatarUrl: null,
    description: '',
    offeredSkill: {
      title: 'Разговорный английский',
      categoryId: 'foreign-languages',
      subcategoryId: 'english',
      description: '',
      imageUrls: [],
    },
    learningSubcategoryIds: ['cooking'],
    likesCount: 20,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
]

const emptyFilters: CatalogFilters = {
  offerType: 'all',
  gender: 'all',
  subcategoryIds: [],
  cityIds: [],
}

describe('filterCatalogUsers', () => {
  it('возвращает всех пользователей без выбранных фильтров', () => {
    const result = filterCatalogUsers(users, emptyFilters)

    expect(result).toHaveLength(2)
  })

  it('ищет выбранный навык среди навыков, которым пользователь обучает', () => {
    const filters: CatalogFilters = {
      ...emptyFilters,
      offerType: 'teaching',
      subcategoryIds: ['cooking'],
    }

    const result = filterCatalogUsers(users, filters)

    expect(result.map(({ id }) => id)).toEqual(['teacher-cooking'])
  })

  it('ищет выбранный навык среди навыков, которым пользователь хочет научиться', () => {
    const filters: CatalogFilters = {
      ...emptyFilters,
      offerType: 'learning',
      subcategoryIds: ['cooking'],
    }

    const result = filterCatalogUsers(users, filters)

    expect(result.map(({ id }) => id)).toEqual(['teacher-english'])
  })

  it('проверяет оба направления при выбранном значении «Всё»', () => {
    const filters: CatalogFilters = {
      ...emptyFilters,
      subcategoryIds: ['cooking'],
    }

    const result = filterCatalogUsers(users, filters)

    expect(result.map(({ id }) => id)).toEqual(['teacher-cooking', 'teacher-english'])
  })

  it('объединяет навыки, города и пол через условие «И»', () => {
    const filters: CatalogFilters = {
      ...emptyFilters,
      gender: 'female',
      subcategoryIds: ['cooking'],
      cityIds: ['saint-petersburg'],
    }

    const result = filterCatalogUsers(users, filters)

    expect(result.map(({ id }) => id)).toEqual(['teacher-english'])
  })
})

describe('removeCatalogFilter', () => {
  it('удаляет только выбранный фильтр города', () => {
    const filters: CatalogFilters = {
      offerType: 'teaching',
      gender: 'female',
      subcategoryIds: ['cooking'],
      cityIds: ['moscow', 'saint-petersburg'],
    }

    const result = removeCatalogFilter(filters, 'city:moscow')

    expect(result).toEqual({
      offerType: 'teaching',
      gender: 'female',
      subcategoryIds: ['cooking'],
      cityIds: ['saint-petersburg'],
    })
  })
})
