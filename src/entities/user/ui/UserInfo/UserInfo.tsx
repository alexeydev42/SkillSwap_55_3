import LikeIcon from '../../../../shared/assets/icons/icon-like.svg?react'
import { IconButton } from '../../../../shared/ui/IconButton'
import { Avatar } from '../../../../shared/ui/Avatar'
import styles from './UserInfo.module.css'

export interface UserInfoProps {
  avatar: string
  name: string
  city: string
  age: number
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

        <div className={styles.details}>
          <span>{city},</span>
          <span>{age}</span>
        </div>
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
