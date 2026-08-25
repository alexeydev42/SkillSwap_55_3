import { forwardRef, useEffect, useState, type InputHTMLAttributes } from 'react'
import DatePickerLibrary from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { ru } from 'date-fns/locale'

import clsx from 'clsx'

import CalendarIcon from '../../assets/icons/icon-calendar.svg?react'
import ChevronDownIcon from '../../assets/icons/icon-chevron-down.svg?react'

import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

import styles from './DatePicker.module.css'

registerLocale('ru', ru)

interface CustomInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: string
  onClick?: () => void
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, className, ...props }, ref) => (
    <div className={styles['input-wrapper']}>
      <input
        {...props}
        ref={ref}
        value={value ?? ''}
        className={clsx(styles.input, className)}
      />

      <IconButton
        icon={<CalendarIcon />}
        onClick={onClick}
        aria-label="Открыть календарь"
        className={styles['calendar-button']}
      />
    </div>
  ),
)

CustomInput.displayName = 'CustomInput'

export interface DatePickerProps {
  label?: string
  placeholder?: string
  selected?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
  open?: boolean
}

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

export const DataPicker = ({
  label,
  placeholder = 'ДД.ММ.ГГГГ',
  selected = null,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  error,
  helperText,
  className,
  open = false,
}: DatePickerProps) => {
  const [draftDate, setDraftDate] = useState<Date | null>(selected)
  const [isOpen, setIsOpen] = useState(open)

  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false)

  useEffect(() => {
    setDraftDate(selected)
  }, [selected])

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleChange = (date: Date | null) => {
    setDraftDate(date)
  }

  const handleCancel = () => {
    setDraftDate(selected)
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
    setIsOpen(false)
  }

  const handleConfirm = () => {
    onChange?.(draftDate)
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
    setIsOpen(false)
  }

  const closePickers = () => {
    setIsMonthPickerOpen(false)
    setIsYearPickerOpen(false)
  }

  return (
    <div className={clsx(styles['date-picker'], className)}>
      {label && <label className={styles['input-label']}>{label}</label>}

      <div
        className={clsx(
          styles['input-container'],
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        <DatePickerLibrary
          selected={draftDate}
          onChange={handleChange}
          locale="ru"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder}
          dateFormat="dd.MM.yyyy"
          customInput={<CustomInput />}
          open={isOpen}
          onCalendarOpen={() => setIsOpen(true)}
          onClickOutside={handleCancel}
          calendarClassName={styles.calendar}
          popperClassName={styles.popper}
          popperPlacement="bottom-start"
          renderCustomHeader={({ date, changeMonth, changeYear }) => (
            <div className={styles.header}>
              <button
                type="button"
                className={styles['month-selector']}
                onClick={() => {
                  setIsMonthPickerOpen((prev) => !prev)
                  setIsYearPickerOpen(false)
                }}
                aria-label="Выбрать месяц"
              >
                <span>{MONTHS[date.getMonth()]}</span>
                <ChevronDownIcon />
              </button>

              <button
                type="button"
                className={styles['year-selector']}
                onClick={() => {
                  setIsYearPickerOpen((prev) => !prev)
                  setIsMonthPickerOpen(false)
                }}
                aria-label="Выбрать год"
              >
                <span>{date.getFullYear()}</span>
                <ChevronDownIcon />
              </button>

              {isMonthPickerOpen && (
                <div className={styles['month-dropdown']}>
                  {MONTHS.map((month, index) => {
                    const isCurrentMonth = index === date.getMonth()

                    return (
                      <button
                        key={month}
                        type="button"
                        className={clsx(
                          styles['dropdown-item'],
                          isCurrentMonth && styles.selected,
                        )}
                        onClick={() => {
                          changeMonth(index)
                          closePickers()
                        }}
                      >
                        {month}
                      </button>
                    )
                  })}
                </div>
              )}

              {isYearPickerOpen && (
                <div className={styles['year-dropdown']}>
                  {Array.from({ length: 21 }, (_, index) => {
                    const year = date.getFullYear() - 10 + index
                    const isCurrentYear = year === date.getFullYear()

                    return (
                      <button
                        key={year}
                        type="button"
                        className={clsx(
                          styles['dropdown-item'],
                          isCurrentYear && styles.selected,
                        )}
                        onClick={() => {
                          changeYear(year)
                          closePickers()
                        }}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          formatWeekDay={(day) => {
            const dayMap: Record<string, string> = {
              понедельник: 'Пн',
              вторник: 'Вт',
              среда: 'Ср',
              четверг: 'Чт',
              пятница: 'Пт',
              суббота: 'Сб',
              воскресенье: 'Вс',
            }

            return dayMap[day.toLowerCase()] ?? day
          }}
          calendarStartDay={1}
        >
          <div className={styles.footer}>
            <Button
              variant="secondary"
              size="md"
              onClick={handleCancel}
              className={styles['footer-button']}
            >
              Отменить
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              className={styles['footer-button']}
            >
              Выбрать
            </Button>
          </div>
        </DatePickerLibrary>
      </div>

      {error ? (
        <span className={styles['error-text']}>{error}</span>
      ) : (
        helperText && (
          <span className={styles['helper-text']}>{helperText}</span>
        )
      )}
    </div>
  )
}
