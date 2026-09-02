export const ROUTES = {
  HOME: '/',
  SKILL: '/skill/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  CREATE: '/create',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

export const SKILL_CATEGORIES = [
  'Программирование',
  'Дизайн',
  'Языки',
  'Музыка',
  'Спорт',
  'Кулинария',
  'Фото и видео',
  'Бизнес',
  'Другое',
] as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_ACCOUNT: 'skillswap_auth_account',
  AUTH_SESSION: 'skillswap_auth_session',
  FAVORITES: 'skillswap_favorites',
  REQUESTS: 'skillswap_requests',
  THEME: 'skillswap_theme',
} as const
