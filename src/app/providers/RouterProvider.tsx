import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { skillPageMock } from '@/pages/SkillPage/SkillPage.mock'
import { catalogPageMock } from '@/pages/CatalogPage/CatalogPage.mock'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() =>
  import('@/pages/CatalogPage').then((module) => ({
    default: module.CatalogPage,
  })),
)
const SkillPage = lazy(() =>
  import('@/pages/SkillPage').then((module) => ({
    default: module.SkillPage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
)
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

const ServerErrorPage = lazy(() =>
  import('@/pages/ServerErrorPage').then((module) => ({
    default: module.ServerErrorPage,
  })),
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<CatalogPage {...catalogPageMock} />} />
          <Route path={ROUTES.SKILL} element={<SkillPage {...skillPageMock} />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<LoginPage />} />
          <Route
            path={ROUTES.SERVER_ERROR}
            element={<ServerErrorPage user={skillPageMock.user} />}
          />

          {/* Защищённые маршруты — добавь PrivateRoute обёртку */}
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
