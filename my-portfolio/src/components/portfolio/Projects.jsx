import portfolio from '../../data/portfolio.js'
import styles from './Projects.module.css'

export default function Projects() {
  const { projects } = portfolio
  return (
    <section className="section">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Project Highlights</h2>
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.techRow}>
                {project.tech.map(t => (
                  <span key={t} className={styles.techTag}>{t}</span>
                ))}
              </div>
              <h3 className={styles.name}>{project.name}</h3>
              <ul className={styles.bullets}>
                {project.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
