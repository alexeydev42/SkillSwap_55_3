import { describe, expect, it } from 'vitest'
import usersReducer, { fetchUsers, type UsersState } from './usersSlice'
import type { User } from '@/shared/types'

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

const initialState: UsersState = {
  mockUsers: [],
  localUser: null,
  status: 'idle',
  error: null,
}

describe('usersSlice — fetchUsers', () => {
  it('ставит status "loading" при pending и не трогает уже загруженных пользователей', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const nextState = usersReducer(stateWithUsers, fetchUsers.pending('', undefined))

    expect(nextState.status).toBe('loading')
    expect(nextState.error).toBeNull()
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('сохраняет пользователей в mockUsers и ставит status "success" при fulfilled', () => {
    const nextState = usersReducer(
      initialState,
      fetchUsers.fulfilled([mockUser], '', undefined),
    )

    expect(nextState.status).toBe('success')
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('при rejected сохраняет ошибку, ставит status "error" и не затирает mockUsers', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const error = new Error('Network Error')
    const nextState = usersReducer(
      stateWithUsers,
      fetchUsers.rejected(error, '', undefined),
    )

    expect(nextState.status).toBe('error')
    expect(nextState.error).toBe('Network Error')
    expect(nextState.mockUsers).toEqual([mockUser])
  })
})
