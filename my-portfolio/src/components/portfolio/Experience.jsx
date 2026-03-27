import portfolio from '../../data/portfolio.js'
import styles from './Experience.module.css'

export default function Experience() {
  const { experience } = portfolio
  return (
    <section className="section">
      <div className="container">
        <p className="section-label">Work Experience</p>
        <h2 className="section-title">Career History</h2>
        <div className={styles.timeline}>
          {experience.map((job, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.node} />
              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.company}>{job.company}</h3>
                    <p className={styles.role}>{job.role}</p>
                  </div>
                  <span className={styles.period}>{job.period}</span>
                </div>
                {job.tech && (
                  <p className={styles.tech}>{job.tech}</p>
                )}
                <ul className={styles.bullets}>
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
