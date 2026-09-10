import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/lib/constants'

import { AuthHeader } from './AuthHeader'

describe('AuthHeader', () => {
  it('переходит на главную страницу по кнопке «Закрыть»', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<AuthHeader />} />
          <Route path={ROUTES.HOME} element={<h1>Главная страница</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Закрыть',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Главная страница',
      }),
    ).toBeInTheDocument()
  })
})
