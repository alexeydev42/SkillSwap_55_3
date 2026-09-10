import { createNotificationForRequest } from '@/store/slices/notificationsSlice'
import { createSwapRequest } from '@/store/slices/requestsSlice'
import type { AppDispatch } from '@/store'

/**
 * Создаёт заявку на обмен и, при успехе, уведомление об этом для отправителя
 * (LOGIC-38). Если заявку создать не удалось (нет сессии, заявка самому себе,
 * дубликат, ошибка сохранения) — уведомление не создаётся. Ошибка сохранения
 * уведомления не откатывает уже созданную заявку.
 */
export const sendSwapRequest =
  (toUserId: string) =>
  (dispatch: AppDispatch): boolean => {
    const request = dispatch(createSwapRequest(toUserId))

    if (!request) {
      return false
    }

    dispatch(createNotificationForRequest(request.id))

    return true
  }
