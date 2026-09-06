import { beforeEach, describe, expect, it, vi } from 'vitest'
import usersReducer, {
  fetchUsers,
  selectAllUsers,
  selectCurrentUser,
  selectEffectiveLearningSubcategoryIds,
  selectNewUsers,
  selectPopularUsers,
  selectUserById,
  type UsersState,
} from './usersSlice'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { User } from '@/shared/types'
import type { RootState } from '@/store'

const mockUser: User = {
  id: 'user-001',
  name: 'Юлия',
  birthDate: '2002-02-04',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Тест',
  offeredSkill: {
    title: 'Тест',
    categoryId: 'business-career',
    subcategoryId: 'team-management',
    description: 'Тест',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
}

const localUser: User = {
  ...mockUser,
  id: 'local-user',
  name: 'Локальный пользователь',
}

const initialState: UsersState = {
  mockUsers: [],
  localUser: null,
  status: 'idle',
  error: null,
}

// Создаёт состояние Redux для проверки селекторов usersSlice.
function createRootState(users: UsersState): RootState {
  return { users } as RootState
}

// Создаёт состояние Redux с авторизованным пользователем.
function createAuthenticatedRootState(users: UsersState, userId: string): RootState {
  return {
    ...createRootState(users),
    auth: {
      account: null,
      session: { userId },
      status: 'idle',
      error: null,
    },
  } as RootState
}

beforeEach(() => {
  storageService.remove(STORAGE_KEYS.LOCAL_USER)
})

describe('usersSlice — fetchUsers', () => {
  it('ставит status "loading" при pending и не трогает уже загруженных пользователей', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const nextState = usersReducer(stateWithUsers, fetchUsers.pending('', undefined))

    expect(nextState.status).toBe('loading')
    expect(nextState.error).toBeNull()
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('сохраняет пользователей в mockUsers и ставит status "success" при fulfilled', () => {
    const nextState = usersReducer(initialState, fetchUsers.fulfilled([mockUser], '', undefined))

    expect(nextState.status).toBe('success')
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('при rejected сохраняет ошибку, ставит status "error" и не затирает mockUsers', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const error = new Error('Network Error')
    const nextState = usersReducer(stateWithUsers, fetchUsers.rejected(error, '', undefined))

    expect(nextState.status).toBe('error')
    expect(nextState.error).toBe('Network Error')
    expect(nextState.mockUsers).toEqual([mockUser])
  })
})

describe('usersSlice — localUser', () => {
  it('восстанавливает локального пользователя из localStorage', async () => {
    storageService.set(STORAGE_KEYS.LOCAL_USER, localUser)
    vi.resetModules()

    const { default: freshUsersReducer } = await import('./usersSlice')
    const state = freshUsersReducer(undefined, { type: 'unknown' })

    expect(state.localUser).toEqual(localUser)
  })

  it('объединяет моковых и локального пользователя', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser,
    })

    expect(selectAllUsers(state)).toEqual([mockUser, localUser])
    expect(state.users.mockUsers).toEqual([mockUser])
    expect(state.users.localUser).toEqual(localUser)
  })

  it('возвращает только моковых пользователей, если локального пользователя нет', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
    })

    expect(selectAllUsers(state)).toEqual([mockUser])
  })

  it('не дублирует локального пользователя при совпадении id', () => {
    const duplicateLocalUser: User = {
      ...mockUser,
      name: 'Локальный пользователь',
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser: duplicateLocalUser,
    })

    expect(selectAllUsers(state)).toEqual([duplicateLocalUser])
    expect(state.users.mockUsers).toEqual([mockUser])
    expect(state.users.localUser).toEqual(duplicateLocalUser)
  })
})

