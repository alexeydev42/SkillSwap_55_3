import { useState, type ChangeEvent, type FormEvent } from 'react'

import { categories } from '@/shared/config'
import { FILE_LIMITS } from '@/shared/lib/fileValidation'
import {
  TEXT_LIMITS,
  validateOfferedSkillDescription,
  validateOfferedSkillTitle,
} from '@/shared/lib/validators'
import type { OfferedSkill } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import { useAppDispatch } from '@/store/hooks'
import { updateOfferedSkill } from '@/store/thunks/updateOfferedSkill'

import styles from './EditSkillModal.module.css'

const CATEGORY_OPTIONS: SelectOption[] = categories.map(({ id, name }) => ({
  value: id,
  label: name,
}))

const getSubcategoryOptions = (categoryId: string): SelectOption[] =>
  categories
    .find(({ id }) => id === categoryId)
    ?.subcategories.map(({ id, name }) => ({
      value: id,
      label: name,
    })) ?? []

export interface EditSkillModalProps {
  skill: OfferedSkill
  onClose: () => void
}

export const EditSkillModal = ({ skill, onClose }: EditSkillModalProps) => {
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState(skill.title)
  const [categoryId, setCategoryId] = useState(skill.categoryId)
  const [subcategoryId, setSubcategoryId] = useState(skill.subcategoryId)
  const [description, setDescription] = useState(skill.description)
  const [images, setImages] = useState(skill.imageUrls)

  const [titleError, setTitleError] = useState<string>()
  const [categoryError, setCategoryError] = useState<string>()
  const [subcategoryError, setSubcategoryError] = useState<string>()
  const [descriptionError, setDescriptionError] = useState<string>()
  const [imageError, setImageError] = useState<string>()
  const [saveError, setSaveError] = useState<string>()

  const subcategoryOptions = getSubcategoryOptions(categoryId)

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setTitleError(undefined)
    setSaveError(undefined)
  }

  const handleCategoryChange = (nextCategoryId: string) => {
    const nextSubcategoryOptions = getSubcategoryOptions(nextCategoryId)

    const subcategoryStillMatches = nextSubcategoryOptions.some(
      ({ value }) => value === subcategoryId,
    )

    setCategoryId(nextCategoryId)
    setCategoryError(undefined)
    setSaveError(undefined)

    if (!subcategoryStillMatches) {
      setSubcategoryId('')
      setSubcategoryError(undefined)
    }
  }

  const handleSubcategoryChange = (nextSubcategoryId: string) => {
    const belongsToCategory = subcategoryOptions.some(({ value }) => value === nextSubcategoryId)

    setSubcategoryId(belongsToCategory ? nextSubcategoryId : '')
    setSubcategoryError(undefined)
    setSaveError(undefined)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
    setDescriptionError(undefined)
    setSaveError(undefined)
  }

  const handleImagesChange = (nextImages: string[]) => {
    setImages(nextImages)
    setImageError(undefined)
    setSaveError(undefined)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextSkill: OfferedSkill = {
      title: title.trim(),
      categoryId,
      subcategoryId,
      description: description.trim(),
      imageUrls: images,
    }

    const nextTitleError = validateOfferedSkillTitle(nextSkill.title)
    const nextDescriptionError = validateOfferedSkillDescription(nextSkill.description)

    const selectedCategory = categories.find(({ id }) => id === nextSkill.categoryId)

    const hasValidCategory = Boolean(selectedCategory)

    const hasValidSubcategory =
      selectedCategory?.subcategories.some(({ id }) => id === nextSkill.subcategoryId) ?? false

    const nextCategoryError = hasValidCategory
      ? undefined
      : 'Категория навыка: выберите значение из списка'

    const nextSubcategoryError = hasValidSubcategory
      ? undefined
      : 'Подкатегория навыка: выберите значение из списка'

    const nextImageError =
      nextSkill.imageUrls.length === 0
        ? 'Необходимо выбрать хотя бы одно изображение'
        : nextSkill.imageUrls.length > FILE_LIMITS.skillImages.max
          ? `Можно загрузить не более ${FILE_LIMITS.skillImages.max} изображений`
          : undefined

    setTitleError(nextTitleError?.message)
    setCategoryError(nextCategoryError)
    setSubcategoryError(nextSubcategoryError)
    setDescriptionError(nextDescriptionError?.message)
    setImageError(nextImageError)

    if (
      nextTitleError ||
      nextCategoryError ||
      nextSubcategoryError ||
      nextDescriptionError ||
      nextImageError
    ) {
      return
    }

    const isSaved = dispatch(updateOfferedSkill(nextSkill))

    if (!isSaved) {
      setSaveError('Не удалось сохранить изменения. Попробуйте ещё раз.')
      return
    }

    onClose()
  }

  return (
    <Modal className={styles.modal} ariaLabel="Редактировать навык">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>Редактировать навык</h2>

        <div className={styles.fields}>
          <Input
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={title}
            onChange={handleTitleChange}
            error={titleError}
            maxLength={TEXT_LIMITS.offeredSkillTitle.max}
          />

          <Select
            label="Категория навыка"
            placeholder="Выберите категорию навыка"
            options={CATEGORY_OPTIONS}
            value={categoryId}
            onChange={handleCategoryChange}
            error={categoryError}
          />

          <Select
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            options={subcategoryOptions}
            value={subcategoryId}
            onChange={handleSubcategoryChange}
            disabled={!categoryId}
            error={subcategoryError}
          />

          <Textarea
            label="Описание"
            placeholder="Коротко опишите, чему можете научить"
            value={description}
            onChange={handleDescriptionChange}
            error={descriptionError}
            maxLength={TEXT_LIMITS.offeredSkillDescription.max}
          />

          <ImageUpload
            images={images}
            error={imageError}
            uploadType="skillImages"
            onImagesChange={handleImagesChange}
            onError={setImageError}
            hint="Перетащите или выберите изображения навыка"
          />
        </div>

        {saveError && (
          <p className={styles.saveError} role="alert">
            {saveError}
          </p>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>

          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Modal>
  )
}
