import type { Meta, StoryObj } from '@storybook/react-vite'

import { ServerErrorPage } from './ServerErrorPage'

const meta = {
  title: 'Pages/ServerErrorPage',
  component: ServerErrorPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ServerErrorPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
