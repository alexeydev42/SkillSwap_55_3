import { SectionHeader } from '@/widgets/SectionHeader'
import { UserSkillCard, type UserSkillCardData } from '@/widgets/UserSkillCard'

import styles from './UserSkillsSection.module.css'

export interface UserSkillsSectionProps {
  title: string
  items: UserSkillCardData[]
  showViewAll?: boolean
  viewAllLabel?: string
  isExpanded?: boolean
  onViewAllClick?: () => void
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
  isFavoriteDisabled?: boolean
}

export const UserSkillsSection = ({
  title,
  items,
  showViewAll,
  viewAllLabel,
  isExpanded = false,
  onViewAllClick,
  onFavoriteClick,
  onDetailsClick,
  isFavoriteDisabled = false,
}: UserSkillsSectionProps) => {
  return (
    <div className={styles.section}>
      <SectionHeader
        title={title}
        showViewAllButton={showViewAll}
        viewAllLabel={viewAllLabel}
        isExpanded={isExpanded}
        onViewAllClick={onViewAllClick}
      />

      <div className={styles.grid}>
        {items.map((item) => (
          <UserSkillCard
            key={item.id}
            user={item}
            isFavoriteDisabled={isFavoriteDisabled}
            onFavoriteClick={() => onFavoriteClick(item.id)}
            onDetailsClick={() => onDetailsClick(item.id)}
            className={styles.card}
          />
        ))}
      </div>
    </div>
  )
}
