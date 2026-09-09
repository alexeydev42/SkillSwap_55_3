import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { NotFoundPage } from '@/pages/NotFoundPage'
import { categories, cities } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchUsers, selectUserById, selectUsersStatus } from '@/store/slices/usersSlice'

import { SkillPage } from './SkillPage'
import { mapUserToSkillPageProps } from './SkillPage.utils'

import DoneIcon from '@/shared/assets/icons/icon-done.svg?react'
import { Modal } from '@/shared/ui/Modal'
import { StatusModalContent } from '@/widgets/StatusModalContent'

interface SkillPageLocationState {
  registrationCompleted?: boolean
}

export function SkillPageContainer() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(() =>
    Boolean((location.state as SkillPageLocationState | null)?.registrationCompleted),
  )
  const dispatch = useAppDispatch()
  const { userId } = useParams<{ userId: string }>()
  const usersStatus = useAppSelector(selectUsersStatus)
  const user = useAppSelector((state) => (userId ? selectUserById(state, userId) : null))

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

  const handleCloseRegistrationSuccess = () => {
    setIsRegistrationSuccessOpen(false)

    // Удаляем одноразовый флаг из текущей записи истории.
    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }

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
  return (
    <>
      <SkillPage
        {...skillPageProps}
        similarOffers={[]}
        isAuth={Boolean(authSession && authAccount)}
        authUser={
          currentUser
            ? {
                userName: currentUser.name,
                avatarSrc: currentUser.avatarUrl ?? '',
              }
            : undefined
        }
      />

      {isRegistrationSuccessOpen && (
        <Modal>
          <StatusModalContent
            icon={<DoneIcon />}
            title="Ваше предложение создано"
            text="Теперь вы можете предложить обмен"
            buttonText="Готово"
            onButtonClick={handleCloseRegistrationSuccess}
          />
        </Modal>
      )}
    </>
  )
}
