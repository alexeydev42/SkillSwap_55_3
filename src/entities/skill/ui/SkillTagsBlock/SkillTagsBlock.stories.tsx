import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillTagsBlock } from './SkillTagsBlock.tsx'

const meta: Meta<typeof SkillTagsBlock> = {
  title: 'Entities/Skill/SkillTagsBlock',
  component: SkillTagsBlock,
  argTypes: {
    maxVisibleTags: {
      control: 'number',
      description: 'Максимальное количество видимых тегов',
      defaultValue: 2,
    },
  },
}

export default meta
type Story = StoryObj<typeof SkillTagsBlock>

export const Default: Story = {
  args: {
    canTeach: {
      variant: 'languages',
      label: 'Английский язык',
    },
    wantsToLearn: [
      { variant: 'creative', label: 'Рисование' },
      { variant: 'business', label: 'Маркетинг' },
    ],
  },
}

export const WithManyTags: Story = {
  args: {
    canTeach: {
      variant: 'education',
      label: 'Математика',
    },
    wantsToLearn: [
      { variant: 'languages', label: 'Испанский' },
      { variant: 'creative', label: 'Фотография' },
      { variant: 'business', label: 'Финансы' },
      { variant: 'health', label: 'Медитация' },
      { variant: 'home', label: 'Садоводство' },
      { variant: 'more', label: 'Программирование' },
      { variant: 'education', label: 'История' },
    ],
  },
}

export const WithNoTags: Story = {
  args: {
    canTeach: {
      variant: 'business',
      label: 'Управление проектами',
    },
    wantsToLearn: [],
  },
}
