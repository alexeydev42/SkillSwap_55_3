import { beforeEach, describe, expect, it } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/shared/lib/constants'
import { store } from '@/store'
import { resetRegistrationDraft, updateStep3Draft } from '@/store/slices/registrationSlice'

import { RegistrationStep3 } from './RegistrationStep3'

const savedOfferedSkill = {
  title: 'Видеомонтаж',
  categoryId: 'creativity-art',
  subcategoryId: 'video-editing',
  description: 'Научу базовым приёмам видеомонтажа',
  imageUrls: ['data:image/png;base64,c2F2ZWQ='],
}

const renderRegistrationStep3 = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.REGISTER_STEP_3]}>
        <Routes>
          <Route path={ROUTES.REGISTER_STEP_2} element={<div>Второй шаг</div>} />
          <Route path={ROUTES.REGISTER_STEP_3} element={<RegistrationStep3 />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('RegistrationStep3', () => {
  beforeEach(() => {
    store.dispatch(resetRegistrationDraft())
  })

  it('показывает ошибки и не сохраняет draft без обязательных данных', async () => {
    const user = userEvent.setup()

    renderRegistrationStep3()

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText('Название навыка: обязательное поле')).toBeInTheDocument()
    expect(screen.getByText('Категория навыка: выберите значение из списка')).toBeInTheDocument()
    expect(screen.getByText('Подкатегория навыка: выберите значение из списка')).toBeInTheDocument()
    expect(screen.getByText('Описание навыка: обязательное поле')).toBeInTheDocument()
    expect(screen.getByText('Необходимо выбрать хотя бы одно изображение')).toBeInTheDocument()
    expect(store.getState().registration.draft).toEqual({})
  })

  it('сохраняет валидное предлагаемое умение в draft', async () => {
    const user = userEvent.setup()
    const { container } = renderRegistrationStep3()

    await user.type(screen.getByLabelText('Название навыка'), 'Видеомонтаж')

    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Творчество и искусство'))

    await user.click(screen.getByLabelText('Подкатегория навыка'))
    await user.click(screen.getByText('Видеомонтаж'))

    await user.type(
      screen.getByPlaceholderText('Коротко опишите, чему можете научить'),
      'Научу базовым приёмам видеомонтажа',
    )

    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')

    expect(fileInput).not.toBeNull()

    const image = new File(['skill image'], 'skill.png', {
      type: 'image/png',
    })

    await user.upload(fileInput as HTMLInputElement, image)

    await waitFor(() => {
      expect(screen.getByAltText('Превью изображения 1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    const offeredSkill = store.getState().registration.draft.offeredSkill

    expect(offeredSkill).toEqual({
      title: 'Видеомонтаж',
      categoryId: 'creativity-art',
      subcategoryId: 'video-editing',
      description: 'Научу базовым приёмам видеомонтажа',
      imageUrls: [expect.stringMatching(/^data:image\/png;base64,/)],
    })

    expect(offeredSkill?.imageUrls[0]).toMatch(/^data:image\/png;base64,/)
  })

  it('сбрасывает неподходящую подкатегорию при смене категории', async () => {
    const user = userEvent.setup()

    store.dispatch(
      updateStep3Draft({
        offeredSkill: savedOfferedSkill,
      }),
    )

    renderRegistrationStep3()

    expect(screen.getByLabelText('Подкатегория навыка')).toHaveTextContent('Видеомонтаж')

    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Иностранные языки'))

    expect(screen.getByLabelText('Подкатегория навыка')).toHaveTextContent(
      'Выберите подкатегорию навыка',
    )

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText('Подкатегория навыка: выберите значение из списка')).toBeInTheDocument()
  })

  it('показывает ошибку при попытке загрузить больше пяти изображений', async () => {
    const user = userEvent.setup()
    const { container } = renderRegistrationStep3()

    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')

    expect(fileInput).not.toBeNull()

    const images = Array.from({ length: 6 }, (_, index) => {
      return new File([`image ${index + 1}`], `skill-${index + 1}.png`, {
        type: 'image/png',
      })
    })

    await user.upload(fileInput as HTMLInputElement, images)

    expect(screen.getByText('Можно загрузить не более 5 изображений')).toBeInTheDocument()
    expect(screen.queryByAltText('Превью изображения 1')).not.toBeInTheDocument()
  })

  it('восстанавливает draft и сохраняет изменения при возврате на Step 2', async () => {
    const user = userEvent.setup()

    store.dispatch(
      updateStep3Draft({
        offeredSkill: savedOfferedSkill,
      }),
    )

    renderRegistrationStep3()

    expect(screen.getByLabelText('Название навыка')).toHaveValue('Видеомонтаж')
    expect(screen.getByPlaceholderText('Коротко опишите, чему можете научить')).toHaveValue(
      'Научу базовым приёмам видеомонтажа',
    )
    expect(screen.getByAltText('Превью изображения 1')).toBeInTheDocument()

    const titleInput = screen.getByLabelText('Название навыка')

    await user.clear(titleInput)
    await user.type(titleInput, 'Монтаж видео')
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText('Второй шаг')).toBeInTheDocument()
    expect(store.getState().registration.draft.offeredSkill).toEqual({
      ...savedOfferedSkill,
      title: 'Монтаж видео',
    })
  })

  it('позволяет последовательно добавлять и удалять изображения', async () => {
    const user = userEvent.setup()
    const { container } = renderRegistrationStep3()

    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')

    expect(fileInput).not.toBeNull()

    await user.upload(
      fileInput as HTMLInputElement,
      new File(['first'], 'first.png', {
        type: 'image/png',
      }),
    )

    await screen.findByAltText('Превью изображения 1')

    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument()

    await user.upload(
      fileInput as HTMLInputElement,
      new File(['second'], 'second.png', {
        type: 'image/png',
      }),
    )

    await screen.findByAltText('Превью изображения 2')

    expect(screen.getAllByAltText(/Превью изображения/)).toHaveLength(2)

    await user.click(
      screen.getByRole('button', {
        name: 'Удалить изображение 1',
      }),
    )

    expect(screen.getAllByAltText(/Превью изображения/)).toHaveLength(1)
  })
})
