import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import type { CatalogPageProps } from './CatalogPage'

export const catalogCategories = [
  {
    category: 'Бизнес и карьера',
    subcategories: [
      'Управление командой',
      'Маркетинг и реклама',
      'Продажи и переговоры',
      'Личный бренд',
    ],
  },
  {
    category: 'Иностранные языки',
    subcategories: ['Английский', 'Французский', 'Испанский', 'Немецкий'],
  },
  {
    category: 'Дом и уют',
    subcategories: [
      'Уборка и организация',
      'Домашние финансы',
      'Приготовление еды',
      'Домашние растения',
    ],
  },
  {
    category: 'Творчество и искусство',
    subcategories: ['Рисование и иллюстрация', 'Фотография', 'Видеомонтаж', 'Музыка и звук'],
  },
  {
    category: 'Образование и развитие',
    subcategories: ['Личностное развитие', 'Навыки обучения', 'Когнитивные техники', 'Скорочтение'],
  },
  {
    category: 'Здоровье и лайфстайл',
    subcategories: ['Йога и медитация', 'Питание и ЗОЖ', 'Ментальное здоровье', 'Осознанность'],
  },
]

export const catalogCities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']

const learnTags = [
  { label: 'Тайм менеджмент', variant: 'more' as const },
  { label: 'Медитация', variant: 'health' as const },
]

const users: UserSkillsSectionItem[] = [
  {
    id: 'user-001',
    name: 'Юлия',
    city: 'Москва',
    age: 24,
    gender: 'female',
    avatarUrl: '/images/users/user-001/avatar.webp',
    canTeach: { label: 'Управление командой', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-002',
    name: 'Алексей',
    city: 'Санкт-Петербург',
    age: 27,
    gender: 'male',
    avatarUrl: '/images/users/user-002/avatar.webp',
    canTeach: { label: 'Управление командой', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-003',
    name: 'Альберт',
    city: 'Санкт-Петербург',
    age: 41,
    gender: 'male',
    avatarUrl: null,
    canTeach: { label: 'Маркетинг и реклама', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-004',
    name: 'Анастасия',
    city: 'Новосибирск',
    age: 22,
    gender: 'female',
    avatarUrl: '/images/users/user-004/avatar.webp',
    canTeach: { label: 'Маркетинг и реклама', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-005',
    name: 'Дарья',
    city: 'Ростов-на-Дону',
    age: 37,
    gender: 'female',
    avatarUrl: '/images/users/user-005/avatar.webp',
    canTeach: { label: 'Продажи и переговоры', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-006',
    name: 'Олег',
    city: 'Мурманск',
    age: 47,
    gender: 'male',
    avatarUrl: '/images/users/user-006/avatar.webp',
    canTeach: { label: 'Личный бренд', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-007',
    name: 'Михаил',
    city: 'Ногинск',
    age: 56,
    gender: 'male',
    avatarUrl: null,
    canTeach: { label: 'Резюме и собеседование', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-008',
    name: 'Аркадий',
    city: 'Иркутск',
    age: 23,
    gender: 'male',
    avatarUrl: '/images/users/user-008/avatar.webp',
    canTeach: { label: 'Тайм-менеджмент', variant: 'business' },
    learnTags,
  },
  {
    id: 'user-009',
    name: 'Анна',
    city: 'Москва',
    age: 43,
    gender: 'female',
    avatarUrl: '/images/users/user-009/avatar.webp',
    canTeach: { label: 'Проектное управление', variant: 'business' },
    learnTags,
  },
]

export const popularItems = users.slice(0, 3)
export const newItems = users.slice(3, 6)
export const recommendedItems = users

export const catalogPageMock: CatalogPageProps = {
  categories: catalogCategories,
  cities: catalogCities,
  popularItems,
  newItems,
  recommendedItems,
  onFavoriteClick: (id) => console.log('Избранное:', id),
  onDetailsClick: (id) => console.log('Подробнее:', id),
}
