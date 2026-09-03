import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'
import { FiltersSidebar } from '@/widgets/FiltersSidebar'
import { RecommendedSection } from '@/widgets/RecommendedSection'
import { UserSkillsSection, type UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import type { FiltersSidebarProps } from '@/widgets/FiltersSidebar'

import styles from './CatalogPage.module.css'

export interface CatalogPageProps {
  categories: FiltersSidebarProps['categories']
  cities: FiltersSidebarProps['cities']
  popularItems: UserSkillsSectionItem[]
  newItems: UserSkillsSectionItem[]
  recommendedItems: UserSkillsSectionItem[]
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
}

export const CatalogPage = ({
  categories,
  cities,
  popularItems,
  newItems,
  recommendedItems,
  onFavoriteClick,
  onDetailsClick,
}: CatalogPageProps) => {
  return (
    <div className={styles.page}>
      <Header isAuthenticated={false} />
      <main className={styles.main}>
        <div className={styles.catalogGrid}>
          <div className={styles.filtersCard}>
            <h2 className={styles.filtersTitle}>Фильтры</h2>
            <FiltersSidebar categories={categories} cities={cities} />
          </div>
          <div className={styles.sections}>
            <UserSkillsSection
              title="Популярное"
              items={popularItems}
              showViewAll
              onFavoriteClick={onFavoriteClick}
              onDetailsClick={onDetailsClick}
            />
            <UserSkillsSection
              title="Новое"
              items={newItems}
              showViewAll
              onFavoriteClick={onFavoriteClick}
              onDetailsClick={onDetailsClick}
            />
            <RecommendedSection items={recommendedItems} isLoading={false} />
          </div>
        </div>
      </main>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
