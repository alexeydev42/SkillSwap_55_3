import { useEffect, useState } from 'react'

import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'
import { IconButton } from '@/shared/ui/IconButton'
import { SectionHeader } from '@/widgets/SectionHeader'
import { UserSkillCard, type UserSkillCardProps } from '@/widgets/UserSkillCard'

import styles from './SimilarOffersSection.module.css'

export interface SimilarOffersSectionProps {
  items: UserSkillCardProps[]
}

const MAX_ITEMS = 8

const getItemsPerGroup = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 4
  }

  if (window.matchMedia('(width <= 767px)').matches) {
    return 1
  }

  if (window.matchMedia('(width <= 1024px)').matches) {
    return 2
  }

  if (window.matchMedia('(width <= 1200px)').matches) {
    return 3
  }

  return 4
}

export const SimilarOffersSection = ({ items }: SimilarOffersSectionProps) => {
  const [currentGroup, setCurrentGroup] = useState(0)
  const [itemsPerGroup, setItemsPerGroup] = useState(getItemsPerGroup)

  const limitedItems = items.slice(0, MAX_ITEMS)
  const itemsKey = limitedItems.map(({ user }) => user.id).join('|')
  const groupsCount = Math.ceil(limitedItems.length / itemsPerGroup)
  const hasSeveralGroups = groupsCount > 1

  // При переходе на страницу другого пользователя начинает показ
  // нового набора похожих предложений с первой группы.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQueries = [
      window.matchMedia('(width <= 767px)'),
      window.matchMedia('(width <= 1024px)'),
      window.matchMedia('(width <= 1200px)'),
    ]

    const handleMediaChange = () => {
      setItemsPerGroup(getItemsPerGroup())
    }

    mediaQueries.forEach((query) => query.addEventListener('change', handleMediaChange))

    return () => {
      mediaQueries.forEach((query) => query.removeEventListener('change', handleMediaChange))
    }
  }, [])

  useEffect(() => {
    setCurrentGroup(0)
  }, [itemsKey, itemsPerGroup])

  if (limitedItems.length === 0) {
    return null
  }

  // Защищает выдачу от пустой второй группы, если новый список стал короче.
  const visibleGroup = hasSeveralGroups ? currentGroup : 0
  const startIndex = visibleGroup * itemsPerGroup
  const visibleItems = limitedItems.slice(startIndex, startIndex + itemsPerGroup)

  const handleNextGroup = () => {
    setCurrentGroup((group) => (group + 1) % groupsCount)
  }

  return (
    <section className={styles.section}>
      <SectionHeader title="Похожие предложения" variant="compact" />

      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {visibleItems.map((item) => (
            <UserSkillCard key={item.user.id} {...item} />
          ))}
        </div>

        {hasSeveralGroups && (
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
