import { useRef, type ChangeEvent, type ReactNode } from 'react'
import clsx from 'clsx'

import GalleryAddIcon from '../../assets/icons/icon-gallery-add.svg?react'
import { validateAndConvertFiles, type FileUploadType } from '../../lib/fileValidation'
import styles from './ImageUpload.module.css'

type ImageUploadProps = {
  images?: string[]
  error?: string
  hint?: string
  actionText?: string
  className?: string
  emptyContent?: ReactNode
  previewContent?: ReactNode
  uploadType?: FileUploadType
  onImagesChange?: (images: string[]) => void
  onError?: (error: string | undefined) => void
}

export const ImageUpload = ({
  images = [],
  error,
  hint = 'Перетащите или выберите изображения',
  actionText = 'Выбрать изображения',
  className,
  emptyContent,
  previewContent,
  uploadType = 'skillImages',
  onImagesChange,
  onError,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasImages = images.length > 0
  const isAvatar = uploadType === 'avatar'

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    // Позволяет повторно выбрать тот же файл после ошибки или удаления.
    event.target.value = ''

    const result = await validateAndConvertFiles(files, uploadType)

    if (!result.success) {
      onError?.(result.error)
      return
    }

    onError?.(undefined)
    onImagesChange?.(result.files)
  }

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
            <div
            className={styles.customContent}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event)=>{if(event.key === 'Enter'|| event.key === ' '){handleClick()}}}>
            {previewContent}</div>
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
          <div
          className={styles.customContent}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event)=>{if(event.key === 'Enter' || event.key === ''){
            handleClick()}}}>
          {emptyContent}</div>
        ) : (
          <>
            <p className={styles.hint}>{hint}</p>

            <button type="button" className={styles.action} onClick={handleClick}>
              <GalleryAddIcon className={styles.icon} />
              <span className={styles.actionText}>{actionText}</span>
            </button>
          </>
        )}

        <input
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple={!isAvatar}
          onChange={handleFileChange}
        />
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}
