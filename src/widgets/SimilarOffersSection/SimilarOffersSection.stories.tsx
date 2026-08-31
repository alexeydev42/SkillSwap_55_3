import type { Meta, StoryObj } from '@storybook/react-vite'

import { SimilarOffersSection } from './SimilarOffersSection'

const meta = {
  title: 'Widgets/SimilarOffersSection',
  component: SimilarOffersSection,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SimilarOffersSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {
        user: {
          name: 'Анна Петрова',
          city: 'Москва',
          age: 25,
          avatarUrl: null,
          canTeach: {
            label: 'Английский язык',
            variant: 'languages',
          },
          learnTags: [
            {
              label: 'Фотография',
              variant: 'creative',
            },
            {
              label: 'Рисование',
              variant: 'creative',
            },
          ],
        },
        onFavoriteClick: () => {},
        onDetailsClick: () => {},
      },
      {
        user: {
          name: 'Максим Иванов',
          city: 'Санкт-Петербург',
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
            {
              label: 'Музыка',
              variant: 'creative',
            },
          ],
        },
        onFavoriteClick: () => {},
        onDetailsClick: () => {},
      },
      {
        user: {
          name: 'Екатерина Смирнова',
          city: 'Казань',
          age: 28,
          avatarUrl: null,
          canTeach: {
            label: 'Рисование',
            variant: 'creative',
          },
          learnTags: [
            {
              label: 'Фотография',
              variant: 'creative',
            },
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
          avatarUrl: null,
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
  },
}
