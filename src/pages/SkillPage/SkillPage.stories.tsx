import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillPage } from './SkillPage'
import { skillPageMock } from './SkillPage.mock'

const meta = {
  title: 'Pages/SkillPage',
  component: SkillPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SkillPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: skillPageMock,
}
