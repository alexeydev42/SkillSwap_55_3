import { STORAGE_KEYS } from './constants'

export type Theme = 'light' | 'dark'

export const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

export const saveTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}
