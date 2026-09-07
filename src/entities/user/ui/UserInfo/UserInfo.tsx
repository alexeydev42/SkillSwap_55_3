import LikeIcon from '../../../../shared/assets/icons/icon-like.svg?react'
import LikeFilledIcon from '../../../../shared/assets/icons/icon-like-filled.svg?react';
import { Avatar } from '../../../../shared/ui/Avatar'
import { IconButton } from '../../../../shared/ui/IconButton'
import styles from './UserInfo.module.css'

export interface UserInfoProps {
  avatar: string
  name: string
  city: string
  age: string
  withFavoriteButton?: boolean
  isFavorite?: boolean
  onFavoriteClick?: () => void
}

export function UserInfo({
  avatar,
  name,
  city,
  age,
  withFavoriteButton = false,
  isFavorite = false,
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
          icon={isFavorite ? <LikeFilledIcon /> : <LikeIcon />}
          className={isFavorite ? `${styles.favoriteButton} ${styles.favoriteButtonActive}` : styles.favoriteButton}
          aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={onFavoriteClick}
        />
      )}
    </div>
  )
}
