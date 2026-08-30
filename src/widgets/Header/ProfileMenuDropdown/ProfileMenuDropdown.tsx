import { DropdownContainer } from "@/shared/ui/DropdownContainer";
import LogoutIcon from '../../../shared/assets/icons/icon-logout.svg?react';
import styles from './ProfileMenuDropdown.module.css';

export const ProfileMenuDropdown = () => {
  return (
    <DropdownContainer className={styles['dropdown']}>
      <span>Личный кабинет</span>
      <div className={styles['logoutItem']}>
        <span>Выйти из аккаунта</span>
        <LogoutIcon/>
      </div>
    </DropdownContainer>
  )
}
