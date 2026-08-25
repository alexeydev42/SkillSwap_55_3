export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

export enum SkillCategory {
  BUSINESS = 'Бизнес и карьера',
  LANGUAGES = 'Иностранные языки',
  HOME = 'Дом и уют',
  ART = 'Творчество и искусство',
  EDUCATION = 'Образование и развитие',
  HEALTH = 'Здоровье и лайфстайл',
  OTHER = 'Другое',
}

export const SKILL_CATEGORIES = [
  SkillCategory.BUSINESS,
  SkillCategory.LANGUAGES,
  SkillCategory.HOME,
  SkillCategory.ART,
  SkillCategory.EDUCATION,
  SkillCategory.HEALTH,
  SkillCategory.OTHER,
] as const

export type SkillCategoryType = (typeof SKILL_CATEGORIES)[number]

export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
  [SkillCategory.BUSINESS]: 'var(--color-tag-business)',
  [SkillCategory.LANGUAGES]: 'var(--color-tag-languages)',
  [SkillCategory.HOME]: 'var(--color-tag-home)',
  [SkillCategory.ART]: 'var(--color-tag-creative)',
  [SkillCategory.EDUCATION]: 'var(--color-tag-education)',
  [SkillCategory.HEALTH]: 'var(--color-tag-health)',
  [SkillCategory.OTHER]: 'var(--color-tag-more)',
}

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
} as const
