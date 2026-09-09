import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { NotFoundPage } from '@/pages/NotFoundPage'
import { categories, cities } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchUsers,
  selectUserById,
  selectUsersStatus,
  selectSimilarUsers,
} from '@/store/slices/usersSlice'
import { mapUserToCatalogCard } from '../CatalogPage/CatalogPage.utils'
import { SkillPage } from './SkillPage'
import { mapUserToSkillPageProps } from './SkillPage.utils'
import { selectFavoriteUserIds, addFavorite, removeFavorite } from '@/store/slices/favoritesSlice'

export function SkillPageContainer() {
  const dispatch = useAppDispatch()
  const navigate =useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const usersStatus = useAppSelector(selectUsersStatus)
  const user = useAppSelector((state) => (userId ? selectUserById(state, userId) : null))

  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)
  const similarUsers = useAppSelector((state) => (userId ? selectSimilarUsers(state, userId) : []))

  const authSession = useAppSelector((state) => state.auth.session)
  const authAccount = useAppSelector((state) => state.auth.account)

  const currentUser = useAppSelector((state) =>
    authSession ? selectUserById(state, authSession.userId) : null,
  )

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

    const similarOffers = similarUsers.map((similarUser) =>
      mapUserToCatalogCard(
      similarUser,
      categories,
      cities,
      favoriteUserIds.includes(similarUser.id),
      similarUser.likesCount,
      similarUser.learningSubcategoryIds,
    ),
      )
    const handleFavoriteClick =(similarUserId: string) => {
      if(favoriteUserIds.includes(similarUserId)){
        dispatch(removeFavorite(similarUserId))
      } else {
        dispatch(addFavorite(similarUserId))
      }
    }
    const handleDetailsClick = (similarUserId: string)=>{
    navigate(`/skill/${similarUserId}`)
  }
const similarOffersWithActions = similarOffers.map((offer)=>({
  user: offer,
  onFavoriteClick: () => {
      handleFavoriteClick(offer.id)
    },

  onDetailsClick: () => {
      handleDetailsClick(offer.id)
    },
}))

  // Похожие предложения не входят в LOGIC-34 — подключение SimilarOffersSection
  // к реальным данным будет отдельной задачей.
  return (
    <SkillPage
      {...skillPageProps}
      similarOffers={similarOffersWithActions}
      // 3. Передаем в шапку данные текущего пользователя, а не просматриваемого
      isAuth={!!authSession && !!authAccount}
      authUser={
        currentUser
          ? {
              userName: currentUser.name,
              avatarSrc: currentUser.avatarUrl ?? '',
            }
          : undefined
      }
    />
  )
}
