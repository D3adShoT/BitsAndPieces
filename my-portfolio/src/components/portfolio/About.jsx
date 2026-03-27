import portfolio from '../../data/portfolio.js'
import styles from './About.module.css'

export default function About() {
  const { bio, education, languages } = portfolio
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <p className="section-label">About</p>
        <h2 className="section-title">Background</h2>
        <div className={styles.grid}>
          <p className={styles.bio}>{bio}</p>
          <div className={styles.sidebar}>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Education</h3>
              <p className={styles.blockMain}>{education.degree}</p>
              <p className={styles.blockSub}>{education.institution} · {education.year}</p>
            </div>
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>Languages</h3>
              {languages.map(l => (
                <p key={l.name} className={styles.blockMain}>
                  {l.name} <span className={styles.blockSub}>— {l.level}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
