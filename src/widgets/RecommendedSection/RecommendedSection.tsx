import { Spinner } from '@/shared/ui/Spinner'
import { UserSkillsSection } from '@/widgets/UserSkillsSection'
import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'

import styles from './RecommendedSection.module.css'

export interface RecommendedSectionProps {
  /** Данные карточек для UserSkillsSection. */
  items: UserSkillsSectionItem[]
  /** Показывать ли Spinner под сеткой карточек. */
  isLoading: boolean
  /** Клик по сердечку конкретной карточки. */
  onFavoriteClick: (id: string) => void
  /** Клик по кнопке «Подробнее». */
  onDetailsClick: (id: string) => void
  /** Блокирует Favorites для гостя. */
  isFavoriteDisabled?: boolean
}

export function RecommendedSection({
  items,
  isLoading,
  onFavoriteClick,
  onDetailsClick,
  isFavoriteDisabled = false,
}: RecommendedSectionProps) {
  return (
    <div className={styles.section}>
      <UserSkillsSection
        title="Рекомендуем"
        items={items}
        showViewAll={false}
        isFavoriteDisabled={isFavoriteDisabled}
        onFavoriteClick={onFavoriteClick}
        onDetailsClick={onDetailsClick}
      />

      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
    </div>
  )
}
