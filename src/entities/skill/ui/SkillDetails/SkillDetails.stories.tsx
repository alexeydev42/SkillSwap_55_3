import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillDetails } from './SkillDetails'

const meta: Meta<typeof SkillDetails> = {
  title: 'entities/Skill/SkillDetails',
  component: SkillDetails,
  argTypes: {
    title: {
      control: 'text',
      description: 'Название навыка',
    },
    category: {
      control: 'text',
      description: 'Категория навыка',
    },
    subcategory: {
      control: 'text',
      description: 'Подкатегория навыка',
    },
    description: {
      control: 'text',
      description: 'Описание навыка',
    },
  },
}

export default meta
type Story = StoryObj<typeof SkillDetails>

export const Default: Story = {
  args: {
    title: 'React Development',
    category: 'Frontend',
    subcategory: 'JavaScript Frameworks',
    description:
      'Разработка пользовательских интерфейсов с использованием React, включая работу с хуками, контекстом и оптимизацией производительности.',
  },
}

export const WithLongDescription: Story = {
  args: {
    title: 'Machine Learning',
    category: 'Data Science',
    subcategory: 'Artificial Intelligence',
    description:
      'Проектирование, разработка и внедрение моделей машинного обучения в production-среду. Включает работу с Python, TensorFlow, PyTorch, оптимизацию моделей, создание пайплайнов обработки данных и мониторинг производительности моделей в реальном времени. Опыт работы с большими объемами данных и распределенными вычислениями.',
  },
}
