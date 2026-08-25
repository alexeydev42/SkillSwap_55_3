import { Input } from '@/shared/ui/Input'
import type { InputProps } from '@/shared/ui/Input'

import iconSearch from '@/shared/assets/icons/icon-search.svg'

export interface SearchInputProps extends Pick<
  InputProps,
  'disabled' | 'className' | 'error' | 'helperText'
> {
  /** По умолчанию — текст плейсхолдера из макета, переопределяется редко. */
  placeholder?: string
}

/**
 * SearchInput — поле поиска (VERST-...), собрано поверх базового Input (VERST-03).
 * Дублирования вёрстки самого поля ввода нет: используется icon-слот и type='text'
 * базового компонента, специфичны только иконка лупы и placeholder.
 * Состояния default/focus наследуются от Input как есть.
 *
 * Только визуальная часть: ввод текста не запускает никаких запросов/фильтрации —
 * это будет добавлено отдельно при внедрении в Header (VERST-38).
 */
export function SearchInput({ placeholder = 'Искать навык', ...rest }: SearchInputProps) {
  return (
    <Input {...rest} type="text" placeholder={placeholder} icon={<img src={iconSearch} alt="" />} />
  )
}
