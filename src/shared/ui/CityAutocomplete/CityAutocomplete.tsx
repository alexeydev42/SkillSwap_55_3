import { ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { Input } from '../Input';
import { IconButton } from '../IconButton';
import { DropdownContainer } from '../DropdownContainer';
import crossIcon from '../../assets/icons/icon-cross.svg';
import styles from './CityAutocomplete.module.css';

const CITIES = ['Санкт-Петербург', 'Самара', 'Саратов', 'Сочи'];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CityAutocomplete = ({
  value,
  onChange,
  placeholder = 'Введите город',
  className,
}: CityAutocompleteProps) => {
  const isOpen = value.length > 0;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.inputWrapper}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          borderless
          trailingIcon={
            value ? (
              <IconButton
                icon={<img src={crossIcon} alt="" />}
                onClick={handleClear}
                aria-label="Очистить поле"
              />
            ) : null
          }
        />
      </div>

      {isOpen && (
        <DropdownContainer className={styles.dropdown}>
          <ul className={styles.cityList}>
            {CITIES.map((city) => (
              <li key={city} className={styles.cityItem}>
                {city}
              </li>
            ))}
          </ul>
        </DropdownContainer>
      )}
    </div>
  );
};
