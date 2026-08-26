import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SKILL_CATEGORIES } from '../../lib/constants'

import {
  SelectMultiCheckbox,
  type SelectMultiCheckboxOption,
} from './SelectMultiCheckbox'

const options: SelectMultiCheckboxOption[] =
  SKILL_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }))

const meta = {
  title: 'Shared/UI/SelectMultiCheckbox',
  component: SelectMultiCheckbox,
  parameters: {
    layout: 'centered',
  },
  args: {
    options,
    value: [],
    onChange: () => {},
    placeholder: 'Выберите значения',
    disabled: false,
  },
} satisfies Meta<typeof SelectMultiCheckbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(
      args.value ?? [],
    )

    return (
      <SelectMultiCheckbox
        {...args}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Навыки',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(
      args.value ?? [],
    )

    return (
      <SelectMultiCheckbox
        {...args}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const WithSelectedValues: Story = {
  args: {
    value: [
      SKILL_CATEGORIES[0],
      SKILL_CATEGORIES[1],
    ],
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(
      args.value ?? [],
    )

    return (
      <SelectMultiCheckbox
        {...args}
        value={value}
        onChange={setValue}
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Empty: Story = {
  args: {
    options: [],
  },
}
