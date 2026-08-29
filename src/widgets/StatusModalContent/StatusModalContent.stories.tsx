import type { Meta, StoryObj } from '@storybook/react-vite'

import { StatusModalContent } from './StatusModalContent'

import userCircleIcon from '@/shared/assets/icons/icon-user-circle.svg'
import { Modal } from '@/shared/ui/Modal'
import styles from './StatusModalContent.module.css'

const meta: Meta<typeof StatusModalContent> = {
  title: 'Shared/StatusModalContent',
  component: StatusModalContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '556px',
          padding: '20px 60px',
          // выделил цветом фон для видимости
          backgroundColor: '#fffff8',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof StatusModalContent>

export const Success: Story = {
  args: {
    src: userCircleIcon,
    title: 'Ваше предложение создано',
    text: 'Теперь вы можете предложить обмен',
    buttonText: 'Продолжить',
    onButtonClick: () => {},
  },
}

export const WithoutIcon: Story = {
  args: {
    src: 'wrongIcon.svg',
    title: 'Ваше предложение создано',
    text: 'Теперь вы можете предложить обмен',
    buttonText: 'Продолжить',
    onButtonClick: () => {},
  },
}

export const WithContent: Story = {
  render: () => (
    <Modal className={styles['modal__sizes']}>
      <StatusModalContent src={''} title='Some Title'
      text='Some text. Some text. Some text. '
      buttonText='Button Text'
      onButtonClick={() => {}} />
    </Modal>
  ),
}
