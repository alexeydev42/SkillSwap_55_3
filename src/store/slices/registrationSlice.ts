import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RegistrationDraft } from '@/shared/types'

export interface RegistrationState {
  draft: Partial<RegistrationDraft>
}

// Задаёт пустой черновик регистрации.
const initialState: RegistrationState = {
  draft: {},
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Добавляет новые данные в черновик регистрации.
    updateDraft(state, action: PayloadAction<Partial<RegistrationDraft>>) {
      state.draft = {
        ...state.draft,
        ...action.payload,
      }
    },

    // Очищает все данные черновика регистрации.
    clearDraft(state) {
      state.draft = {}
    },
  },
})

export const { updateDraft, clearDraft } = registrationSlice.actions

export default registrationSlice.reducer
