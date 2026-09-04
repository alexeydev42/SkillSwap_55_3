import styles from './UserSkillCard.module.css';
import { Button } from '@/shared/ui/Button';
import { SkillTagsBlock } from '@/entities/skill/ui/SkillTagsBlock';
import type { SkillTagVariant } from '@/shared/ui/SkillTag/SkillTag';
import { UserInfo } from '@/entities/user/ui/UserInfo';

export interface UserSkillCardData {
  name: string
  city: string
  age: number
  gender?: 'male' | 'female'
  avatarUrl: string | null
  canTeach: { label: string; variant: SkillTagVariant }
  learnTags: { label: string; variant: SkillTagVariant }[]
}

export interface UserSkillCardProps {
  user: UserSkillCardData
  onFavoriteClick: () => void
  onDetailsClick: () => void
  className?: string
}

function getAgeLabel(age: number): string {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет'
  if (lastDigit === 1) return 'год'
  if (lastDigit >= 2 && lastDigit <= 4) return 'года'
  return 'лет'
}

export const UserSkillCard = ({ user, onFavoriteClick, onDetailsClick, className }: UserSkillCardProps) => {
  return (
    <div className={`${styles['card']} ${className ?? styles.default}`}>
      <UserInfo
        avatar={user.avatarUrl ?? ''}
        name={user.name}
        city={user.city}
        age={`${user.age} ${getAgeLabel(user.age)}`}
        withFavoriteButton
        onFavoriteClick={onFavoriteClick}
      />

      <SkillTagsBlock canTeach={user.canTeach} wantsToLearn={user.learnTags} />

      <Button onClick={onDetailsClick} className={styles['details-button']}>
        Подробнее
      </Button>
    </div>
  )
}