describe('usersSlice — базовые селекторы', () => {
  it('возвращает текущего локального пользователя по id активной сессии', () => {
    const state = createAuthenticatedRootState(
      {
        ...initialState,
        localUser,
      },
      localUser.id,
    )

    expect(selectCurrentUser(state)).toEqual(localUser)
  })

  it('не возвращает локального пользователя при несовпадении id сессии', () => {
    const state = createAuthenticatedRootState(
      {
        ...initialState,
        localUser,
      },
      'another-user',
    )

    expect(selectCurrentUser(state)).toBeNull()
  })

  it('находит мокового и локального пользователя по id', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser,
    })

    expect(selectUserById(state, mockUser.id)).toEqual(mockUser)
    expect(selectUserById(state, localUser.id)).toEqual(localUser)
    expect(selectUserById(state, 'unknown-user')).toBeNull()
  })

  it('сортирует пользователей по количеству лайков', () => {
    const lessPopularUser: User = {
      ...mockUser,
      id: 'less-popular-user',
      likesCount: 5,
    }

    const morePopularUser: User = {
      ...mockUser,
      id: 'more-popular-user',
      likesCount: 20,
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [lessPopularUser, morePopularUser],
    })

    expect(selectPopularUsers(state)).toEqual([morePopularUser, lessPopularUser])
    expect(state.users.mockUsers).toEqual([lessPopularUser, morePopularUser])
  })

  it('сортирует пользователей по дате создания от новых к старым', () => {
    const olderUser: User = {
      ...mockUser,
      id: 'older-user',
      createdAt: '2024-01-01T00:00:00.000Z',
    }

    const newerUser: User = {
      ...mockUser,
      id: 'newer-user',
      createdAt: '2025-01-01T00:00:00.000Z',
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [olderUser, newerUser],
    })

    expect(selectNewUsers(state)).toEqual([newerUser, olderUser])
    expect(state.users.mockUsers).toEqual([olderUser, newerUser])
  })

  it('не возвращает пользователя при отсутствии активной сессии', () => {
    const state = {
      ...createRootState({
        ...initialState,
        localUser,
      }),
      auth: {
        account: null,
        session: null,
        status: 'idle',
        error: null,
      },
    } as RootState

    expect(selectCurrentUser(state)).toBeNull()
  })
})
describe('usersSlice — selectEffectiveLearningSubcategoryIds', () => {
  // Добавляет к состоянию из createRootState срез favorites — нужен для
  // проверки вычисляемого списка «Хочу научиться», который зависит от
  // users + favorites.
  function createRootStateWithFavorites(
    users: UsersState,
    favoriteUserIds: string[],
  ): RootState {
    return {
      ...createRootState(users),
      favorites: { favoriteUserIds },
    } as RootState
  }

  const firstFavoriteUser: User = {
    ...mockUser,
    id: 'favorite-user-1',
    offeredSkill: { ...mockUser.offeredSkill, subcategoryId: 'public-speaking' },
  }
  const secondFavoriteUser: User = {
    ...mockUser,
    id: 'favorite-user-2',
    offeredSkill: { ...mockUser.offeredSkill, subcategoryId: 'time-management' },
  }

  it('для мокового пользователя возвращает исходный learningSubcategoryIds без изменений', () => {
    const mockUserWithLearningIds: User = {
      ...mockUser,
      learningSubcategoryIds: ['guitar'],
    }
    const state = createRootStateWithFavorites(
      { ...initialState, mockUsers: [mockUserWithLearningIds, firstFavoriteUser] },
      [firstFavoriteUser.id],
    )
    expect(selectEffectiveLearningSubcategoryIds(state, mockUserWithLearningIds.id)).toEqual([
      'guitar',
    ])
  })

  it('у локального пользователя без Favorites возвращает только базовый список', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, localUser: { ...localUser, learningSubcategoryIds: ['guitar'] } },
      [],
    )
    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual(['guitar'])
  })

  it('добавляет subcategoryId избранного пользователя к базовому списку', () => {
    const state = createRootStateWithFavorites(
      {
        ...initialState,
        mockUsers: [firstFavoriteUser],
        localUser: { ...localUser, learningSubcategoryIds: ['guitar'] },
      },
      [firstFavoriteUser.id],
    )
    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual([
      'guitar',
      'public-speaking',
    ])
  })

  it('после удаления пользователя из Favorites список возвращается к базовому', () => {
    const usersState: UsersState = {
      ...initialState,
      mockUsers: [firstFavoriteUser],
      localUser: { ...localUser, learningSubcategoryIds: ['guitar'] },
    }
    const stateWithFavorite = createRootStateWithFavorites(usersState, [firstFavoriteUser.id])
    expect(selectEffectiveLearningSubcategoryIds(stateWithFavorite, localUser.id)).toEqual([
      'guitar',
      'public-speaking',
    ])

    const stateWithoutFavorite = createRootStateWithFavorites(usersState, [])
    expect(selectEffectiveLearningSubcategoryIds(stateWithoutFavorite, localUser.id)).toEqual([
      'guitar',
    ])
  })

  it('убирает дубликаты, если несколько избранных делятся одной subcategoryId или она совпадает с базовой', () => {
    const duplicateFavoriteUser: User = {
      ...mockUser,
      id: 'favorite-user-3',
      offeredSkill: { ...mockUser.offeredSkill, subcategoryId: 'public-speaking' },
    }
    const state = createRootStateWithFavorites(
      {
        ...initialState,
        mockUsers: [firstFavoriteUser, secondFavoriteUser, duplicateFavoriteUser],
        localUser: { ...localUser, learningSubcategoryIds: ['time-management'] },
      },
      [firstFavoriteUser.id, secondFavoriteUser.id, duplicateFavoriteUser.id],
    )
    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual([
      'time-management',
      'public-speaking',
    ])
  })

  it('возвращает пустой массив, если пользователь не найден', () => {
    const state = createRootStateWithFavorites(initialState, [])
    expect(selectEffectiveLearningSubcategoryIds(state, 'unknown-user')).toEqual([])
  })
})
