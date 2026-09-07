import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMockUsers, selectMockUsers } from '@/store/slices/usersSlice'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import { CatalogPage } from './CatalogPage'
import { catalogCategories, catalogCities, catalogUsers } from './CatalogPage.mock'

export function CatalogPageContainer() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectMockUsers)
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)

  // Кладёт моковых пользователей каталога в Redux при первом монтировании.
  useEffect(() => {
    dispatch(setMockUsers(catalogUsers))
  }, [dispatch])

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
