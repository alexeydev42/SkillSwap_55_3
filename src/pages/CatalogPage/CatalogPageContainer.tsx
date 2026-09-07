import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAllUsers, selectMockUsers, setMockUsers } from '@/store/slices/usersSlice'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import { CatalogPage } from './CatalogPage'
import { catalogCategories, catalogCities, catalogUsers } from './CatalogPage.mock'

export function CatalogPageContainer() {
  const dispatch = useAppDispatch()
  const mockUsers = useAppSelector(selectMockUsers)
  const users = useAppSelector(selectAllUsers)
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)

  // Кладёт моковых пользователей каталога в Redux при первом монтировании,
  // но не переписывает их повторно, если они уже загружены.
  useEffect(() => {
    if (mockUsers.length === 0) {
      dispatch(setMockUsers(catalogUsers))
    }
  }, [dispatch, mockUsers.length])

  const handleFavoriteClick = (userId: string) => {
    if (favoriteUserIds.includes(userId)) {
      dispatch(removeFavorite(userId))
    } else {
      dispatch(addFavorite(userId))
    }
  }

  return (
    <CatalogPage
      users={users}
      categories={catalogCategories}
      cities={catalogCities}
      onFavoriteClick={handleFavoriteClick}
      onDetailsClick={(id) => console.log('Подробнее:', id)}
    />
  )
}
