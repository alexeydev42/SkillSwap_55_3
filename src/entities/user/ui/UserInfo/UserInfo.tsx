import LikeIcon from '../../../../shared/assets/icons/icon-like.svg?react'
import { Avatar } from '../../../../shared/ui/Avatar'
import { IconButton } from '../../../../shared/ui/IconButton'
import styles from './UserInfo.module.css'

export interface UserInfoProps {
  avatar: string
  name: string
  city: string
  age: string
  withFavoriteButton?: boolean
  onFavoriteClick?: () => void
}

export function UserInfo({
  avatar,
  name,
  city,
  age,
  withFavoriteButton = false,
  onFavoriteClick,
}: UserInfoProps) {
  return (
    <div className={styles.userInfo}>
      <Avatar src={avatar} size="medium" />

      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.details}>
          {city}, {age}
        </p>
      </div>

      {withFavoriteButton && (
        <IconButton
          icon={<LikeIcon />}
          className={styles.favoriteButton}
          aria-label="Добавить в избранное"
          onClick={onFavoriteClick}
        />
      )}
    </div>
  )
}
