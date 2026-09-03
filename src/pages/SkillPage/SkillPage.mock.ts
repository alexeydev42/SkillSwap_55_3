import type { SkillPageProps } from './SkillPage'

import skillImage1 from '../../shared/assets/illustrations/illustration-error-404.svg'
import skillImage2 from '../../shared/assets/illustrations/illustration-error-500.svg'
import skillImage3 from '../../shared/assets/illustrations/illustration-light-bulb.svg'
import skillImage4 from '../../shared/assets/illustrations/illustration-school-board.svg'
import skillImage5 from '../../shared/assets/illustrations/illustration-user-info.svg'

import avatar from '../../shared/assets/illustrations/illustration-school-board.svg'

const colorPlaceholder = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23${hex}'/%3E%3C/svg%3E`

export const skillPageMock: SkillPageProps = {
  user: {
  avatar: colorPlaceholder('7c9cbf'),
  name: 'Иван',
  city: 'Санкт-Петербург',
  age: '34 года',
},

userDescription:
  'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',

skills: {
  canTeach: {
    variant: 'creative',
    label: 'Игра на барабанах',
  },
  wantsToLearn: [
    {
      variant: 'education',
      label: 'Тайм менеджмент',
    },
    {
      variant: 'health',
      label: 'Медитация',
    },
  ],
},

skill: {
  title: 'Игра на барабанах',
  category: 'Творчество и искусство',
  subcategory: 'Музыка и звук',
  description:
    'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
},

  gallery: [
  colorPlaceholder('8fb99f'),
  colorPlaceholder('c98b8b'),
  colorPlaceholder('d6b26e'),
  colorPlaceholder('9a8cbd'),
  colorPlaceholder('6e7fa3'),
],

  similarOffers: [
    {
      user: {
        name: 'Мария Петрова',
        city: 'Таллин',
        age: 31,
        avatarUrl: colorPlaceholder('8fb99f'),
        canTeach: {
          label: 'Фотография',
          variant: 'creative',
        },
        learnTags: [
          {
            label: 'Английский язык',
            variant: 'languages',
          },
        ],
      },
      onFavoriteClick: () => {},
      onDetailsClick: () => {},
    },
    {
      user: {
        name: 'Алексей Смирнов',
        city: 'Таллин',
        age: 27,
        avatarUrl: colorPlaceholder('c98b8b'),
        canTeach: {
          label: 'Графический дизайн',
          variant: 'creative',
        },
        learnTags: [
          {
            label: 'Английский язык',
            variant: 'languages',
          },
          {
            label: 'Испанский',
            variant: 'languages',
          },
        ],
      },
      onFavoriteClick: () => {},
      onDetailsClick: () => {},
    },
    {
      user: {
        name: 'Елена Кузнецова',
        city: 'Таллин',
        age: 29,
        avatarUrl: colorPlaceholder('d6b26e'),
        canTeach: {
          label: 'Испанский язык',
          variant: 'languages',
        },
        learnTags: [
          {
            label: 'Английский язык',
            variant: 'languages',
          },
        ],
      },
      onFavoriteClick: () => {},
      onDetailsClick: () => {},
    },
    {
      user: {
        name: 'Дмитрий Волков',
        city: 'Новосибирск',
        age: 34,
        avatarUrl: colorPlaceholder('9a8cbd'),
        canTeach: {
          label: 'Музыка',
          variant: 'creative',
        },
        learnTags: [
          {
            label: 'Рисование',
            variant: 'creative',
          },
          {
            label: 'Фотография',
            variant: 'creative',
          },
        ],
      },
      onFavoriteClick: () => {},
      onDetailsClick: () => {},
    },
  ],
}
