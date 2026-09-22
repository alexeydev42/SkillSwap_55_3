import LikeFilledIcon from '@/shared/assets/icons/icon-like-filled.svg?react'
import LikeIcon from '@/shared/assets/icons/icon-like.svg?react'
import MoreIcon from '@/shared/assets/icons/icon-more-square.svg?react'
import ShareIcon from '@/shared/assets/icons/icon-share.svg?react'
import EditIcon from '@/shared/assets/icons/icon-gallery-edit.svg?react'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './SkillActions.module.css'

export interface SkillActionsProps {
  showFavorite?: boolean
  isFavorite?: boolean
  isFavoriteDisabled?: boolean
  onFavoriteClick?: () => void
  onEdit?: () => void
  onShare?: () => void
  onMore?: () => void
}

export const SkillActions = ({
  showFavorite = true,
  isFavorite = false,
  isFavoriteDisabled = false,
  onFavoriteClick,
  onEdit,
  onShare,
  onMore,
}: SkillActionsProps) => (
  <div className={styles.actions}>
    {showFavorite && (
      <IconButton
        icon={isFavorite ? <LikeFilledIcon /> : <LikeIcon />}
        className={isFavorite ? styles.favoriteButtonActive : undefined}
        aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        disabled={isFavoriteDisabled}
        onClick={onFavoriteClick}
      />
    )}

    {onEdit && <IconButton icon={<EditIcon />} onClick={onEdit} aria-label="Редактировать навык" />}

    {onShare && <IconButton icon={<ShareIcon />} onClick={onShare} aria-label="Поделиться" />}

    {onMore && <IconButton icon={<MoreIcon />} onClick={onMore} aria-label="Больше действий" />}
  </div>
)
