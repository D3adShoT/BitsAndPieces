import postsIndex from '../data/posts/posts-index.json'
import PostCard from '../components/blog/PostCard.jsx'
import styles from './BlogListPage.module.css'

export default function BlogListPage() {
  return (
    <div className="container">
      <div className={styles.header}>
        <p className="section-label">Blog</p>
        <h1 className={styles.title}>Salesforce Insights</h1>
        <p className={styles.subtitle}>
          Technical deep-dives, release highlights, and best practices from the Salesforce ecosystem.
        </p>
      </div>
      <div className={styles.list}>
        {postsIndex.length === 0 ? (
          <p className={styles.empty}>No posts yet. Check back soon.</p>
        ) : (
          postsIndex.map(post => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </div>
  )
}
