import { clsx } from 'clsx';
import { DropdownContainer } from '../../../shared/ui/DropdownContainer';
import NotificationIcon from '../../../shared/assets/icons/icon-idea.svg?react';
import styles from './NotificationsDropdown.module.css';
import { Button } from '../../../shared/ui/Button';

const NEW_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Николай принял ваш обмен',
        subtitle: 'Перейдите в профиль, чтобы обсудить детали',
        date: 'сегодня',
        action: 'Перейти',
    },
    {
        id: 2,
        title: 'Татьяна предлагает вам обмен',
        subtitle: 'Примите обмен, чтобы обсудить детали',
        date: 'сегодня',
        action: 'Перейти',
    },
];

const READ_NOTIFICATIONS = [
    {
        id: 3,
        title: 'Олег предлагает вам обмен',
        subtitle: 'Примите обмен, чтобы обсудить детали',
        date: 'вчера',
    },
    {
        id: 4,
        title: 'Игорь принял ваш обмен',
        subtitle: 'Перейдите в профиль, чтобы обсудить детали',
        date: '23 мая',
    },
];

export const NotificationsDropdown = () => {
    return (
        <DropdownContainer
            className={styles.container}
            style={{ padding: '45px 45px 40px 45px' }}
        >
            {/* Новые уведомления */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Новые уведомления</h3>
                    <span className={styles.actionLink}>Прочитать все</span>
                </div>

                <ul className={styles.list}>
                    {NEW_NOTIFICATIONS.map((item) => (
                        <li key={item.id} className={styles.item}>
                            <div className={styles.itemTop}>
                                <span className={styles.iconWrapper} aria-hidden="true">
                                    <NotificationIcon className={styles.icon} />
                                </span>
                                <div className={styles.textBlock}>
                                    <p className={styles.title}>{item.title}</p>
                                    <p className={styles.subtitle}>{item.subtitle}</p>
                                </div>
                                <span className={styles.date}>{item.date}</span>
                            </div>
                            <div className={styles.buttonWrapper}>
                                <Button size="sm" style={{ height: '40px', padding: '0 22px' }}>
                                    {item.action}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Просмотренные */}
            <div className={clsx(styles.section, styles.readSection)}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Просмотренные</h3>
                    <span className={styles.actionLink}>Очистить</span>
                </div>

                <ul className={styles.list}>
                    {READ_NOTIFICATIONS.map((item) => (
                        <li key={item.id} className={styles.item}>
                            <div className={styles.itemTop}>
                                <span className={styles.iconWrapper} aria-hidden="true">
                                    <NotificationIcon
                                        className={clsx(styles.icon, styles.iconRead)}
                                    />
                                </span>
                                <div className={styles.textBlock}>
                                    <p className={styles.title}>{item.title}</p>
                                    <p className={styles.subtitle}>{item.subtitle}</p>
                                </div>
                                <span className={clsx(styles.date, styles.dateRead)}>
                                    {item.date}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </DropdownContainer>
    );
};
