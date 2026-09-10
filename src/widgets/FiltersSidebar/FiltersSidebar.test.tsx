import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_CATALOG_FILTERS, FiltersSidebar, type FiltersSidebarProps } from './FiltersSidebar'

const categories: FiltersSidebarProps['categories'] = [
  {
    id: 'business',
    name: 'Бизнес и карьера',
    subcategories: [
      {
        id: 'management',
        name: 'Управление командой',
      },
      {
        id: 'marketing',
        name: 'Маркетинг',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Творчество и искусство',
    subcategories: [
      {
        id: 'drawing',
        name: 'Рисование и иллюстрация',
      },
      {
        id: 'photography',
        name: 'Фотография',
      },
    ],
  },
]

const cities: FiltersSidebarProps['cities'] = [
  {
    id: 'moscow',
    name: 'Москва',
  },
]

const renderFiltersSidebar = () => {
  const onChange = vi.fn()

  render(
    <FiltersSidebar
      categories={categories}
      cities={cities}
      filters={EMPTY_CATALOG_FILTERS}
      onChange={onChange}
    />,
  )

  return { onChange }
}

describe('FiltersSidebar — раскрытие категорий', () => {
  it('раскрывает и сворачивает отдельную категорию', () => {
    renderFiltersSidebar()

    expect(screen.queryByText('Управление командой')).not.toBeInTheDocument()
    expect(screen.queryByText('Рисование и иллюстрация')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Бизнес и карьера'))

    expect(screen.getByText('Управление командой')).toBeInTheDocument()
    expect(screen.getByText('Маркетинг')).toBeInTheDocument()
    expect(screen.queryByText('Рисование и иллюстрация')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Бизнес и карьера'))

    expect(screen.queryByText('Управление командой')).not.toBeInTheDocument()
    expect(screen.queryByText('Маркетинг')).not.toBeInTheDocument()
  })

  it('по кнопке «Все категории» раскрывает все группы', () => {
    renderFiltersSidebar()

    const showAllButton = screen.getByRole('button', {
      name: 'Все категории',
    })

    expect(showAllButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(showAllButton)

    expect(screen.getByText('Управление командой')).toBeInTheDocument()
    expect(screen.getByText('Маркетинг')).toBeInTheDocument()
    expect(screen.getByText('Рисование и иллюстрация')).toBeInTheDocument()
    expect(screen.getByText('Фотография')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Свернуть',
      }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('повторным нажатием сворачивает все категории', () => {
    renderFiltersSidebar()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Все категории',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Свернуть',
      }),
    )

    expect(screen.queryByText('Управление командой')).not.toBeInTheDocument()
    expect(screen.queryByText('Маркетинг')).not.toBeInTheDocument()
    expect(screen.queryByText('Рисование и иллюстрация')).not.toBeInTheDocument()
    expect(screen.queryByText('Фотография')).not.toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Все категории',
      }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('раскрытие категорий не изменяет выбранные фильтры', () => {
    const { onChange } = renderFiltersSidebar()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Все категории',
      }),
    )

    expect(onChange).not.toHaveBeenCalled()
  })
})
