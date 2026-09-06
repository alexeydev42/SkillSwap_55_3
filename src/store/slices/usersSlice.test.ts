import { beforeEach, describe, expect, it, vi } from 'vitest'
import usersReducer, {
  fetchUsers,
  selectAllUsers,
  selectCurrentUser,
  selectEffectiveLikesCount,
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
describe('usersSlice — selectEffectiveLikesCount', () => {
  // Добавляет к состоянию из createRootState срез favorites — нужен для
  // проверки вычисляемого likesCount, который зависит от users + favorites.
  function createRootStateWithFavorites(
    users: UsersState,
    favoriteUserIds: string[],
  ): RootState {
    return {
      ...createRootState(users),
      favorites: { favoriteUserIds },
    } as RootState
  }

  it('возвращает базовый likesCount, если пользователь не в Favorites', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [],
    )
    expect(selectEffectiveLikesCount(state, mockUser.id)).toBe(10)
  })

  it('прибавляет 1 к likesCount, если пользователь в Favorites', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [mockUser.id],
    )
    expect(selectEffectiveLikesCount(state, mockUser.id)).toBe(11)
  })

  it('возвращает базовый likesCount после удаления пользователя из Favorites', () => {
    const stateWithFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [mockUser.id],
    )
    expect(selectEffectiveLikesCount(stateWithFavorite, mockUser.id)).toBe(11)

    const stateWithoutFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [],
    )
    expect(selectEffectiveLikesCount(stateWithoutFavorite, mockUser.id)).toBe(10)
  })

  it('возвращает 0, если пользователь не найден', () => {
    const state = createRootStateWithFavorites(initialState, [])
    expect(selectEffectiveLikesCount(state, 'unknown-user')).toBe(0)
  })

  it('у локального пользователя базовый likesCount 0 (сам себя в Favorites не добавить)', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, localUser: { ...localUser, likesCount: 0 } },
      [],
    )
    expect(selectEffectiveLikesCount(state, localUser.id)).toBe(0)
  })
})
