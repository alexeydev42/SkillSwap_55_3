import SortIcon from '../../shared/assets/icons/icon-sort.svg?react'

import { Button } from '../../shared/ui/Button'

export interface SortButtonProps {
  onChange?: (value: string) => void
}

export function SortButton({ onChange }: SortButtonProps) {
  return (
    <Button
      variant="tertiary"
      size="md"
      icon={<SortIcon />}
      iconPosition="left"
      onClick={() => onChange?.('новые')}
    >
      Сначала новые
    </Button>
  )
}
