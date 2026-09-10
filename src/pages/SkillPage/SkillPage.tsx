import type { SkillDetailsProps } from '@/entities/skill/ui/SkillDetails'
import { SkillDetails } from '@/entities/skill/ui/SkillDetails'
import { SkillGallery } from '@/entities/skill/ui/SkillGallery'
import type { SkillTagsBlockProps } from '@/entities/skill/ui/SkillTagsBlock'
import { Footer } from '@/widgets/Footer'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'
import { SimilarOffersSection } from '@/widgets/SimilarOffersSection'
import { SkillActions } from '@/widgets/SkillActions'
import { SkillDetailsButtons } from '@/widgets/SkillDetailsButtons'
import type { UserProfileCardProps } from '@/widgets/UserProfileCard'
import { UserProfileCard } from '@/widgets/UserProfileCard'
import type { UserSkillCardProps } from '@/widgets/UserSkillCard'

import styles from './SkillPage.module.css'

export interface SkillPageProps {
  user: UserProfileCardProps['user']
  userDescription: string
  skills: SkillTagsBlockProps
  skill: SkillDetailsProps
  gallery: string[]
  similarOffers: UserSkillCardProps[]
  isOwnSkill: boolean
  isFavorite: boolean
  isFavoriteDisabled?: boolean
  onFavoriteClick: () => void
  onOffer: () => void
  isOfferDisabled?: boolean
  offerText?: string
  requestError?: string | null
}

export const SkillPage = ({
  user,
  userDescription,
  skills,
  skill,
  gallery,
  similarOffers,
  isOwnSkill,
  isFavorite,
  isFavoriteDisabled = false,
  onFavoriteClick,
  onOffer,
  isOfferDisabled = false,
  offerText = 'Предложить обмен',
  requestError,
}: SkillPageProps) => {
  return (
    <div className={styles.page}>
      <HeaderContainer />

      <main className={styles.main}>
        <div className={styles.content}>
          <aside className={styles.userProfileCard}>
            <UserProfileCard user={user} description={userDescription} skills={skills} />
          </aside>

          <div className={styles.skill}>
            <div className={styles.skillActions}>
              <SkillActions
                showFavorite={!isOwnSkill}
                isFavorite={isFavorite}
                isFavoriteDisabled={isFavoriteDisabled}
                onFavoriteClick={onFavoriteClick}
              />
            </div>

            <div className={styles.skillContent}>
              <div className={styles.skillInfo}>
                <SkillDetails {...skill} />

                {!isOwnSkill && (
                  <div className={styles.offerControls}>
                    <SkillDetailsButtons
                      variant="offer"
                      onOffer={onOffer}
                      disabled={isOfferDisabled}
                      offerText={offerText}
                    />

                    {requestError && (
                      <p className={styles.requestError} role="alert">
                        {requestError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.skillGallery}>
                <SkillGallery images={gallery} />
              </div>
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
