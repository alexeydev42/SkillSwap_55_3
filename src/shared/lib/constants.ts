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

export type SkillTagCategory =
  | 'languages'
  | 'education'
  | 'health'
  | 'business'
  | 'creative'
  | 'home'
  | 'more'

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'skillswap_auth_user',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
} as const
