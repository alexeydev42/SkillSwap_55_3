import { UserSkillCard } from '../UserSkillCard'
import styles from './FavoritesSection.module.css'
import illustrationUserInfo from '../../shared/assets/illustrations/illustration-user-info.svg'
import { UserSkillCardData } from '../UserSkillCard/UserSkillCard'

export interface FavoritesSectionProps {
  favoriteUsers: UserSkillCardData[]
}

export const FavoritesSection = ({ favoriteUsers }: FavoritesSectionProps) => {
  const isEmpty = favoriteUsers.length === 0

  return (
    <section className={styles['favorites-section__wrapper']}>
      {isEmpty ? (
        <div className={styles['favorites-section__empty-section']}>
          <div className={styles['favorites-section__illustration-wrapper']}>
            <img
              className={styles['favorites-section__illustration']}
              src={illustrationUserInfo}
              alt=""
            />
          </div>
          <div className={styles['favorites-section__description-wrapper']}>
            <h2 className={styles['favorites-section__description-text']}>
              В избранном пока пусто
            </h2>
          </div>
        </div>
      ) : (
        <div className={styles['favorites-section__full-section']}>
          {favoriteUsers.map((favoriteUser, index) => (
            <UserSkillCard
              key={index}
              user={favoriteUser}
              onDetailsClick={() => {}}
              onFavoriteClick={() => {}}
            />
          ))}
        </div>
      )}
    </section>
  )
}
