import type { MouseEventHandler } from 'react'
import { IconButton } from '../../shared/ui/IconButton/IconButton'
import LikeIcon from '../../shared/assets/icons/icon-like.svg?react'
import ShareIcon from '../../shared/assets/icons/icon-share.svg?react'
import MoreIcon from '../../shared/assets/icons/icon-more-square.svg?react'
import styles from './SkillActions.module.css'

export interface SkillActionsProps {
  showFavorite?: boolean
  onLike?: MouseEventHandler<HTMLButtonElement>
  onShare?: MouseEventHandler<HTMLButtonElement>
  onMore?: MouseEventHandler<HTMLButtonElement>
}

export function SkillActions({ showFavorite = true, onLike, onShare, onMore }: SkillActionsProps) {
  return (
    <div className={styles.actions}>
      {showFavorite && (
        <IconButton icon={<LikeIcon />} onClick={onLike} aria-label="Добавить в избранное" />
      )}
      <IconButton icon={<ShareIcon />} onClick={onShare} aria-label="Поделиться" />
      <IconButton icon={<MoreIcon />} onClick={onMore} aria-label="Больше действий" />
    </div>
  )
}
