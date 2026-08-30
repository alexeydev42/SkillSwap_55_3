import type { MouseEventHandler } from "react";
import { IconButton } from "@/shared/ui/IconButton";
import { Avatar } from "@/shared/ui/Avatar";
import NotificationIcon from '../../../shared/assets/icons/icon-notification.svg?react';
import LikeIcon from '../../../shared/assets/icons/icon-like.svg?react';
import styles from './UserHeaderControls.module.css';

export interface UserHeaderControlsProps {
  userName: string;
  avatarSrc: string;
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>
  onFavoritesClick?: MouseEventHandler<HTMLButtonElement>
}

export const UserHeaderControls = ({userName, avatarSrc, onNotificationsClick, onFavoritesClick}: UserHeaderControlsProps) => {
  return (
    <div className={styles['controls']}>
      <div className={styles.icons}>
        <IconButton icon={<NotificationIcon/>} onClick={onNotificationsClick} aria-label="Кнопка уведомлений" />
        <IconButton icon={<LikeIcon/>} onClick={onFavoritesClick} aria-label="Кнопка избранного" />
      </div>

      <div className={styles.userInfo}>

        <span className={styles.userName}>{userName}</span>
        <Avatar src={avatarSrc} size="small" />
      </div>

    </div>
  )
}
