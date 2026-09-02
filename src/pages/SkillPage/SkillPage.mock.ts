import type { SkillPageProps } from './SkillPage'

import skillImage1 from '../../shared/assets/illustrations/illustration-error-404.svg'
import skillImage2 from '../../shared/assets/illustrations/illustration-error-500.svg'
import skillImage3 from '../../shared/assets/illustrations/illustration-light-bulb.svg'
import skillImage4 from '../../shared/assets/illustrations/illustration-school-board.svg'
import skillImage5 from '../../shared/assets/illustrations/illustration-user-info.svg'

import avatar from '../../shared/assets/illustrations/illustration-school-board.svg'

export const skillPageMock: SkillPageProps = {
  user: {
    avatar,
    name: 'Геральд Ривский',
    city: 'Вызима',
    age: '35 лет',
  },

  userDescription: 'Люблю делиться знаниями и находить людей для полезного обмена навыками.',

  skills: {
    canTeach: {
      variant: 'languages',
      label: 'Английский язык',
    },
    wantsToLearn: [
      {
        variant: 'creative',
        label: 'Фотография',
      },
      {
        variant: 'creative',
        label: 'Дизайн',
      },
      {
        variant: 'languages',
        label: 'Испанский',
      },
    ],
  },

  skill: {
    title: 'Разговорный английский',
    category: 'Языки',
    subcategory: 'Английский',
    description:
      'Помогу улучшить разговорный английский, разобраться с грамматикой и увереннее общаться в повседневных ситуациях.',
  },

  gallery: [skillImage1, skillImage2, skillImage3, skillImage4, skillImage5],

  similarOffers: [
    {
      user: {
        name: 'Мария Петрова',
        city: 'Таллин',
        age: 31,
        avatarUrl: null,
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
        avatarUrl: null,
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
        avatarUrl: null,
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
  ],
}
