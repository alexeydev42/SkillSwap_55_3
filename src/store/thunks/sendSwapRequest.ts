import { createNotificationForRequest } from '@/store/slices/notificationsSlice'
import { createSwapRequest, removeSwapRequest } from '@/store/slices/requestsSlice'
import type { AppDispatch } from '@/store'

/**
 * Создаёт заявку на обмен и связанное уведомление.
 * Если не удалось сохранить заявку или уведомление, операция считается
 * неуспешной. При ошибке уведомления уже созданная заявка откатывается.
 */
export const sendSwapRequest =
  (toUserId: string) =>
  (dispatch: AppDispatch): boolean => {
    const request = dispatch(createSwapRequest(toUserId))

    if (!request) {
      return false
    }

    const isNotificationCreated = dispatch(createNotificationForRequest(request.id))

    if (!isNotificationCreated) {
      dispatch(removeSwapRequest(request.id))
      return false
    }

    return true
  }
