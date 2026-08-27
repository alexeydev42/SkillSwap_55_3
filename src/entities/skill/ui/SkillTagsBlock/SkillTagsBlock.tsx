import React, { useEffect, useRef, useState } from 'react'
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
}

export const SkillTagsBlock: React.FC<SkillTagsBlockProps> = ({ canTeach, wantsToLearn }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!wantsToLearn.length) {
      setVisibleCount(0)
      return
    }
    const container = containerRef.current
    if (!container) {
      return
    }
    const containerStyles = getComputedStyle(container)
    const containerWidth = container.clientWidth
    const gap = parseFloat(containerStyles.gap)
    const rootStyles = getComputedStyle(document.documentElement)
    const fontSize = rootStyles.getPropertyValue('--font-size-caption').trim()
    const fontFamily = rootStyles.getPropertyValue('--font-body').trim()
    const fontWeight = rootStyles.getPropertyValue('--font-weight-regular').trim()
    const padding = parseFloat(rootStyles.getPropertyValue('--space-12')) * 2
    const letterSpacing = parseFloat(rootStyles.getPropertyValue('--letter-spacing-caption').trim())

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    context.font = `${fontWeight} ${fontSize} ${fontFamily}`

    const getTagWidth = (label: string) => {
      const textWidth = context.measureText(label).width
      const letterSpacingWidth = textWidth * letterSpacing
      return textWidth + letterSpacingWidth + padding
    }

    let totalWidth = 0
    let count = 0

    for (const tag of wantsToLearn) {
      const tagWidth = getTagWidth(tag.label)
      const hiddenCount = wantsToLearn.length - count - 1
      const moreWidth = hiddenCount > 0 ? getTagWidth(`+${hiddenCount}`) + gap : 0
      const nextWidth = totalWidth + (count > 0 ? gap : 0) + tagWidth + moreWidth
      if (nextWidth > containerWidth) {
        break
      }
      totalWidth += tagWidth + (count > 0 ? gap : 0)
      count++
    }
    setVisibleCount(count)
  }, [wantsToLearn])

  const visibleTags = wantsToLearn.slice(0, visibleCount)
  const hiddenTagsCount = wantsToLearn.length - visibleCount

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
        <div ref={containerRef} className={styles.tagsContainer}>
          {visibleTags.map((tag, index) => (
            <SkillTag key={`${tag.label}-${index}`} variant={tag.variant} label={tag.label} />
          ))}
          {hiddenTagsCount > 0 && <SkillTag variant="more" label={`+${hiddenTagsCount}`} />}
        </div>
      </div>
    </div>
  )
}
