import type { Meta, StoryObj } from '@storybook/react-vite'

import { CatalogPage } from './CatalogPage'
import { catalogPageMock } from './CatalogPage.mock'

const catalogPageViewports = {
  catalogPage: {
    name: 'CatalogPage 1440 × 1372',
    styles: {
      width: '1440px',
      height: '1372px',
    },
    type: 'desktop',
  },
} as const

const meta = {
  title: 'Pages/CatalogPage',
  component: CatalogPage,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: catalogPageViewports,
    },
  },
  globals: {
    viewport: {
      value: 'catalogPage',
      isRotated: false,
    },
  },
} satisfies Meta<typeof CatalogPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: catalogPageMock,
}
