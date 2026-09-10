import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/lib/constants'

import { Logo } from './Logo'

describe('Logo', () => {
  it('ведёт на главную с другой страницы', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
        <Logo />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: 'На главную' })

    expect(link).toHaveAttribute('href', ROUTES.HOME)
  })

  it('не является ссылкой на главной странице', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Logo />
      </MemoryRouter>,
    )

    expect(
      screen.queryByRole('link', {
        name: 'На главную',
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('SkillSwap')).toBeInTheDocument()
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
