import { useState, type FormEvent } from 'react'

import { AuthLayout } from '@/widgets/AuthLayout'
import { RegistrationProgress } from '@/widgets/RegistrationProgress'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import SchoolBoardIllustration from '@/shared/assets/illustrations/illustration-school-board.svg'

import styles from './RegistrationStep3.module.css'

const CATEGORIES = [
  { value: '', label: 'Выберите категорию навыка' },
  { value: 'music', label: 'Музыка' },
  { value: 'languages', label: 'Языки' },
  { value: 'design', label: 'Дизайн' },
  { value: 'it', label: 'Программирование' },
  { value: 'cooking', label: 'Кулинария' },
  { value: 'sport', label: 'Спорт' },
]

const SUBCATEGORIES = [
  { value: '', label: 'Выберите подкатегорию навыка' },
  { value: 'guitar', label: 'Гитара' },
  { value: 'piano', label: 'Фортепиано' },
  { value: 'english', label: 'Английский' },
  { value: 'spanish', label: 'Испанский' },
  { value: 'ui', label: 'UI-дизайн' },
  { value: 'ux', label: 'UX-дизайн' },
]

export const RegistrationStep3 = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <AuthLayout
      topContent={<RegistrationProgress currentStep={3} />}
      infoBlockProps={{
        illustration: <img className={styles.illustration} src={SchoolBoardIllustration} alt="" />,
        title: 'Укажите, чем вы готовы поделиться',
        description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <Input
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Категория навыка"
            placeholder="Выберите категорию навыка"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
          />

          <Select
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            options={SUBCATEGORIES}
            value={subcategory}
            onChange={setSubcategory}
          />

          <Textarea
            label="Описание"
            placeholder="Коротко опишите, чему можете научить"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <ImageUpload hint="Перетащите или выберите изображения навыка" />
        </div>

        <div className={styles.buttons}>
          <Button className={styles.button} type="button" variant="secondary">
            Назад
          </Button>
          <Button className={styles.button} type="submit">
            Продолжить
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default RegistrationStep3