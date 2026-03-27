import portfolio from '../../data/portfolio.js'
import styles from './Hero.module.css'

export default function Hero() {
  const { meta, certifications, contact } = portfolio
  return (
    <section className={styles.hero}>
      <div className="container">
        <p className={styles.greeting}>Hi, I'm</p>
        <h1 className={styles.name}>{meta.name}</h1>
        <p className={styles.title}>{meta.title}</p>
        <p className={styles.tagline}>{meta.tagline}</p>
        <div className={styles.actions}>
          <a href={`mailto:${contact.email}`} className={styles.btnPrimary}>
            Get in touch
          </a>
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
              LinkedIn
            </a>
          )}
        </div>
        <div className={styles.certBadges}>
          {certifications.map(cert => (
            <span key={cert} className={styles.certBadge}>{cert}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
