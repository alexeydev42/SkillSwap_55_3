import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'

import { ProtectedRoute } from './ProtectedRoute'

import { Spinner } from '@/shared/ui/Spinner'

import styles from './RouterProvider.module.css'

const CatalogPageContainer = lazy(() =>
  import('@/pages/CatalogPage/CatalogPageContainer').then((module) => ({
    default: module.CatalogPageContainer,
  })),
)

const AboutProjectPage = lazy(() =>
  import('@/pages/AboutProjectPage').then((module) => ({
    default: module.AboutProjectPage,
  })),
)

const ContactsPage = lazy(() =>
  import('@/pages/ContactsPage').then((module) => ({
    default: module.ContactsPage,
  })),
)

const SkillPageContainer = lazy(() =>
  import('@/pages/SkillPage/SkillPageContainer').then((module) => ({
    default: module.SkillPageContainer,
  })),
)

const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
)

const LoginPage = lazy(() => import('@/pages/LoginPage'))

const RegistrationStep1 = lazy(() =>
  import('@/pages/RegistrationStep1').then((module) => ({
    default: module.RegistrationStep1,
  })),
)

const RegistrationStep2 = lazy(() =>
  import('@/pages/RegistrationStep2').then((module) => ({
    default: module.RegistrationStep2,
  })),
)

const RegistrationStep3 = lazy(() =>
  import('@/pages/RegistrationStep3').then((module) => ({
    default: module.RegistrationStep3,
  })),
)

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

export const AppRouter = () => (
  <HashRouter>
    <Suspense
      fallback={
        <div className={styles.routeLoader}>
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route path={ROUTES.HOME} element={<CatalogPageContainer />} />
        <Route path={ROUTES.ABOUT} element={<AboutProjectPage />} />
        <Route path={ROUTES.CONTACTS} element={<ContactsPage />} />
        <Route path={ROUTES.SKILL} element={<SkillPageContainer />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegistrationStep1 />} />
        <Route path={ROUTES.REGISTER_STEP_2} element={<RegistrationStep2 />} />
        <Route path={ROUTES.REGISTER_STEP_3} element={<RegistrationStep3 />} />
        <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.FAVORITES} element={<ProfilePage initialTab="favorites" />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </HashRouter>
)
