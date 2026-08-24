import React, { useId } from 'react';
import styles from './Select.module.css';

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  className = '',
  id,
  name,
  onBlur,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.selectContainer} ${error ? styles.error : ''}`}>
        <select
          id={selectId}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={styles.select}
          name={name}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};