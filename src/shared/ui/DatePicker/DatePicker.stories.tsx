import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { DataPicker } from './DatePicker'

const meta = {
  title: 'Shared/UI/DatePicker',
  component: DataPicker,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Дата рождения',
    placeholder: 'ДД.ММ.ГГГГ',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Дата рождения',
    selected: new Date(2026, 7, 24),
  },
}

export const Open: Story = {
  parameters: {
    layout:'padded',
  },
  args: {
    label: 'Дата рождения',
    selected: new Date(2026, 7, 24),
    open: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Дата рождения',
    error: 'Введите корректную дату',
  },
}

export const HelperText: Story = {
  args: {
    label: 'Дата рождения',
    helperText: 'Укажите дату рождения',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Дата рождения',
    selected: new Date(2026, 7, 24),
    disabled: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)

    return (
      <DataPicker
        label="Дата рождения"
        placeholder="ДД.ММ.ГГГГ"
        selected={date}
        onChange={setDate}
      />
    )
  },
}
