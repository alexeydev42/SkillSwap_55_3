import { SectionHeader } from '@/widgets/SectionHeader'
import { UserSkillCard } from '@/widgets/UserSkillCard'
import { IconButton } from '@/shared/ui/IconButton'
import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'
import { useState } from 'react'
import type { UserSkillCardProps } from '../UserSkillCard/UserSkillCard'

import styles from './SimilarOffersSection.module.css'

export interface SimilarOffersSectionProps {
  items: UserSkillCardProps[]
}

const ITEMS_PER_GROUP = 4
const MAX_ITEMS = 8

export function SimilarOffersSection({ items }: SimilarOffersSectionProps) {
  const [currentGroup, setCurrentGroup] = useState(0)
  const limitedItems = items.slice(0, MAX_ITEMS)

  if (limitedItems.length === 0) {
    return null
  }

  const visibleItems = limitedItems.slice(
    currentGroup * ITEMS_PER_GROUP,
    currentGroup * ITEMS_PER_GROUP + ITEMS_PER_GROUP,
  )

  const hasNextGroup = limitedItems.length > ITEMS_PER_GROUP

  const handleNextGroup = () => {
    setCurrentGroup((currentGroup) => (currentGroup === 0 ? 1 : 0))
  }
  return (
    <section className={styles.section}>
      <SectionHeader title="Похожие предложения" variant="compact" />

      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {visibleItems.map((item) => (
            <UserSkillCard
            key={item.user.id}
            user={item.user}
            onFavoriteClick={item.onFavoriteClick}
            onDetailsClick={item.onDetailsClick}
            />
          ))}
        </div>
        {hasNextGroup && (
          <IconButton
            icon={<ChevronRightIcon />}
            className={styles.nextButton}
            aria-label="Следующие предложения"
            onClick={handleNextGroup}
          />
        )}
      </div>
    </section>
  )
}
