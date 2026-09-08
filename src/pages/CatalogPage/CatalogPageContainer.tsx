import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchUsers,
  selectAllUsers,
  selectMockUsers,
  selectUsersError,
  selectUsersStatus,
} from '@/store/slices/usersSlice'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import { CatalogPage } from './CatalogPage'
import { catalogCategories, catalogCities } from './CatalogPage.mock'

export function CatalogPageContainer() {
  const dispatch = useAppDispatch()

  const mockUsers = useAppSelector(selectMockUsers)
  const users = useAppSelector(selectAllUsers)
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  const handleFavoriteClick = (userId: string) => {
    if (favoriteUserIds.includes(userId)) {
      dispatch(removeFavorite(userId))
    } else {
      dispatch(addFavorite(userId))
    }
  }

  const handleRetry = () => {
    dispatch(fetchUsers())
  }

  return (
    <CatalogPage
      users={users}
      categories={catalogCategories}
      cities={catalogCities}
      usersStatus={usersStatus}
      usersError={usersError}
      hasMockUsers={mockUsers.length > 0}
      onRetry={handleRetry}
      onFavoriteClick={handleFavoriteClick}
      onDetailsClick={(id) => console.log('Подробнее:', id)}
    />
  )
}
