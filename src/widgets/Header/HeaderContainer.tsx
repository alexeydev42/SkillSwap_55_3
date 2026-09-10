import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { HeaderProps } from './Header'
import { selectCurrentUser } from '@/store/slices/usersSlice'
import Header from './Header'
import { logout } from '@/store/thunks/authThunks' // Добавила импорт логаута

type HeaderContainerProps = Omit<HeaderProps, 'isAuthenticated' | 'user'>

export const HeaderContainer = (props: HeaderContainerProps) => {
  const dispatch = useAppDispatch() // Добавили dispatch
  const session = useAppSelector((state) => state.auth.session)
  const currentUser = useAppSelector(selectCurrentUser)

  if (!session || !currentUser) {
    return <Header {...props} isAuthenticated={false} />
  }

  return (
    <Header
      {...props}
      isAuthenticated
      user={{
        userName: currentUser.name,
        avatarSrc: currentUser?.avatarUrl ?? '',
      }}
      onLogout={() => dispatch(logout())}
    />
  )
}
