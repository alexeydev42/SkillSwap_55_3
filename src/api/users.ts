import type { User } from '@/shared/types'

const BASE_URL = `${import.meta.env.BASE_URL}db`

const getPublicPath = (path: string) => {
  if (!path.startsWith('/')) {
    return path
  }

  return `${import.meta.env.BASE_URL}${path.slice(1)}`
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const users: User[] = await response.json()

  return users.map((user) => ({
    ...user,
    avatarUrl: user.avatarUrl ? getPublicPath(user.avatarUrl) : null,
    offeredSkill: {
      ...user.offeredSkill,
      imageUrls: user.offeredSkill.imageUrls.map(getPublicPath),
    },
  }))
}
