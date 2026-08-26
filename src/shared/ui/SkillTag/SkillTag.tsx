import React from 'react'
import clsx from 'clsx'
import { SkillTagCategory } from '../../lib/constants'
import styles from './SkillTag.module.css'

interface SkillTagProps {
  variant: SkillTagCategory
  label: string
}

export const SkillTag: React.FC<SkillTagProps> = ({ variant, label }) => {
  return <span className={clsx(styles.tag, styles[variant])}>{label}</span>
}
