import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillTag } from './SkillTag'
import { SkillCategory } from '../../lib/constants'

const meta: Meta<typeof SkillTag> = {
  title: 'Shared/UI/SkillTag',
  component: SkillTag,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof SkillTag>

export const Default: Story = {
  args: {
    category: SkillCategory.BUSINESS,
  },
  render: (args) => (
    <div
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
      }}
    >
      <SkillTag {...args} />
    </div>
  ),
}

export const AllCategories: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
      }}
    >
      {Object.values(SkillCategory).map((category) => (
        <SkillTag key={category} category={category} />
      ))}
    </div>
  ),
}

export const WithCustomLabel: Story = {
  args: {
    category: SkillCategory.EDUCATION,
    label: 'Обучение',
  },
  render: (args) => (
    <div
      style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '12px',
      }}
    >
      <SkillTag {...args} />
    </div>
  ),
}
