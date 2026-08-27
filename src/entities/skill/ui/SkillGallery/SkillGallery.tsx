import { useRef } from 'react'
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

  if (!images || images.length <= 1) {
    return <div className={styles.main}>{images?.[0] && <img src={images[0]} alt="Skill" />}</div>
  }

  const hasMore = images.length > VISIBLE_THUMBS
  const visibleImages = hasMore ? images.slice(0, VISIBLE_THUMBS) : images
  const hiddenCount = images.length - VISIBLE_THUMBS

  const goTo = (index: number) => {
    mainRef.current?.swiper?.slideTo(index)
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Swiper
          ref={mainRef}
          modules={[Navigation]}
          navigation={{
            nextEl: `.${styles.arrowNext}`,
            prevEl: `.${styles.arrowPrev}`,
          }}
          className={styles.swiper}
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
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          aria-label="Следующее"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.thumbs}>
        {visibleImages.map((src, i) => {
          const isLast = i === visibleImages.length - 1 && hasMore
          return (
            <div
              key={i}
              className={styles.thumb}
              onClick={() => goTo(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && goTo(i)}
            >
              <img src={src} alt={`Thumb ${i + 1}`} />
              {isLast && <div className={styles.thumbOverlay}>+{hiddenCount}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
