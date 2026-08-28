import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillDetailsButtons } from './SkillDetailsButtons';

const meta: Meta<typeof SkillDetailsButtons> = {
  title: 'Widgets/SkillDetailsButtons',
  component: SkillDetailsButtons,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['offer', 'edit'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SkillDetailsButtons>;

export const Offer: Story = {
  args: {
    mode: 'offer',
    onOffer: () => alert('Предложить обмен'),
  },
};

export const Edit: Story = {
  args: {
    mode: 'edit',
    onEdit: () => alert('Редактировать'),
    onDone: () => alert('Готово'),
  },
};

export const OfferDisabled: Story = {
  args: {
    mode: 'offer',
    disabled: true,
  },
};

export const EditDisabled: Story = {
  args: {
    mode: 'edit',
    disabled: true,
  },
};

export const BothStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#69735D' }}>Offer</span>
        <SkillDetailsButtons
          mode="offer"
          onOffer={() => alert('Предложить обмен')}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#69735D' }}>Edit / Done</span>
        <SkillDetailsButtons
          mode="edit"
          onEdit={() => alert('Редактировать')}
          onDone={() => alert('Готово')}
        />
      </div>
    </div>
  ),
};