import { ActiveFilterChip } from '../../shared/ui/ActiveFilterChip';
import CrossIcon from '../../shared/assets/icons/icon-cross.svg?react';
import styles from './AppliedFiltersBar.module.css'

export interface Filter {
  id: string;
  label: string;
}

export interface AppliedFiltersBarProps {
  filters: Filter[];
  onRemove: (id: string) => void;
  onReset: () => void;
}

export const AppliedFiltersBar = ({ filters, onRemove, onReset }: AppliedFiltersBarProps) => {
  return(
    <div className={styles.filtersBar}>
      <span className={styles.filters}>Фильтры ({filters.length})</span>
      <button type="button" className={styles.resetButton} onClick={onReset}>
        <span>Сбросить</span>
        <CrossIcon/>
      </button>
      {filters.map((filter) => (
        <ActiveFilterChip
        key={filter.id}
        label={filter.label}
        onRemove={() => onRemove(filter.id)}
        />
      ))}
    </div>
  )
}
