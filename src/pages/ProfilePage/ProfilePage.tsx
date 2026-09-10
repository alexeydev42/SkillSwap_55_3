import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { FavoritesSection } from '@/widgets/FavoritesSection'
import { Footer } from '@/widgets/Footer'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'
import {
  PersonalDataSection,
  type PersonalData,
} from '@/widgets/PersonalDataSection'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'

import styles from './ProfilePage.module.css'

export type ProfileTab =
  | 'requests'
  | 'exchanges'
  | 'favorites'
  | 'skills'
  | 'personal'

export interface ProfilePageProps {
  /** Начальная вкладка (для Storybook и входа на страницу). */
  initialTab?: ProfileTab
}

const DEFAULT_TAB: ProfileTab = 'personal'

const AVATAR_SRC = '/images/users/user-001/avatar.webp'

const PROFILE_DATA: PersonalData = {
  email: 'Mariia@gmail.com',
  name: 'Мария',
  birthDate: new Date(1995, 9, 28),
  gender: 'female',
  city: 'moscow',
  about:
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
  avatar: AVATAR_SRC,
}

const PLACEHOLDER_TITLES: Record<
  Exclude<ProfileTab, 'personal' | 'favorites'>,
  string
> = {
  requests: 'Заявки',
  exchanges: 'Мои обмены',
  skills: 'Мои навыки',
}

const PlaceholderBlock = ({ title }: { title: string }) => (
  <div className={styles.placeholder}>
    <h2 className={styles.placeholderTitle}>{title}</h2>
    <p className={styles.placeholderText}>Раздел находится в разработке</p>
  </div>
)

export default function ProfilePage({
  initialTab = DEFAULT_TAB,
}: ProfilePageProps) {
  const navigate = useNavigate()
  const currentUserId = useAppSelector(
    (state) => state.auth.session?.userId ?? null,
  )

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab)

  const handleTabClick = (tabId: string) => {
    if (tabId === 'skills') {
      if (currentUserId) {
        navigate(ROUTES.SKILL.replace(':userId', currentUserId))
      }

      return
    }

    setActiveTab(tabId as ProfileTab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDataSection data={PROFILE_DATA} />

      case 'favorites':
        return (
          <FavoritesSection
            favoriteUsers={[]}
            onFavoriteClick={() => {}}
            onDetailsClick={() => {}}
          />
        )

      case 'requests':
      case 'exchanges':
      case 'skills':
        return <PlaceholderBlock title={PLACEHOLDER_TITLES[activeTab]} />
    }
  }

  return (
    <div className={styles.page}>
      <HeaderContainer />

      <main className={styles.main}>
        <div className={styles.profileGrid}>
          <ProfileSidebar
            activeTab={activeTab}
            onTabClick={handleTabClick}
          />

          <div className={styles.content}>{renderContent()}</div>
        </div>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
