import portfolio from '../../data/portfolio.js'
import styles from './Contact.module.css'

export default function Contact() {
  const { contact } = portfolio
  return (
    <section className="section">
      <div className="container">
        <p className="section-label">Contact</p>
        <h2 className="section-title">Get In Touch</h2>
        <div className={styles.cards}>
          <a href={`mailto:${contact.email}`} className={styles.card}>
            <span className={styles.icon}>✉</span>
            <div>
              <p className={styles.label}>Email</p>
              <p className={styles.value}>{contact.email}</p>
            </div>
          </a>
          <a href={`tel:${contact.phone}`} className={styles.card}>
            <span className={styles.icon}>📞</span>
            <div>
              <p className={styles.label}>Phone</p>
              <p className={styles.value}>{contact.phone}</p>
            </div>
          </a>
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.card}>
              <span className={styles.icon}>in</span>
              <div>
                <p className={styles.label}>LinkedIn</p>
                <p className={styles.value}>agrajnaman</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
