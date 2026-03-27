import { Link } from 'react-router-dom'
import TagBadge from './TagBadge.jsx'
import styles from './PostCard.module.css'

export default function PostCard({ post }) {
  const { slug, title, date, excerpt, tags } = post
  const formatted = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <time className={styles.date} dateTime={date}>{formatted}</time>
        <div className={styles.tags}>
          {tags.map(tag => <TagBadge key={tag} label={tag} />)}
        </div>
      </div>
      <h2 className={styles.title}>
        <Link to={`/blog/${slug}`}>{title}</Link>
      </h2>
      <p className={styles.excerpt}>{excerpt}</p>
      <Link to={`/blog/${slug}`} className={styles.readMore}>
        Read more →
      </Link>
    </article>
  )
}
