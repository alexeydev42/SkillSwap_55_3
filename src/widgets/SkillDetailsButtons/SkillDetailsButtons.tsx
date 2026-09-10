import type { FC } from 'react'
import clsx from 'clsx'

import EditIcon from '@/shared/assets/icons/icon-edit.svg?react'
import { Button } from '@/shared/ui/Button'

import styles from './SkillDetailsButtons.module.css'

export type SkillDetailsButtonsVariant = 'offer' | 'edit'

export interface SkillDetailsButtonsProps {
  variant: SkillDetailsButtonsVariant
  onOffer?: () => void
  onEdit?: () => void
  onDone?: () => void
  offerText?: string
  disabled?: boolean
  className?: string
}

export const SkillDetailsButtons: FC<SkillDetailsButtonsProps> = ({
  variant,
  onOffer,
  onEdit,
  onDone,
  offerText = 'Предложить обмен',
  disabled = false,
  className,
}) => {
  // Показывает одну кнопку предложения обмена.
  if (variant === 'offer') {
    return (
      <div className={clsx(styles.container, className)}>
        <Button
          variant="primary"
          size="md"
          onClick={onOffer}
          disabled={disabled}
          className={styles.button}
        >
          {offerText}
        </Button>
      </div>
    )
  }

  // Показывает кнопки редактирования навыка.
  return (
    <div className={clsx(styles.container, className)}>
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
  )
}
