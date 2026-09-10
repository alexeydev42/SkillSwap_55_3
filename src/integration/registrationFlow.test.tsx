import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/shared/lib/constants'
import { store } from '@/store'
import { clearAuthSession } from '@/store/slices/authSlice'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import { clearNotifications } from '@/store/slices/notificationsSlice'
import { resetRegistrationDraft, updateStep2Draft } from '@/store/slices/registrationSlice'
import { clearRequests } from '@/store/slices/requestsSlice'
import { clearLocalUser } from '@/store/slices/usersSlice'

import { RegistrationStep1 } from '@/pages/RegistrationStep1'
import { RegistrationStep2 } from '@/pages/RegistrationStep2'
import { RegistrationStep3 } from '@/pages/RegistrationStep3'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'

// Данные второго шага заполняем через draft заранее — виджеты выбора
// даты/пола/города уже отдельно проверены в RegistrationStep2.test.tsx.
// Здесь важна не их механика, а реальный переход между тремя страницами.
const step2Draft = {
  name: 'Интеграционный Пользователь',
  birthDate: '1993-04-15',
  gender: 'preferNotToSay' as const,
  cityId: 'saint-petersburg',
  avatarUrl: null,
  learningSubcategoryIds: ['english'],
}

const renderRegistrationJourney = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.REGISTER]}>
        <HeaderContainer />
        <Routes>
          <Route path={ROUTES.REGISTER} element={<RegistrationStep1 />} />
          <Route path={ROUTES.REGISTER_STEP_2} element={<RegistrationStep2 />} />
          <Route path={ROUTES.REGISTER_STEP_3} element={<RegistrationStep3 />} />
          <Route path={ROUTES.SKILL} element={<div>Страница навыка</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('Интеграция: регистрация в 3 шага', () => {
  beforeEach(() => {
    window.localStorage.clear()
    store.dispatch(resetRegistrationDraft())
    store.dispatch(clearLocalUser())
    store.dispatch(clearAuthSession())
    store.dispatch(clearFavorites())
    store.dispatch(clearRequests())
    store.dispatch(clearNotifications())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('проходит все 3 шага через реальную навигацию и попадает в приложение авторизованным пользователем', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000099',
    )

    store.dispatch(updateStep2Draft(step2Draft))

    renderRegistrationJourney()

    // До регистрации Header показывает гостя.
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()

    // Step 1: реальная страница, реальный переход на Step 2.
    await user.type(screen.getByLabelText('Email'), 'integration@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'Password1!')
    await user.click(screen.getByRole('button', { name: 'Далее' }))

    expect(screen.getByLabelText('Имя')).toHaveValue(step2Draft.name)

    // Step 2: данные уже подставлены из draft — подтверждаем переход на Step 3.
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    // Step 3: реальная страница — заполняем предлагаемый навык.
    await user.type(screen.getByLabelText('Название навыка'), 'Видеомонтаж')

    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Творчество и искусство'))

    await user.click(screen.getByLabelText('Подкатегория навыка'))
    await user.click(screen.getByText('Видеомонтаж'))

    await user.type(
      screen.getByPlaceholderText('Коротко опишите, чему можете научить'),
      'Научу базовым приёмам видеомонтажа',
    )

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
    expect(fileInput).not.toBeNull()

    await user.upload(
      fileInput as HTMLInputElement,
      new File(['skill image'], 'skill.png', { type: 'image/png' }),
    )

    await waitFor(() => {
      expect(screen.getByAltText('Превью изображения 1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByRole('heading', { name: 'Ваше предложение' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    // Регистрация завершена: реальная навигация на страницу навыка нового пользователя.
    expect(screen.getByText('Страница навыка')).toBeInTheDocument()

    expect(store.getState().auth.session).toEqual({
      userId: '00000000-0000-4000-8000-000000000099',
    })
    expect(store.getState().users.localUser?.name).toBe(step2Draft.name)

    // Header теперь показывает авторизованного пользователя, а не гостя.
    expect(screen.getByRole('button', { name: new RegExp(step2Draft.name) })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Войти' })).not.toBeInTheDocument()
  })
})
