import { ChangeEvent } from 'react'
import { clsx } from 'clsx'
import { Input } from '../Input'
import { IconButton } from '../IconButton'
import crossIcon from '../../assets/icons/icon-cross.svg'
import styles from './CityAutocomplete.module.css'

const CITIES = [
    'Москва',
    'Санкт-Петербург',
    'Казань',
    'Новосибирск',
    'Самара',
    'Саратов',
    'Екатеринбург',
]

interface CityAutocompleteProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export const CityAutocomplete = ({
    value,
    onChange,
    placeholder = 'Введите город',
    className,
}: CityAutocompleteProps) => {
    // Фильтруем города по введенному тексту
    const filteredCities = CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
    )

    // Показываем dropdown, если есть текст
    const isOpen = value.length > 0

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const handleClear = () => {
        onChange('')
    }

    const handleCitySelect = (city: string) => {
        onChange(city)
    }

    return (
        <div className={clsx(styles.wrapper, className)}>
            <div className={styles.inputWrapper}>
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
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

            {/* Рендерим dropdown только если есть текст и есть результаты */}
            {isOpen && filteredCities.length > 0 && (
                <div className={styles.dropdownOuter}>
                    <div className={styles.dropdown}>
                        <ul className={styles.list}>
                            {filteredCities.map((city) => (
                                <li
                                    key={city}
                                    className={styles.item}
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}