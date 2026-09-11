import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthSession, Notification, SwapRequest, User } from '@/shared/types'
import { selectAllUsers } from '@/store/slices/usersSlice'
import type { AppDispatch, RootState } from '@/store'

export interface NotificationsState {
  items: Notification[]
  // Сообщение об ошибке последней попытки сохранить уведомление.
  error: string | null
}

// Возвращает id заявок, отправленных пользователем userId (по данным из localStorage).
const getOwnRequestIds = (userId: string): Set<string> => {
  const storedRequests = storageService.get<SwapRequest[]>(STORAGE_KEYS.REQUESTS) ?? []

  return new Set(
    storedRequests.filter((request) => request.fromUserId === userId).map((request) => request.id),
  )
}

// Оставляет только уведомления по заявкам, отправленным самим userId —
// у Notification нет собственного userId, поэтому принадлежность
// определяется через связанную заявку (SwapRequest.fromUserId).
const getOwnNotifications = (userId: string): Notification[] => {
  const ownRequestIds = getOwnRequestIds(userId)
  const storedNotifications = storageService.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) ?? []

  return storedNotifications.filter((notification) => ownRequestIds.has(notification.requestId))
}

// Восстанавливает уведомления текущего пользователя после F5 при активной сессии.
const getStoredNotifications = (): Notification[] => {
  const session = storageService.get<AuthSession>(STORAGE_KEYS.AUTH_SESSION)

  if (!session) {
    return []
  }

  return getOwnNotifications(session.userId)
}

const initialState: NotificationsState = {
  items: getStoredNotifications(),
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Заменяет активный список уведомлений (используется при восстановлении).
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload
    },

    // Добавляет уже сохранённое в localStorage уведомление.
    addNotificationToState(state, action: PayloadAction<Notification>) {
      state.items.push(action.payload)
    },

    // Переводит все уведомления в isRead: true.
    markAllAsRead(state) {
      state.items.forEach((notification) => {
        notification.isRead = true
      })
    },

    // Удаляет только просмотренные уведомления, requests не затрагивает.
    clearReadNotifications(state) {
      state.items = state.items.filter((notification) => !notification.isRead)
    },

    // Очищает только активное состояние Redux (используется при logout).
    clearNotifications(state) {
      state.items = []
    },

    // Сохраняет или сбрасывает сообщение об ошибке последнего сохранения.
    setNotificationsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const {
  setNotifications,
  addNotificationToState,
  markAllAsRead,
  clearReadNotifications,
  clearNotifications,
  setNotificationsError,
} = notificationsSlice.actions

/**
 * Создаёт уведомление для успешно созданной заявки (requestId уже существует
 * в requests). Сначала сохраняет обновлённый список в localStorage и только
 * при успехе добавляет уведомление в Redux — при ошибке сохранения запись
 * не появляется в Redux, requestId (сама заявка) при этом не откатывается,
 * а в state.notifications.error попадает сообщение об ошибке.
 */
export const createNotificationForRequest =
  (requestId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const notification: Notification = { requestId, isRead: false }
    const updatedNotifications = [...getState().notifications.items, notification]

    const isSaved = storageService.set(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications)

    if (!isSaved) {
      dispatch(setNotificationsError('Не удалось сохранить уведомление.'))
      return false
    }

    dispatch(addNotificationToState(notification))
    dispatch(setNotificationsError(null))

    return true
  }

// Восстанавливает уведомления текущего пользователя после login.
export const restoreNotifications =
  () =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const currentUserId = getState().auth.session?.userId

    if (!currentUserId) {
      dispatch(setNotifications([]))
      return
    }

    dispatch(setNotifications(getOwnNotifications(currentUserId)))
  }

// Возвращает активные уведомления текущего пользователя.
export const selectNotifications = (state: RootState) => state.notifications.items

// Уведомление для отображения: текст и дата не хранятся — дата берётся из
// заявки (SwapRequest.createdAt), а получатель (toUser) — из users, чтобы
// собрать текст вида «Вы предложили обмен пользователю {toUser.name}».
export interface NotificationView {
  requestId: string
  isRead: boolean
  createdAt: string
  toUser: User
}

/**
 * Собирает уведомления для показа в интерфейсе: подтягивает связанную
 * заявку и пользователя-получателя. Уведомление, для которого не нашлась
 * заявка или пользователь-получатель, в выдачу не включается.
 */
export const selectVisibleNotifications = createSelector(
  [selectNotifications, (state: RootState) => state.requests.items, selectAllUsers],
  (notifications, requests, users): NotificationView[] => {
    const requestsById = new Map(requests.map((request) => [request.id, request]))

    const usersById = new Map(users.map((user) => [user.id, user]))

    // Собирает только валидные уведомления.
    const visibleNotifications = notifications.flatMap((notification) => {
      const request = requestsById.get(notification.requestId)

      if (!request) {
        return []
      }

      const toUser = usersById.get(request.toUserId)

      if (!toUser) {
        return []
      }

      return [
        {
          requestId: notification.requestId,
          isRead: notification.isRead,
          createdAt: request.createdAt,
          toUser,
        },
      ]
    })

    // Показывает новые уведомления первыми.
    return visibleNotifications.sort(
      (firstNotification, secondNotification) =>
        Date.parse(secondNotification.createdAt) - Date.parse(firstNotification.createdAt),
    )
  },
)

export default notificationsSlice.reducer
