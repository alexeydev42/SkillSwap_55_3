import React from 'react';
import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import EditIcon from '@/shared/assets/icons/icon-edit.svg?react';
import styles from './SkillDetailsButtons.module.css';

export type SkillDetailsButtonsMode = 'offer' | 'edit';

export interface SkillDetailsButtonsProps {
  mode: SkillDetailsButtonsMode;
  onOffer?: () => void;
  onEdit?: () => void;
  onDone?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SkillDetailsButtons: React.FC<SkillDetailsButtonsProps> = ({
  mode,
  onOffer,
  onEdit,
  onDone,
  disabled = false,
  className,
}) => {
  if (mode === 'offer') {
    return (
      <div className={clsx(styles.container, className)}>
        <Button
          variant="primary"
          size="md"
          onClick={onOffer}
          disabled={disabled}
          className={styles.button}
        >
          Предложить обмен
        </Button>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container, styles.containerEdit, className)}>
      <Button
        variant="secondary"
        size="md"
        onClick={onEdit}
        disabled={disabled}
        icon={<EditIcon />}
        iconPosition="right"
        className={styles.button}
      >
        Редактировать
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onDone}
        disabled={disabled}
        className={styles.button}
      >
        Готово
      </Button>
    </div>
  );
};