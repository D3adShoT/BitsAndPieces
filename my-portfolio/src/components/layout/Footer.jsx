import portfolio from '../../data/portfolio.js'
import styles from './Footer.module.css'

export default function Footer() {
  const { contact } = portfolio
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.copy}>© {new Date().getFullYear()} Agraj Naman Mishra</span>
        <div className={styles.links}>
          <a href={`mailto:${contact.email}`} className={styles.link} aria-label="Email">
            {contact.email}
          </a>
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
