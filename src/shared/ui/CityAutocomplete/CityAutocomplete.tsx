import { ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { Input } from '../Input';
import { IconButton } from '../IconButton';
import { DropdownContainer } from '../DropdownContainer';
import crossIcon from '../../assets/icons/icon-cross.svg';
import styles from './CityAutocomplete.module.css';

const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Новосибирск',
  'Самара',
  'Саратов',
  'Екатеринбург',
];

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
  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(value.toLowerCase())
  );
  const isOpen = value.length > 0 && filteredCities.length > 0;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleCitySelect = (city: string) => {
    onChange(city);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.inputWrapper}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          borderless
        />
        {value && (
          <IconButton
            icon={<img src={crossIcon} alt="Очистить" className={styles.crossIcon} />}
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Очистить поле"
          />
        )}
      </div>

      {isOpen && (
        <DropdownContainer className={styles.dropdown}>
          <ul className={styles.cityList}>
            {filteredCities.map((city) => (
              <li
                key={city}
                className={styles.cityItem}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        </DropdownContainer>
      )}
    </div>
  );
};