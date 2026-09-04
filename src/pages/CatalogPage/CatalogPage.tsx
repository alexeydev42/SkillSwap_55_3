import { useMemo, useState } from 'react'

import { Footer } from '@/widgets/Footer'
import { Header } from '@/widgets/Header'
import { FiltersSidebar } from '@/widgets/FiltersSidebar'
import { RecommendedSection } from '@/widgets/RecommendedSection'
import { UserSkillsSection, type UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import { AppliedFiltersBar, type Filter } from '@/widgets/AppliedFiltersBar'
import { SortButton } from '@/widgets/SortButton'
import { UserSkillCard } from '@/widgets/UserSkillCard'
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

const DATA_FILTERS = ['Хочу научиться', 'Могу научить', 'Мужской', 'Женский']

/** Фильтрует карточки по навыку, городу и полу. */
function filterCards(
  pool: UserSkillsSectionItem[],
  filters: string[],
): UserSkillsSectionItem[] {
  const hasMale = filters.includes('Мужской')
  const hasFemale = filters.includes('Женский')
  const hasGenderFilter = hasMale || hasFemale

  const dataFilters = filters.filter((f) => !DATA_FILTERS.includes(f))

  return pool.filter((card) => {
    const matchesData =
      dataFilters.length === 0 ||
      dataFilters.some(
        (f) => card.canTeach.label.includes(f) || card.city === f,
      )

    const matchesGender =
      !hasGenderFilter ||
      (hasMale && card.gender === 'male') ||
      (hasFemale && card.gender === 'female')

    return matchesData && matchesGender
  })
}

function buildAppliedFilters(labels: string[]): Filter[] {
  return labels.map((label) => ({ id: label, label }))
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
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const isFiltered = selectedFilters.length > 0
  const appliedFilters = useMemo(
    () => buildAppliedFilters(selectedFilters),
    [selectedFilters],
  )
  const filteredResults = useMemo(
    () => filterCards(recommendedItems, selectedFilters),
    [recommendedItems, selectedFilters],
  )

  const handleRemoveFilter = (id: string) => {
    setSelectedFilters((prev) => prev.filter((label) => label !== id))
  }

  return (
    <div className={styles.page}>
      <Header isAuthenticated={false} />
      <main className={styles.main}>
        <div className={styles.catalogGrid}>
          <div className={styles.filtersCard}>
            <div className={styles.filtersHeader}>
              <h2 className={styles.filtersTitle}>
                Фильтры{selectedFilters.length > 0 && ` (${selectedFilters.length})`}
              </h2>
              {selectedFilters.length > 0 && (
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={() => setSelectedFilters([])}
                >
                  Сбросить ×
                </button>
              )}
            </div>
            <FiltersSidebar
              categories={categories}
              cities={cities}
              selectedFilters={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>
          {isFiltered ? (
            <div className={styles.results}>
              <AppliedFiltersBar
                filters={appliedFilters}
                onRemove={handleRemoveFilter}
              />
              <div className={styles.resultsToolbar}>
                <h2 className={styles.resultsTitle}>
                  Подходящие предложения: {filteredResults.length}
                </h2>
                <SortButton onChange={(value) => console.log('Сортировка:', value)} />
              </div>
              <div className={styles.resultsGrid}>
                {filteredResults.map((item) => (
                  <UserSkillCard
                    key={item.id}
                    user={item}
                    onFavoriteClick={() => onFavoriteClick(item.id)}
                    onDetailsClick={() => onDetailsClick(item.id)}
                    className={styles.resultsCard}
                  />
                ))}
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
