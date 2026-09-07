import { useMemo, useState } from 'react'
import type { Category, City, User } from '@/shared/types'
import { Footer } from '@/widgets/Footer'
import { Header, type HeaderProps } from '@/widgets/Header'
import { FiltersSidebar } from '@/widgets/FiltersSidebar'
import { RecommendedSection } from '@/widgets/RecommendedSection'
import { UserSkillsSection } from '@/widgets/UserSkillsSection'
import { AppliedFiltersBar } from '@/widgets/AppliedFiltersBar'
import { SortButton } from '@/widgets/SortButton'
import { UserSkillCard } from '@/widgets/UserSkillCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetCatalogFilters, setCatalogFilters, setCatalogSort } from '@/store/slices/catalogFiltersSlice'
import {
  buildAppliedCatalogFilters,
  filterCatalogUsers,
  getActiveCatalogFiltersCount,
  getPopularCatalogUsers,
  hasActiveCatalogFilters,
  mapUserToCatalogCard,
  removeCatalogFilter,
} from './CatalogPage.utils'
import { selectNewUsers } from '@/store/slices/usersSlice'
import styles from './CatalogPage.module.css'

export interface CatalogPageHeaderUser {
  userName: string
  avatarSrc: string
}

type HeaderMenu = 'allSkills' | 'notifications' | 'profile'

export interface CatalogPageProps {
  users: User[]
  categories: Category[]
  cities: City[]
  headerUser?: CatalogPageHeaderUser
  isProfileMenuInitiallyOpen?: boolean
  isNotificationsMenuInitiallyOpen?: boolean
  isAllSkillsMenuInitiallyOpen?: boolean
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
}

const NEW_USERS_COLLAPSED_LIMIT = 3
const NEW_USERS_EXPANDED_LIMIT = 9

// Определяет меню Header, которое должно быть открыто изначально.
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
  users,
  categories,
  cities,
  headerUser,
  isProfileMenuInitiallyOpen = false,
  isNotificationsMenuInitiallyOpen = false,
  isAllSkillsMenuInitiallyOpen = false,
  onFavoriteClick,
  onDetailsClick,
}: CatalogPageProps) => {
  const dispatch = useAppDispatch()

  // Хранит все выбранные фильтры каталога.
  const filters = useAppSelector((state) => state.catalogFilters.filters)

  // Получает пользователей, заранее отсортированных от новых к старым.
const newUsers = useAppSelector(selectNewUsers)

// Хранит только состояние раскрытия секции «Новое».
const [isNewExpanded, setIsNewExpanded] = useState(false)

  // Хранит единственное открытое меню Header.
  const [openHeaderMenu, setOpenHeaderMenu] = useState<HeaderMenu | null>(() =>
    getInitialHeaderMenu(
      isProfileMenuInitiallyOpen,
      isNotificationsMenuInitiallyOpen,
      isAllSkillsMenuInitiallyOpen,
    ),
  )
  // Подготавливает карточки для секции «Популярное».
  const popularItems = useMemo(
    () =>
      getPopularCatalogUsers(users, 3).map((user) =>
        mapUserToCatalogCard(user, categories, cities),
      ),
    [users, categories, cities],
  )
  // Ограничивает секцию тремя или девятью новейшими пользователями
// и преобразует их в данные карточек.
const newItems = useMemo(() => {
  const limit = isNewExpanded
    ? NEW_USERS_EXPANDED_LIMIT
    : NEW_USERS_COLLAPSED_LIMIT

  return newUsers
    .slice(0, limit)
    .map((user) => mapUserToCatalogCard(user, categories, cities))
}, [newUsers, isNewExpanded, categories, cities])
  // Подготавливает карточки для секции «Рекомендуем».
  const recommendedItems = useMemo(
    () => users.map((user) => mapUserToCatalogCard(user, categories, cities)),
    [users, categories, cities],
  )
  // Проверяет наличие выбранных фильтров.
  const isFiltered = useMemo(() => hasActiveCatalogFilters(filters), [filters])
  // Подготавливает чипы выбранных фильтров.
  const appliedFilters = useMemo(
    () => buildAppliedCatalogFilters(filters, categories, cities),
    [filters, categories, cities],
  )
  // Фильтрует пользователей и преобразует результат в карточки.
  const filteredResults = useMemo(
    () =>
      filterCatalogUsers(users, filters).map((user) =>
        mapUserToCatalogCard(user, categories, cities),
      ),
    [users, filters, categories, cities],
  )
  // Подсчитывает количество выбранных фильтров.
  const filtersCount = useMemo(() => getActiveCatalogFiltersCount(filters), [filters])
  // Удаляет один фильтр через панель применённых фильтров.
  const handleRemoveFilter = (filterId: string) => {
    dispatch(setCatalogFilters(removeCatalogFilter(filters, filterId)))
  }
  // Переключает выбранное меню и закрывает ранее открытое.
  const toggleHeaderMenu = (menu: HeaderMenu) => {
    setOpenHeaderMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }
  // Открывает или закрывает указанное меню Header.
  const setHeaderMenuOpen = (menu: HeaderMenu, isOpen: boolean) => {
    setOpenHeaderMenu((currentMenu) => {
      if (isOpen) {
        return menu
      }
      return currentMenu === menu ? null : currentMenu
    })
  }
  // Подготавливает Header для гостя или авторизованного пользователя.
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
                Фильтры{filtersCount > 0 && ` (${filtersCount})`}
              </h2>
              {filtersCount > 0 && (
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={() => dispatch(resetCatalogFilters())}
                >
                  Сбросить ×
                </button>
              )}
            </div>
            <FiltersSidebar
              categories={categories}
              cities={cities}
              filters={filters}
              onChange={(nextFilters) => dispatch(setCatalogFilters(nextFilters))}
            />
          </div>
          {isFiltered ? (
            <div className={styles.results}>
              <AppliedFiltersBar filters={appliedFilters} onRemove={handleRemoveFilter} />
              <div className={styles.resultsToolbar}>
                <h2 className={styles.resultsTitle}>
                  Подходящие предложения: {filteredResults.length}
                </h2>
                <SortButton onChange={() => dispatch(setCatalogSort('newest'))} />
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
                showViewAll={newUsers.length > NEW_USERS_COLLAPSED_LIMIT}
                viewAllLabel={isNewExpanded ? 'Свернуть' : 'Смотреть все'}
                onViewAllClick={() => setIsNewExpanded((currentValue) => !currentValue)}
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
