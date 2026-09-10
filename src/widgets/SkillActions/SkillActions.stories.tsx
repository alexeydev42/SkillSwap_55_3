import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillActions } from './SkillActions'

const meta = {
  title: 'Widgets/SkillActions',
  component: SkillActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onFavoriteClick: () => {},
    onShare: () => {},
    onMore: () => {},
  },
} satisfies Meta<typeof SkillActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Favorite: Story = {
  args: {
    isFavorite: true,
  },
}

export const FavoriteDisabled: Story = {
  args: {
    isFavoriteDisabled: true,
  },
}

export const WithoutFavorite: Story = {
  args: {
    showFavorite: false,
  },
}
