import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { UserProfileCard, type UserProfileCardProps } from '@/widgets/UserProfileCard'
import { SkillActions } from '@/widgets/SkillActions'
import { SkillDetails, type SkillDetailsProps } from '@/entities/skill/ui/SkillDetails'
import { SkillGallery } from '@/entities/skill/ui/SkillGallery'
import { SkillDetailsButtons } from '@/widgets/SkillDetailsButtons'
import { SimilarOffersSection } from '@/widgets/SimilarOffersSection'
import type { SkillTagsBlockProps } from '@/entities/skill/ui/SkillTagsBlock'
import type { UserSkillCardProps } from '../../widgets/UserSkillCard/UserSkillCard'

import styles from './SkillPage.module.css'

export interface SkillPageProps {
  user: UserProfileCardProps['user']
  userDescription: string
  skills: SkillTagsBlockProps
  skill: SkillDetailsProps
  gallery: string[]
  similarOffers: UserSkillCardProps[]
}

export function SkillPage({
  user,
  userDescription,
  skills,
  skill,
  gallery,
  similarOffers,
}: SkillPageProps) {
  return (
    <div className={styles.page}>
      <Header
        isAuthenticated
        user={{
          userName: user.name,
          avatarSrc: user.avatar,
        }}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.userProfileCard}>
            <UserProfileCard user={user} description={userDescription} skills={skills} />
          </div>

          <div className={styles.skill}>
            <div className={styles.skillActions}>
              <SkillActions />
            </div>

            <div className={styles.skillGalleryBlock}>
              <div className={styles.skillInfo}>
                <SkillDetails {...skill} />
                <SkillDetailsButtons variant="offer" />
              </div>

              <SkillGallery images={gallery} />
            </div>
          </div>
        </div>

        <SimilarOffersSection items={similarOffers} />
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
