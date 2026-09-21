import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from './constants'
import { getInitialTheme } from './theme'

describe('getInitialTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('использует сохранённую тему вместо системной', () => {
    window.localStorage.setItem(STORAGE_KEYS.THEME, 'light')

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
      }),
    )

    expect(getInitialTheme()).toBe('light')
  })

  it('использует системную тёмную тему, если пользователь ещё не выбирал тему', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
      }),
    )

    expect(getInitialTheme()).toBe('dark')
  })

  it('использует светлую тему, если системная тема светлая', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
      }),
    )

    expect(getInitialTheme()).toBe('light')
  })
})
