import { Button } from '@/shared/ui/Button'
import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'

import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title: string
  variant?: 'default' | 'compact'
  showViewAllButton?: boolean
}

export function SectionHeader({
  title,
  variant = 'default',
  showViewAllButton = false,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={`${styles.title} ${styles[variant]}`}>{title}</h2>

      {showViewAllButton && (
        <Button variant="tertiary" iconPosition="right" icon={<ChevronRightIcon />}>
          Смотреть все
        </Button>
      )}
    </div>
  )
}
