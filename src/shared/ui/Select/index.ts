export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;          // текст ошибки
  className?: string;
  id?: string;
  // для react-hook-form
  name?: string;
  onBlur?: () => void;
}