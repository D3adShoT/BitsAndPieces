import portfolio from '../../data/portfolio.js'
import styles from './Skills.module.css'

export default function Skills() {
  const { skills } = portfolio
  return (
    <section className="section">
      <div className="container">
        <p className="section-label">Skills</p>
        <h2 className="section-title">Technical Expertise</h2>
        <div className={styles.groups}>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className={styles.group}>
              <h3 className={styles.groupTitle}>{category}</h3>
              <div className={styles.chips}>
                {items.map(item => (
                  <span key={item} className={styles.chip}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
