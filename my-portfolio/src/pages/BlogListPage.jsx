import { useEffect, useState } from 'react'
import { fetchPostsList } from '../services/sheetsApi.js'
import PostCard from '../components/blog/PostCard.jsx'
import styles from './BlogListPage.module.css'

export default function BlogListPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPostsList()
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setError('Failed to load posts.'); setLoading(false) })
  }, [])

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
        {loading && <p className={styles.empty}>Loading posts…</p>}
        {error && <p className={styles.empty}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className={styles.empty}>No posts yet. Check back soon.</p>
        )}
        {!loading && !error && posts.map(post => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}
