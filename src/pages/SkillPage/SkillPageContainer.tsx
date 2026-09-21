import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { mapUserToCatalogCard } from '@/pages/CatalogPage/CatalogPage.utils'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { categories, cities } from '@/shared/config'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import { selectHasRequestToUser } from '@/store/slices/requestsSlice'
import {
  fetchUsers,
  selectEffectiveLearningSubcategoryIds,
  selectEffectiveLikesCount,
  selectSimilarUsers,
  selectUserById,
  selectUsersStatus,
} from '@/store/slices/usersSlice'
import { sendSwapRequest } from '@/store/thunks/sendSwapRequest'
import { SuccessModal } from '@/widgets/SuccessModal'

import { SkillPage } from './SkillPage'
import { mapUserToSkillPageProps } from './SkillPage.utils'

interface SkillPageLocationState {
  registrationCompleted?: boolean
}

export const SkillPageContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { userId } = useParams<{ userId: string }>()

  // Управляет модалкой завершения регистрации.
  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(() =>
    Boolean((location.state as SkillPageLocationState | null)?.registrationCompleted),
  )

  // Управляет результатом предложения обмена.
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)

  const usersStatus = useAppSelector(selectUsersStatus)

  const user = useAppSelector((state) => (userId ? selectUserById(state, userId) : null))

  // Получает актуальное «Хочу научиться» с учётом Favorites.
  const effectiveLearningSubcategoryIds = useAppSelector((state) =>
    userId ? selectEffectiveLearningSubcategoryIds(state, userId) : [],
  )

  const similarUsers = useAppSelector((state) => (userId ? selectSimilarUsers(state, userId) : []))

  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)

  // Определяет состояние сердечка открытого пользователя.
  const isFavorite = userId ? favoriteUserIds.includes(userId) : false

  // Проверяет наличие заявки выбранному пользователю.
  const hasExistingRequest = useAppSelector((state) =>
    userId ? selectHasRequestToUser(state, userId) : false,
  )

  const effectiveLikesCountByUserId = useAppSelector((state) =>
    Object.fromEntries(
      similarUsers.map((similarUser) => [
        similarUser.id,
        selectEffectiveLikesCount(state, similarUser.id),
      ]),
    ),
  )

  const effectiveLearningSubcategoryIdsByUserId = useAppSelector((state) =>
    Object.fromEntries(
      similarUsers.map((similarUser) => [
        similarUser.id,
        selectEffectiveLearningSubcategoryIds(state, similarUser.id),
      ]),
    ),
  )

  const authSession = useAppSelector((state) => state.auth.session)

  // Активную авторизацию определяет наличие сессии.
  const isAuthenticated = Boolean(authSession)
  const isOwnSkill = isAuthenticated && Boolean(userId) && authSession?.userId === userId

  // Загружает пользователей при прямом открытии SkillPage.
  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  // Закрывает модалку регистрации и очищает location state.
  const handleCloseRegistrationSuccess = () => {
    setIsRegistrationSuccessOpen(false)

    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }

  // Переключает Favorite открытого или похожего пользователя.
  const handleFavoriteClick = (targetUserId: string) => {
    if (!isAuthenticated || targetUserId === authSession?.userId) {
      return
    }

    if (favoriteUserIds.includes(targetUserId)) {
      dispatch(removeFavorite(targetUserId))
    } else {
      dispatch(addFavorite(targetUserId))
    }
  }

  // Открывает выбранное похожее предложение.
  const handleDetailsClick = (similarUserId: string) => {
    navigate(ROUTES.SKILL.replace(':userId', similarUserId))
  }

  // Создаёт заявку (и уведомление о ней, LOGIC-38) или отправляет гостя на login.
  const handleOffer = () => {
    if (!userId) {
      return
    }

    if (!isAuthenticated) {
      const destination = `${location.pathname}${location.search}${location.hash}`

      navigate(ROUTES.LOGIN, {
        state: { destination },
      })

      return
    }

    setRequestError(null)

    const isSuccess = dispatch(sendSwapRequest(userId))

    if (!isSuccess) {
      setRequestError('Не удалось сохранить заявку. Попробуйте ещё раз.')
      return
    }

    setIsRequestSuccessOpen(true)
  }

  if (!userId) {
    return <NotFoundPage />
  }

  if (!user) {
    if (usersStatus === 'idle' || usersStatus === 'loading') {
      return <div>Загрузка...</div>
    }

    return <NotFoundPage />
  }

  const skillPageProps = mapUserToSkillPageProps(
    user,
    categories,
    cities,
    effectiveLearningSubcategoryIds,
  )

  // Подготавливает карточки похожих предложений.
  const similarOffers = similarUsers.map((similarUser) => ({
    user: mapUserToCatalogCard(
      similarUser,
      categories,
      cities,
      favoriteUserIds.includes(similarUser.id),
      effectiveLikesCountByUserId[similarUser.id] ?? similarUser.likesCount,
      effectiveLearningSubcategoryIdsByUserId[similarUser.id] ?? similarUser.learningSubcategoryIds,
    ),
    isFavoriteDisabled: !isAuthenticated || similarUser.id === authSession?.userId,
    onFavoriteClick: () => handleFavoriteClick(similarUser.id),
    onDetailsClick: () => handleDetailsClick(similarUser.id),
  }))

  return (
    <>
      <SkillPage
        {...skillPageProps}
        similarOffers={similarOffers}
        isOwnSkill={isOwnSkill}
        isFavorite={isFavorite}
        isFavoriteDisabled={!isAuthenticated}
        onFavoriteClick={() => handleFavoriteClick(userId)}
        onOffer={handleOffer}
        isOfferDisabled={isOwnSkill || hasExistingRequest}
        offerText={hasExistingRequest ? 'Обмен предложен' : 'Предложить обмен'}
        requestError={requestError}
      />

      {isRegistrationSuccessOpen && (
        <SuccessModal variant="created" onDone={handleCloseRegistrationSuccess} />
      )}

      {isRequestSuccessOpen && (
        <SuccessModal variant="proposed" onDone={() => setIsRequestSuccessOpen(false)} />
      )}
    </>
  )
}
