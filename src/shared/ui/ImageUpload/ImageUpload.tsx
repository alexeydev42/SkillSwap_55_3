import type { ReactNode } from 'react'
import clsx from 'clsx'

import GalleryAddIcon from '../../assets/icons/icon-gallery-add.svg?react'
import styles from './ImageUpload.module.css'

type ImageUploadProps = {
  images?: string[]
  error?: string
  hint?: string
  actionText?: string
  className?: string
  emptyContent?: ReactNode
  previewContent?: ReactNode
}

export const ImageUpload = ({
  images = [],
  error,
  hint = 'Перетащите или выберите изображения',
  actionText = 'Выбрать изображения',
  className,
  emptyContent,
  previewContent,
}: ImageUploadProps) => {
  const hasImages = images.length > 0

  return (
    <div className={styles.wrapper}>
      <div
        className={clsx(
          styles.imageUpload,
          !hasImages && styles.empty,
          error && styles.error,
          className,
        )}
      >
        {hasImages ? (
          previewContent !== undefined ? (
            previewContent
          ) : (
            <div className={styles.previewGrid}>
              {images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  className={styles.previewImage}
                  src={image}
                  alt={`Превью изображения ${index + 1}`}
                />
              ))}
            </div>
          )
        ) : emptyContent !== undefined ? (
          emptyContent
        ) : (
          <>
            <p className={styles.hint}>{hint}</p>

            <div className={styles.action}>
              <GalleryAddIcon className={styles.icon} />
              <span className={styles.actionText}>{actionText}</span>
            </div>
          </>
        )}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}
