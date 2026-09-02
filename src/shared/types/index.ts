// ─── User ────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'preferNotToSay'

export interface OfferedSkill {
  title: string
  categoryId: string
  subcategoryId: string
  description: string
  imageUrls: string[]
}

export interface User {
  id: string
  name: string
  birthDate: string
  gender: Gender
  cityId: string
  avatarUrl: string | null
  description: string
  offeredSkill: OfferedSkill
  learningSubcategoryIds: string[]
  likesCount: number
  createdAt: string
}

// ─── Reference data ──────────────────────────────────────

export interface Subcategory {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

export interface City {
  id: string
  name: string
}

// ─── Registration / Auth ─────────────────────────────────

export interface RegistrationDraft {
  email: string
  password: string
  name: string
  birthDate: string
  gender: Gender | null
  cityId: string
  avatarUrl: string | null
  learningSubcategoryIds: string[]
  offeredSkill: OfferedSkill
}

export interface AuthAccount {
  userId: string
  email: string
  password: string
}

export interface AuthSession {
  userId: string
}

// ─── Requests / Notifications ────────────────────────────

export interface SwapRequest {
  id: string
  fromUserId: string
  toUserId: string
  createdAt: string
}

export interface Notification {
  requestId: string
  isRead: boolean
}

// ─── Legacy types ────────────────────────────────────────
// Временно оставлены до LOGIC-00-B, чтобы существующие API- и auth-заготовки
// продолжали компилироваться во время перехода на актуальную модель данных.

export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  category: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
}

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'inProgress'
  | 'done'

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}
