import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { NotFoundPage } from '@/pages/NotFoundPage'
import { categories, cities } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchUsers, selectUserById, selectUsersStatus } from '@/store/slices/usersSlice'

import { SkillPage } from './SkillPage'
import { mapUserToSkillPageProps } from './SkillPage.utils'

export function SkillPageContainer() {
  const dispatch = useAppDispatch()
  const { userId } = useParams<{ userId: string }>()
  const usersStatus = useAppSelector(selectUsersStatus)
  const user = useAppSelector((state) => (userId ? selectUserById(state, userId) : null))

  // Список моковых пользователей может быть ещё не загружен, если на страницу
  // навыка зашли напрямую по ссылке (например, после F5), минуя каталог.
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  if (!userId) {
    return <NotFoundPage />
  }

  if (!user) {
    // Пока список пользователей загружается — рано показывать 404,
    // локальный пользователь при этом доступен сразу, без ожидания fetchUsers.
    if (usersStatus === 'idle' || usersStatus === 'loading') {
      return <div>Загрузка...</div>
    }

    return <NotFoundPage />
  }

  const skillPageProps = mapUserToSkillPageProps(user, categories, cities)

  // Похожие предложения не входят в LOGIC-34 — подключение SimilarOffersSection
  // к реальным данным будет отдельной задачей.
  return <SkillPage {...skillPageProps} similarOffers={[]} />
}
