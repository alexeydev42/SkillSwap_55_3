import { Input } from '@/shared/ui/Input'
import type { InputProps } from '@/shared/ui/Input'

import iconSearch from '@/shared/assets/icons/icon-search.svg'
import iconCross from '@/shared/assets/icons/icon-cross.svg'

import styles from './SearchInput.module.css'

export interface SearchInputProps extends Pick<
  InputProps,
  'disabled' | 'className' | 'wrapperClassName' | 'error' | 'helperText' | 'borderless'
> {
  value?: string
  onChange?: InputProps['onChange']
  /** По умолчанию — текст плейсхолдера из макета, переопределяется редко. */
  placeholder?: string
}

/**
 * SearchInput — поле поиска (VERST-04), собрано поверх базового Input (VERST-03).
 * Дублирования вёрстки самого поля ввода нет: используется icon/trailingIcon-слоты
 * и type='text' базового компонента.
 * Состояния default/focus наследуются от Input как есть.
 *
 * Значение хранится локально (useState) только для того, чтобы показывать
 * крестик очистки, когда поле не пустое, и очищать поле по клику на него —
 * это чисто визуальное поведение, без запросов к серверу и логики фильтрации.
 */
export function SearchInput({
  placeholder = 'Искать навык',
  value = '',
  onChange,
  ...rest
}: SearchInputProps) {
  return (
    <Input
      {...rest}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={<img src={iconSearch} alt="" />}
      trailingIcon={
        value ? (
          <button
            type="button"
            onClick={() => {
              onChange?.({
                target: {
                  value: '',
                },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            aria-label="Очистить поле поиска"
            className={styles['clear-button']}
          >
            <img src={iconCross} alt="" />
          </button>
        ) : undefined
      }
    />
  )
}
