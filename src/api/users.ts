import type { User } from '@/shared/types'

const BASE_URL = '/db'

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}
