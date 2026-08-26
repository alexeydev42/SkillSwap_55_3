import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillTag } from './SkillTag'
import { SkillTagCategory } from '../../lib/constants'

const meta: Meta<typeof SkillTag> = {
  title: 'Entities/Skill/SkillTag',
  component: SkillTag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['languages', 'education', 'health', 'business', 'creative', 'home', 'more'],
    },
  },
}

export default meta
type Story = StoryObj<typeof SkillTag>

export const Default: Story = {
  args: {
    variant: 'business',
    label: 'Business',
  },
  render: (args) => <SkillTag {...args} />,
}

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(
        [
          'languages',
          'education',
          'health',
          'business',
          'creative',
          'home',
          'more',
        ] as SkillTagCategory[]
      ).map((category) => (
        <SkillTag
          key={category}
          variant={category}
          label={category.charAt(0).toUpperCase() + category.slice(1)}
        />
      ))}
    </div>
  ),
}

export const More: Story = {
  args: {
    variant: 'more',
    label: '+2',
  },
  render: (args) => <SkillTag {...args} />,
}
