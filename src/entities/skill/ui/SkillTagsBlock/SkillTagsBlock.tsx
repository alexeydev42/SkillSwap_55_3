import React from 'react'
import { SkillTag, SkillTagVariant } from '../../../../shared/ui/SkillTag/SkillTag'
import styles from './SkillTagsBlock.module.css'

interface SkillTagsBlockProps {
  canTeach: {
    variant: SkillTagVariant
    label: string
  }
  wantsToLearn: Array<{
    variant: SkillTagVariant
    label: string
  }>
  maxVisibleTags?: number
}

export const SkillTagsBlock: React.FC<SkillTagsBlockProps> = ({
  canTeach,
  wantsToLearn,
  maxVisibleTags = 2,
}) => {
  const visibleTags = wantsToLearn.slice(0, maxVisibleTags)
  const hiddenTagsCount = wantsToLearn.length - visibleTags.length

  return (
    <div className={styles.container}>
      <div className={styles.tagsBlockContainer}>
        <h3 className={styles.title}>Может научить:</h3>
        <div className={styles.tagsContainer}>
          <SkillTag variant={canTeach.variant} label={canTeach.label} />
        </div>
      </div>
      <div className={styles.tagsBlockContainer}>
        <h3 className={styles.title}>Хочет научиться:</h3>
        <div className={styles.tagsContainer}>
          {visibleTags.map((tag, index) => (
            <SkillTag key={`${tag.label}-${index}`} variant={tag.variant} label={tag.label} />
          ))}
          {hiddenTagsCount > 0 && <SkillTag variant="more" label={`+${hiddenTagsCount}`} />}
        </div>
      </div>
    </div>
  )
}
