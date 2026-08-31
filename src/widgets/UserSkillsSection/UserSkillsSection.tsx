import { SectionHeader } from '@/widgets/SectionHeader';
import { UserSkillCard } from '@/widgets/UserSkillCard';
import type { UserSkillCardData } from '@/widgets/UserSkillCard/UserSkillCard'

import styles from './UserSkillsSection.module.css';

export interface UserSkillsSectionItem extends UserSkillCardData {
    id: string;
}

export interface UserSkillsSectionProps {
    title: string;
    items: UserSkillsSectionItem[];
    showViewAll?: boolean;
    onFavoriteClick: (id: string) => void
    onDetailsClick: (id: string) => void
}

export const UserSkillsSection = ({title, items, showViewAll, onFavoriteClick, onDetailsClick}: UserSkillsSectionProps) => {
    return(
        <div className={styles.section}>
            <SectionHeader title={title} showViewAllButton={showViewAll}/>
            <div className={styles.grid}>
                {items.map((item) => (
                    <UserSkillCard
                    key={item.id}
                    user={item}
                    onFavoriteClick={() => onFavoriteClick(item.id)}
                    onDetailsClick={() => onDetailsClick(item.id)}
                    />
                ))}
            </div>
        </div>
        
    )
}