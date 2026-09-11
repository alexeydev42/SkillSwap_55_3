import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PersonalDataSection, type PersonalData } from './PersonalDataSection'

const testData: PersonalData = {
  email: 'user@example.com',
  name: 'Мария',
  birthDate: new Date(1995, 9, 28),
  gender: 'female',
  city: 'Москва',
  about: 'Люблю путешествовать',
  avatar: undefined,
}

describe('PersonalDataSection', () => {
  it('отображает текущие значения полей', () => {
    render(<PersonalDataSection data={testData} />)

    expect(screen.getByDisplayValue('user@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Мария')).toBeInTheDocument()
  })

  it('вызывает onSave с изменённым значением имени после успешной валидации', () => {
    const handleSave = vi.fn()
    render(<PersonalDataSection data={testData} onSave={handleSave} />)

    const saveButton = screen.getByRole('button', { name: 'Сохранить' })

    expect(saveButton).toBeDisabled()

    fireEvent.change(screen.getByDisplayValue('Мария'), {
      target: { value: 'Мария Иванова' },
    })

    expect(saveButton).toBeEnabled()

    fireEvent.click(saveButton)

    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Мария Иванова',
        email: testData.email,
      }),
    )
  })

  it('не вызывает onSave и показывает ошибку, если имя стало пустым', () => {
    const handleSave = vi.fn()
    render(<PersonalDataSection data={testData} onSave={handleSave} />)

    fireEvent.change(screen.getByDisplayValue('Мария'), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(handleSave).not.toHaveBeenCalled()
    expect(screen.getByText('Имя: обязательное поле')).toBeInTheDocument()
  })

  it('вызывает onChangePassword при клике на ссылку «Изменить пароль»', () => {
    const handleChangePassword = vi.fn()
    render(<PersonalDataSection data={testData} onChangePassword={handleChangePassword} />)

    fireEvent.click(screen.getByRole('button', { name: 'Изменить пароль' }))

    expect(handleChangePassword).toHaveBeenCalledTimes(1)
  })

  it('блокирует сохранение, пока данные не изменены', () => {
    const handleSave = vi.fn()

    render(<PersonalDataSection data={testData} onSave={handleSave} />)

    const emailInput = screen.getByDisplayValue('user@example.com')
    const saveButton = screen.getByRole('button', { name: 'Сохранить' })

    expect(emailInput).toBeDisabled()
    expect(saveButton).toBeDisabled()

    fireEvent.click(saveButton)

    expect(handleSave).not.toHaveBeenCalled()
  })
})
