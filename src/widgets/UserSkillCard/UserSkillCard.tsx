import styles from './UserSkillCard.module.css';
import { Button } from '@/shared/ui/Button';
import { SkillTag } from '@/shared/ui/SkillTag';
import type { SkillTagVariant } from '@/shared/ui/SkillTag/SkillTag';
import { UserInfo } from '@/entities/user/ui/UserInfo';

interface UserSkillCardData {
  name: string
  city: string
  age: number
  avatarUrl: string | null
  teachTags: { label: string; variant: SkillTagVariant }[]
  learnTags: { label: string; variant: SkillTagVariant }[]
}

interface UserSkillCardProps {
  user: UserSkillCardData
  isFavorite: boolean
  onFavoriteClick: () => void
  onDetailsClick: () => void
}

function getAgeLabel(age: number): string {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет'
  if (lastDigit === 1) return 'год'
  if (lastDigit >= 2 && lastDigit <= 4) return 'года'
  return 'лет'
}

export const UserSkillCard = (props: UserSkillCardProps) => {
  const { user, isFavorite, onFavoriteClick, onDetailsClick } = props

  return (
    <div className={styles['card']}>
      <UserInfo
        avatar={user.avatarUrl ?? ''}
        name={user.name}
        city={user.city}
        age={`${user.age} ${getAgeLabel(user.age)}`}
        withFavoriteButton
        onFavoriteClick={onFavoriteClick}
      />

      {/* TODO: SkillTagsBlock (VERST-20) ещё не готов. Пока выводим все теги напрямую через SkillTag, без ограничения количества и счётчика +N — заменить на <SkillTagsBlock> когда компонент будет готов */}
      <div>
        <h4 className={styles['section-title']}>Может научить</h4>
        <div className={styles['tags-placeholder']}>
          {user.teachTags.map((tag) => (
            <SkillTag key={tag.label} label={tag.label} variant={tag.variant} />
          ))}
        </div>
      </div>

      <div>
        <h4 className={styles['section-title']}>Хочет научиться</h4>
        <div className={styles['tags-placeholder']}>
          {user.learnTags.map((tag) => (
            <SkillTag key={tag.label} label={tag.label} variant={tag.variant} />
          ))}
        </div>
      </div>

      <Button onClick={onDetailsClick} className={styles['details-button']}>
        Подробнее
      </Button>
    </div>
  )
}