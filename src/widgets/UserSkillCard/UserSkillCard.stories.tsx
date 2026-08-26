import { UserSkillCard } from './UserSkillCard';

export default {
  title: 'Widgets/UserSkillCard',
  component: UserSkillCard,
};

export const Default = {
  args: {
    user: {
      name: 'Иван',
      city: 'Санкт-Петербург',
      age: 34,
      avatarUrl: null,
      bio: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
      teachTags: ['Английский язык'],
      learnTags: ['Тайм менеджмент', 'Медитация'],
    },
    isFavorite: false,
    onFavoriteClick: () => console.log('favorite clicked'),
    onDetailsClick: () => console.log('details clicked'),
  },
};
