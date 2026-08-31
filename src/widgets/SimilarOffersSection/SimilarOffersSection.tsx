import { SectionHeader } from '@/widgets/SectionHeader'
import { UserSkillCard } from '@/widgets/UserSkillCard'
import { IconButton } from '@/shared/ui/IconButton'
import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'

import type { UserSkillCardProps } from '../UserSkillCard/UserSkillCard'

import styles from './SimilarOffersSection.module.css'

export interface SimilarOffersSectionProps {
  items: UserSkillCardProps[]
}

export function SimilarOffersSection({ items }: SimilarOffersSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Похожие предложения" variant="compact" />

      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {items.map((item, index) => (
            <UserSkillCard key={index} {...item} />
          ))}
        </div>

        <IconButton
          icon={<ChevronRightIcon />}
          className={styles.nextButton}
          aria-label="Следующие предложения"
        />
      </div>
    </section>
  )
}
