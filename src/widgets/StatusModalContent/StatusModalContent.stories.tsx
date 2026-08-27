import type { Meta, StoryObj } from '@storybook/react-vite'

import { StatusModalContent } from './StatusModalContent'

import userCircleIcon from '@/shared/assets/icons/icon-user-circle.svg'

const meta: Meta<typeof StatusModalContent> = {
  title: 'Shared/StatusModalContent',
  component: StatusModalContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '556px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof StatusModalContent>

export const Success: Story = {
  args: {
    icon: userCircleIcon,
    title: 'Ваше предложение создано',
    text: 'Теперь вы можете предложить обмен',
    buttonText: 'Продолжить',
  },
}
