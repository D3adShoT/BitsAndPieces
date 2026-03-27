import styles from './TagBadge.module.css'

export default function TagBadge({ label }) {
  return <span className={styles.tag}>{label}</span>
}
