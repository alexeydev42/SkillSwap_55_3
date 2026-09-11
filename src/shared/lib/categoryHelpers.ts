import type { Category, Subcategory } from '@/shared/types'
import type { SkillTagVariant } from '@/shared/ui/SkillTag/SkillTag'

interface SubcategoryData {
  category: Category
  subcategory: Subcategory
}

const CATEGORY_VARIANTS: Record<string, SkillTagVariant> = {
  'business-career': 'business',
  'foreign-languages': 'languages',
  'home-comfort': 'home',
  'creativity-art': 'creative',
  'education-development': 'education',
  'health-lifestyle': 'health',
}

// Находит подкатегорию вместе с её родительской категорией.
export const findSubcategory = (
  categories: Category[],
  subcategoryId: string,
): SubcategoryData | undefined => {
  for (const category of categories) {
    const subcategory = category.subcategories.find(({ id }) => id === subcategoryId)

    if (subcategory) {
      return {
        category,
        subcategory,
      }
    }
  }

  return undefined
}

// Возвращает вариант оформления тега для категории.
export const getCategoryVariant = (categoryId: string): SkillTagVariant =>
  CATEGORY_VARIANTS[categoryId] ?? 'more'
