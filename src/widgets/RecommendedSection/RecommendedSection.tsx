import { UserSkillsSection } from '@/widgets/UserSkillsSection'
import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import { Spinner } from '@/shared/ui/Spinner'

import styles from './RecommendedSection.module.css'

export interface RecommendedSectionProps {
  /** Данные карточек — передаются как есть в UserSkillsSection (VERST-45). */
  items: UserSkillsSectionItem[]
  /** Показывать ли Spinner (VERST-15) под сеткой карточек. */
  isLoading: boolean
  /** Клик по сердечку конкретной карточки — пробрасывается наружу. */
  onFavoriteClick: (id: string) => void
  /** Клик по кнопке «Подробнее» конкретной карточки — пробрасывается наружу. */
  onDetailsClick: (id: string) => void
}

/**
 * RecommendedSection (VERST-46) — секция «Рекомендуем» на странице каталога.
 * Полностью собрана из готовых компонентов (UserSkillsSection, Spinner) —
 * собственной вёрстки заголовка и карточек здесь нет, только состояние
 * загрузки поверх готовой секции. Получение данных, IntersectionObserver,
 * пагинация и бесконечная прокрутка на этом этапе не реализуются.
 */
export function RecommendedSection({
  items,
  isLoading,
  onFavoriteClick,
  onDetailsClick,
}: RecommendedSectionProps) {
  return (
    <div className={styles.section}>
      <UserSkillsSection
        title="Рекомендуем"
        items={items}
        showViewAll={false}
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
