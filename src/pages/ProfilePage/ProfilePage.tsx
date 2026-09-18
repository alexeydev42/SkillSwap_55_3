import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { mapUserToCatalogCard } from '@/pages/CatalogPage/CatalogPage.utils'
import { categories, cities } from '@/shared/config'
import { ROUTES } from '@/shared/lib/constants'
import { Spinner } from '@/shared/ui/Spinner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import {
  fetchUsers,
  selectEffectiveLearningSubcategoryIds,
  selectEffectiveLikesCount,
  selectFavoriteUsers,
  selectUsersStatus,
} from '@/store/slices/usersSlice'
import { ChangePasswordModal } from '@/widgets/ChangePasswordModal'
import { FavoritesSection } from '@/widgets/FavoritesSection'
import { Footer } from '@/widgets/Footer'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'
import { PersonalDataSectionContainer } from '@/widgets/PersonalDataSection'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'

import styles from './ProfilePage.module.css'

export type ProfileTab = 'favorites' | 'personal'

export interface ProfilePageProps {
  /** Начальная вкладка страницы профиля. */
  initialTab?: ProfileTab
}

const DEFAULT_TAB: ProfileTab = 'personal'

export default function ProfilePage({ initialTab = DEFAULT_TAB }: ProfilePageProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Получает id текущего пользователя.
  const currentUserId = useAppSelector((state) => state.auth.session?.userId ?? null)

  // Получает Favorites и связанных пользователей из Redux.
  const favoriteUsers = useAppSelector(selectFavoriteUsers)
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)
  const usersStatus = useAppSelector(selectUsersStatus)

  // Хранит выбранную вкладку профиля и состояние модального окна.
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  // Получает актуальный likesCount для каждой карточки.
  const effectiveLikesCountByUserId = useAppSelector((state) =>
    Object.fromEntries(
      favoriteUsers.map((user) => [user.id, selectEffectiveLikesCount(state, user.id)]),
    ),
  )

  // Получает актуальный список изучаемых навыков.
  const effectiveLearningSubcategoryIdsByUserId = useAppSelector((state) =>
    Object.fromEntries(
      favoriteUsers.map((user) => [user.id, selectEffectiveLearningSubcategoryIds(state, user.id)]),
    ),
  )

  // Загружает общий список пользователей при открытии Favorites.
  useEffect(() => {
    if (activeTab === 'favorites' && usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [activeTab, dispatch, usersStatus])

  // Преобразует избранных пользователей в данные карточек.
  const favoriteCards = useMemo(
    () =>
      favoriteUsers.map((user) =>
        mapUserToCatalogCard(
          user,
          categories,
          cities,
          favoriteUserIds.includes(user.id),
          effectiveLikesCountByUserId[user.id] ?? user.likesCount,
          effectiveLearningSubcategoryIdsByUserId[user.id] ?? user.learningSubcategoryIds,
        ),
      ),
    [
      favoriteUsers,
      favoriteUserIds,
      effectiveLikesCountByUserId,
      effectiveLearningSubcategoryIdsByUserId,
    ],
  )

  // Переключает раздел профиля или открывает страницу навыка.
  const handleTabClick = (tabId: string) => {
    if (tabId === 'skills') {
      if (currentUserId) {
        navigate(ROUTES.SKILL.replace(':userId', currentUserId))
      }

      return
    }

    if (tabId === 'favorites') {
      setActiveTab('favorites')
      navigate(ROUTES.FAVORITES)

      return
    }

    if (tabId === 'personal') {
      setActiveTab('personal')
      navigate(ROUTES.PROFILE)

      return
    }
  }

  // Удаляет пользователя из Favorites.
  const handleFavoriteClick = (userId: string) => {
    dispatch(removeFavorite(userId))
  }

  // Открывает страницу выбранного пользователя.
  const handleDetailsClick = (userId: string) => {
    navigate(ROUTES.SKILL.replace(':userId', userId))
  }

  // Выбирает содержимое активного раздела профиля.
  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalDataSectionContainer onChangePassword={() => setIsChangePasswordOpen(true)} />
        )

      case 'favorites':
        if (usersStatus === 'idle' || usersStatus === 'loading') {
          return (
            <div className={styles.placeholder}>
              <Spinner />
            </div>
          )
        }

        return (
          <FavoritesSection
            favoriteUsers={favoriteCards}
            onFavoriteClick={handleFavoriteClick}
            onDetailsClick={handleDetailsClick}
          />
        )
    }
  }

  return (
    <div className={styles.page}>
      <HeaderContainer />

      <main className={styles.main}>
        <div className={styles.profileGrid}>
          <ProfileSidebar activeTab={activeTab} onTabClick={handleTabClick} />

          <div className={styles.content}>{renderContent()}</div>
        </div>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}
    </div>
  )
}
