import { Button } from '@/shared/ui/Button'
import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'

import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title: string
  showViewAllButton?: boolean
}

export function SectionHeader({ title, showViewAllButton = false }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {showViewAllButton && (
        <Button variant="tertiary" iconPosition="right" icon={<ChevronRightIcon />}>
          Смотреть всё
        </Button>
      )}
    </div>
  )
}
