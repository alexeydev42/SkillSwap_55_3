import React from 'react'
import { SkillCategoryType, SKILL_CATEGORY_COLORS } from '../../lib/constants'
import styles from './SkillTag.module.css'

interface SkillTagProps {
  category: SkillCategoryType
  label?: string
}

export const SkillTag: React.FC<SkillTagProps> = ({ category, label }) => {
  const color = SKILL_CATEGORY_COLORS[category]
  return (
    <span className={`${styles.tag}`} style={{ backgroundColor: color }}>
      {label || category}
    </span>
  )
}
