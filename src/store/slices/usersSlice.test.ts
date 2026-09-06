import { beforeEach, describe, expect, it, vi } from 'vitest'
import usersReducer, { fetchUsers, selectAllUsers, type UsersState } from './usersSlice'
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
