import { useState, type MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from '@/store/slices/usersSlice'
import { logout } from '@/store/thunks/authThunks'

import Header, { type HeaderProps } from './Header'

type HeaderContainerProps = Omit<HeaderProps, 'isAuthenticated' | 'user'>

export const HeaderContainer = ({
  isProfileMenuOpen,
  onProfileClick,
  onProfileMenuClose,
  onFavoritesClick,
  onLogout,
  ...headerProps
}: HeaderContainerProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const session = useAppSelector((state) => state.auth.session)
  const currentUser = useAppSelector(selectCurrentUser)

  const [internalIsProfileMenuOpen, setInternalIsProfileMenuOpen] = useState(false)

  const isProfileMenuControlled = isProfileMenuOpen !== undefined

  const resolvedIsProfileMenuOpen = isProfileMenuControlled
    ? isProfileMenuOpen
    : internalIsProfileMenuOpen

  const handleProfileClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onProfileClick?.(event)

    if (!isProfileMenuControlled) {
      setInternalIsProfileMenuOpen((currentValue) => !currentValue)
    }
  }

  const handleProfileMenuClose = () => {
    onProfileMenuClose?.()

    if (!isProfileMenuControlled) {
      setInternalIsProfileMenuOpen(false)
    }
  }

  const handleFavoritesClick = () => {
    navigate(ROUTES.FAVORITES)
  }

  const handleLogout = () => {
    dispatch(logout())
    onLogout?.()
  }

  if (!session || !currentUser) {
    return <Header {...headerProps} isAuthenticated={false} />
  }

  return (
    <Header
      {...headerProps}
      isAuthenticated
      user={{
        userName: currentUser.name,
        avatarSrc: currentUser.avatarUrl ?? '',
      }}
      isProfileMenuOpen={resolvedIsProfileMenuOpen}
      onProfileClick={handleProfileClick}
      onProfileMenuClose={handleProfileMenuClose}
      onFavoritesClick={onFavoritesClick ?? handleFavoritesClick}
      onLogout={handleLogout}
    />
  )
}
