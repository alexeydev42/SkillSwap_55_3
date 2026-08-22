import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
    title: 'shared/ui/RadioButton',
    component: RadioButton,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
    args: {
        label: 'Хочу научиться',
        name: 'role',
        value: 'learn',
    },
};

export const Checked: Story = {
    args: {
        label: 'Всё',
        name: 'role',
        value: 'all',
        checked: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Могу научить',
        name: 'role',
        value: 'teach',
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Отключено, но выбрано',
        name: 'role',
        value: 'disabled-checked',
        checked: true,
        disabled: true,
    },
};

export const RadioGroup: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RadioButton label="Всё" name="role" value="all" defaultChecked />
            <RadioButton label="Хочу научиться" name="role" value="learn" />
            <RadioButton label="Могу научить" name="role" value="teach" />
        </div>
    ),
};