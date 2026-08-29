import { clsx } from 'clsx';
import { DropdownContainer } from '../../../shared/ui/DropdownContainer';
import notificationIcon from '../../../shared/assets/icons/icon-idea.svg';
import styles from './NotificationsDropdown.module.css';
import { Button } from '../../../shared/ui/Button';

const NEW_NOTIFICATIONS = [
    {
        id: 1,
        title: 'Николай принял ваш обмен',
        subtitle: 'Перейдите в профиль, чтобы обсудить детали',
        date: 'сегодня',
    },
    {
        id: 2,
        title: 'Татьяна предлагает вам обмен',
        subtitle: 'Примите обмен, чтобы обсудить детали',
        date: 'сегодня',
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
        <DropdownContainer className={styles.container}>
            {/* Новые уведомления */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Новые уведомления</h3>
                    <span className={styles.actionLink}>Прочитать все</span>
                </div>

                <ul className={styles.list}>
                    {NEW_NOTIFICATIONS.map((item) => (
                        <li key={item.id} className={styles.item}>
                            {/* Верхний ряд: иконка + текст */}
                            <div className={styles.itemTop}>
                                <img
                                    src={notificationIcon}
                                    alt=""
                                    className={styles.icon}
                                    width={40}
                                    height={40}
                                />
                                <div className={styles.textBlock}>
                                    <div className={styles.row}>
                                        <span className={styles.title}>{item.title}</span>
                                        <span className={styles.date}>{item.date}</span>
                                    </div>
                                    <span className={styles.subtitle}>{item.subtitle}</span>
                                </div>
                            </div>

                            {/* Кнопка — отдельный элемент под верхним рядом */}
                            <div className={styles.buttonWrapper}>
                                <Button size="md">Перейти</Button>
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
                        <li key={item.id} className={clsx(styles.item, styles.itemRead)}>
                            <img
                                src={notificationIcon}
                                alt=""
                                className={styles.icon}
                                width={40}
                                height={40}
                            />
                            <div className={styles.content}>
                                <div className={styles.row}>
                                    <span className={styles.title}>{item.title}</span>
                                    <span className={styles.date}>{item.date}</span>
                                </div>
                                <span className={styles.subtitle}>{item.subtitle}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </DropdownContainer>
    );
};