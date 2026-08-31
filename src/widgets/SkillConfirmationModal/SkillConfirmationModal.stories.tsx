import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillConfirmationModal } from './SkillConfirmationModal'

const meta = {
  title: 'Widgets/SkillConfirmationModal',
  component: SkillConfirmationModal,
  tags: ['autodocs'],
} satisfies Meta<typeof SkillConfirmationModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200',
    ],
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
    subcategory: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры',
  },
}
