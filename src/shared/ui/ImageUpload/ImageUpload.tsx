import clsx from 'clsx'

import GalleryAddIcon from '../../assets/icons/icon-gallery-add.svg?react'
import styles from './ImageUpload.module.css'

type ImageUploadProps = {
  images?: string[]
  error?: string
  hint?: string
  actionText?: string
}

export const ImageUpload = ({
  images = [],
  error,
  hint = 'Перетащите или выберите изображения',
  actionText = 'Выбрать изображения',
}: ImageUploadProps) => {
  const hasImages = images.length > 0

  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.imageUpload, !hasImages && styles.empty, error && styles.error)}>
        {hasImages ? (
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
