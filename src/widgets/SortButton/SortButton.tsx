import sortIcon from '../../shared/assets/icons/icon-sort.svg'

import { Button } from '../../shared/ui/Button'

export function SortButton() {
  return (
    <Button variant="tertiary" size="md" icon={<img src={sortIcon} alt="" />} iconPosition="left">
      Сначала новые
    </Button>
  )
}
