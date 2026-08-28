import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { SwiperRef } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'

import styles from './SkillGallery.module.css'

export interface SkillGalleryProps {
  images: string[]
}

const VISIBLE_THUMBS = 3

export const SkillGallery = ({ images }: SkillGalleryProps) => {
  const mainRef = useRef<SwiperRef | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className={styles.main}>
        <img src={images[0]} alt="Skill" />
      </div>
    )
  }

  const thumbImages = images.slice(1)

  const hasMore = thumbImages.length > VISIBLE_THUMBS
  const visibleThumbs = hasMore ? thumbImages.slice(0, VISIBLE_THUMBS) : thumbImages
  const hiddenCount = hasMore ? thumbImages.length - VISIBLE_THUMBS : 0

  const goTo = (index: number) => {
    mainRef.current?.swiper?.slideTo(index)
  }

  return (
    <div className={styles.gallery}>
      {/* Главное изображение */}
      <div className={styles.main}>
        <Swiper
          ref={mainRef}
          modules={[Navigation]}
          navigation={{
            nextEl: `.${styles.arrowNext}`,
            prevEl: `.${styles.arrowPrev}`,
          }}
          className={styles.swiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} alt={`Skill ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          aria-label="Предыдущее"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 12L6 8L10 4" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          aria-label="Следующее"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4L10 8L6 12" />
          </svg>
        </button>
      </div>

      {/* Миниатюры */}
      <div className={styles.thumbs}>
        {visibleThumbs.map((src, i) => {
          const originalIndex = i + 1
          const isActive = activeIndex === originalIndex

          return (
            <button
              key={originalIndex}
              type="button"
              className={`${styles.thumb} ${isActive ? styles.thumbActive : ''}`}
              onClick={() => goTo(originalIndex)}
              aria-label={`Показать изображение ${originalIndex + 1}`}
            >
              <img src={src} alt="" />
            </button>
          )
        })}

        {/* Оверлей +N поверх последней видимой миниатюры, если есть скрытые */}
        {hasMore && <div className={styles.thumbOverlay}>+{hiddenCount}</div>}
      </div>
    </div>
  )
}
