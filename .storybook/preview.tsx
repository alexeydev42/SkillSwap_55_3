import type { Preview } from '@storybook/react-vite'

import { StoreProvider } from '../src/app/providers/StoreProvider'
import '../src/app/styles/global.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <StoreProvider>
        <Story />
      </StoreProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
