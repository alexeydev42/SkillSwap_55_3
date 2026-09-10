import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/lib/constants'

import { Logo } from './Logo'

describe('Logo', () => {
  it('ведёт на главную страницу', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'На главную' })
    expect(link).toHaveAttribute('href', ROUTES.HOME)
  })

  it('отображает название сервиса', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>,
    )

    expect(screen.getByText('SkillSwap')).toBeInTheDocument()
  })
})
