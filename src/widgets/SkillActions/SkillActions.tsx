import type { MouseEventHandler } from 'react'
import { IconButton } from '../../shared/ui/IconButton/IconButton'
import likeIcon from '../../shared/assets/icons/icon-like.svg'
import shareIcon from '../../shared/assets/icons/icon-share.svg'
import moreIcon from '../../shared/assets/icons/icon-more-square.svg'
import styles from './SkillActions.module.css'

export interface SkillActionsProps {
  onLike?: MouseEventHandler<HTMLButtonElement>
  onShare?: MouseEventHandler<HTMLButtonElement>
  onMore?: MouseEventHandler<HTMLButtonElement>
}

export function SkillActions({
  onLike,
  onShare,
  onMore,
}: SkillActionsProps) {
  return (
    <div className={styles.actions}>
      <IconButton icon={<img src={likeIcon} alt="" />} onClick={onLike} />
      <IconButton icon={<img src={shareIcon} alt="" />} onClick={onShare} />
      <IconButton icon={<img src={moreIcon} alt="" />} onClick={onMore} />
    </div>
  )
}
