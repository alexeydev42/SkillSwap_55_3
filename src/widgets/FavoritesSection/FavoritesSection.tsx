import { UserSkillCard, type UserSkillCardData } from '@/widgets/UserSkillCard'
import styles from './FavoritesSection.module.css'
import IllustrationUserInfo from '../../shared/assets/illustrations/illustration-user-info.svg?react'

export interface FavoritesSectionProps {
  favoriteUsers: UserSkillCardData[]
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
}

export const FavoritesSection = ({
  favoriteUsers,
  onFavoriteClick,
  onDetailsClick,
}: FavoritesSectionProps) => {
  const isEmpty = favoriteUsers.length === 0

  return (
    <section className={styles.section}>
      {isEmpty ? (
        <div className={styles.emptyState}>
          <IllustrationUserInfo className={styles.illustration} aria-hidden="true" />
          <h2 className={styles.descriptionText}>В избранном пока ничего нет</h2>
        </div>
      ) : (
        <div className={styles.grid}>
          {favoriteUsers.map((favoriteUser) => (
            <UserSkillCard
              key={favoriteUser.id}
              user={favoriteUser}
              className={styles.card}
              onDetailsClick={() => onDetailsClick(favoriteUser.id)}
              onFavoriteClick={() => onFavoriteClick(favoriteUser.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
