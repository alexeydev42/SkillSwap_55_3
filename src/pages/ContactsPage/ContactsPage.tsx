import { Footer } from '@/widgets/Footer'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'

import styles from './ContactsPage.module.css'

const CONTACTS = [
  {
    label: 'Telegram',
    value: '@alexeydev42',
    href: 'https://t.me/alexeydev42',
  },
  {
    label: 'Email',
    value: 'alexey.dev42@gmail.com',
    href: 'mailto:alexey.dev42@gmail.com',
  },
  {
    label: 'GitHub',
    value: 'alexeydev42',
    href: 'https://github.com/alexeydev42',
  },
]

export const ContactsPage = () => {
  return (
    <div className={styles.page}>
      <HeaderContainer />

      <main className={styles.main}>
        <section className={styles.contacts} aria-labelledby="contacts-title">
          <h1 id="contacts-title" className={styles.title}>
            Контакты
          </h1>

          <p className={styles.description}>
            Связаться со мной по вопросам проекта или работы можно удобным способом.
          </p>

          <ul className={styles.list}>
            {CONTACTS.map((contact) => (
              <li className={styles.item} key={contact.label}>
                <span className={styles.label}>{contact.label}</span>

                <a
                  className={styles.link}
                  href={contact.href}
                  target={contact.label === 'Email' ? undefined : '_blank'}
                  rel={contact.label === 'Email' ? undefined : 'noreferrer'}
                >
                  {contact.value}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}
