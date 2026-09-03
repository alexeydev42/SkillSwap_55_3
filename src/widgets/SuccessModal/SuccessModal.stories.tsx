import type { Meta, StoryObj } from '@storybook/react-vite'
import { SuccessModal } from './SuccessModal'

const meta = {
  title: 'Widgets/SuccessModal',
  component: SuccessModal,
  tags: ['autodocs'],
} satisfies Meta<typeof SuccessModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onDone: () => console.log('Готово'),
  },
}
