import { useMemo, useState } from 'react'

import { Footer } from '@/widgets/Footer'
import { Header, type HeaderProps } from '@/widgets/Header'
import { FiltersSidebar } from '@/widgets/FiltersSidebar'
import { RecommendedSection } from '@/widgets/RecommendedSection'
import { UserSkillsSection, type UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import { AppliedFiltersBar, type Filter } from '@/widgets/AppliedFiltersBar'
import { SortButton } from '@/widgets/SortButton'
import { UserSkillCard } from '@/widgets/UserSkillCard'
import type { FiltersSidebarProps } from '@/widgets/FiltersSidebar'

import styles from './CatalogPage.module.css'

// Данные авторизованного пользователя для Header.
export interface CatalogPageHeaderUser {
  userName: string
  avatarSrc: string
}

type HeaderMenu = 'allSkills' | 'notifications' | 'profile'

export interface CatalogPageProps {
  categories: FiltersSidebarProps['categories']
  cities: FiltersSidebarProps['cities']
  popularItems: UserSkillsSectionItem[]
  newItems: UserSkillsSectionItem[]
  recommendedItems: UserSkillsSectionItem[]

  // Пропсы для состояний Header
  headerUser?: CatalogPageHeaderUser
  isProfileMenuInitiallyOpen?: boolean
  isNotificationsMenuInitiallyOpen?: boolean
  isAllSkillsMenuInitiallyOpen?: boolean
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
}

const DATA_FILTERS = ['Хочу научиться', 'Могу научить', 'Мужской', 'Женский']

/** Фильтрует карточки по навыку, городу и полу. */
function filterCards(pool: UserSkillsSectionItem[], filters: string[]): UserSkillsSectionItem[] {
  const hasMale = filters.includes('Мужской')
  const hasFemale = filters.includes('Женский')
  const hasGenderFilter = hasMale || hasFemale

  const dataFilters = filters.filter((f) => !DATA_FILTERS.includes(f))

  return pool.filter((card) => {
    const matchesData =
      dataFilters.length === 0 ||
      dataFilters.some((f) => card.canTeach.label.includes(f) || card.city === f)

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

// Определяет меню, открытое при первом отображении страницы.
function getInitialHeaderMenu(
  isProfileMenuOpen: boolean,
  isNotificationsMenuOpen: boolean,
  isAllSkillsMenuOpen: boolean,
): HeaderMenu | null {
  if (isNotificationsMenuOpen) {
    return 'notifications'
  }

  if (isProfileMenuOpen) {
    return 'profile'
  }

  if (isAllSkillsMenuOpen) {
    return 'allSkills'
  }

  return null
}

export const CatalogPage = ({
  categories,
  cities,
  popularItems,
  newItems,
  recommendedItems,
  headerUser,
  isProfileMenuInitiallyOpen = false,
  isNotificationsMenuInitiallyOpen = false,
  isAllSkillsMenuInitiallyOpen = false,
  onFavoriteClick,
  onDetailsClick,
}: CatalogPageProps) => {
  // --- Состояние фильтров ---
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Хранит единственное открытое меню Header.
  const [openHeaderMenu, setOpenHeaderMenu] = useState<HeaderMenu | null>(() =>
    getInitialHeaderMenu(
      isProfileMenuInitiallyOpen,
      isNotificationsMenuInitiallyOpen,
      isAllSkillsMenuInitiallyOpen,
    ),
  )

  // --- Мемоизация фильтров ---
  const isFiltered = selectedFilters.length > 0
  const appliedFilters = useMemo(() => buildAppliedFilters(selectedFilters), [selectedFilters])
  const filteredResults = useMemo(
    () => filterCards(recommendedItems, selectedFilters),
    [recommendedItems, selectedFilters],
  )

  const handleRemoveFilter = (id: string) => {
    setSelectedFilters((prev) => prev.filter((label) => label !== id))
  }

  // Переключает выбранное меню и закрывает ранее открытое.
  const toggleHeaderMenu = (menu: HeaderMenu) => {
    setOpenHeaderMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }

  // Закрывает только указанное меню, не затрагивая другое.
  const setHeaderMenuOpen = (menu: HeaderMenu, isOpen: boolean) => {
    setOpenHeaderMenu((currentMenu) => {
      if (isOpen) {
        return menu
      }

      return currentMenu === menu ? null : currentMenu
    })
  }

  // --- Подготовка пропсов для Header ---
  const headerProps: HeaderProps = headerUser
    ? {
        isAuthenticated: true,
        user: headerUser,
        isProfileMenuOpen: openHeaderMenu === 'profile',
        isNotificationsMenuOpen: openHeaderMenu === 'notifications',
        onProfileClick: () => toggleHeaderMenu('profile'),
        onProfileMenuClose: () => setHeaderMenuOpen('profile', false),
        onNotificationsClick: () => toggleHeaderMenu('notifications'),
        onNotificationsMenuClose: () => setHeaderMenuOpen('notifications', false),
      }
    : {
        isAuthenticated: false,
      }

  return (
    <div className={styles.page}>
      {/* Передаем подготовленные пропсы в Header */}
      <Header
        {...headerProps}
        isAllSkillsMenuOpen={openHeaderMenu === 'allSkills'}
        onAllSkillsMenuOpenChange={(isOpen) => setHeaderMenuOpen('allSkills', isOpen)}
      />

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
            // --- Режим результатов поиска (из develop) ---
            <div className={styles.results}>
              <AppliedFiltersBar filters={appliedFilters} onRemove={handleRemoveFilter} />
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
            // --- Режим секций по умолчанию ---
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
