import styles from './UserSkillCard.module.css';
import { Button } from '@/shared/ui/Button'

interface UserSkillCardData {
  name: string
  city: string
  age: number
  avatarUrl: string | null
  bio: string
  teachTags: string[]
  learnTags: string[]
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
  const {user, isFavorite, onFavoriteClick, onDetailsClick} = props

  return(
    <div className={styles['card']}>
        <div className={styles['user-info-placeholder']}>
          <img src={user.avatarUrl ?? undefined} alt={user.name} className={styles.avatar} />
          <div>
            <h3>{user.name}</h3>
            <p>{user.city}, {user.age} {getAgeLabel(user.age)}</p>
          </div>
          <button onClick={onFavoriteClick}>{isFavorite ? '♥' : '♡'}</button>
          <p>{user.bio}</p>
      </div>

      <div>
        <h4>Может научить</h4>
        <div className={styles['tags-placeholder']}>
          {user.teachTags.map((tag)=> (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div>
        <h4>Хочет научиться</h4>
        <div className={styles['tags-placeholder']}>
          {user.learnTags.map((tag)=> (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <Button onClick={onDetailsClick}>Подробнее</Button>
    </div>

  )
}
