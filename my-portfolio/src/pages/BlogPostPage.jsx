import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import TagBadge from '../components/blog/TagBadge.jsx'
import Engagement from '../components/blog/Engagement.jsx'
import Comments from '../components/blog/Comments.jsx'
import { fetchPost } from '../services/sheetsApi.js'
import styles from './BlogPostPage.module.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchPost(slug).then(data => {
      if (cancelled) return
      if (!data) setNotFound(true)
      else setPost(data)
    })
    return () => { cancelled = true }
  }, [slug])

  if (notFound) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <p>Post not found.</p>
          <Link to="/blog">← Back to blog</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container">
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  const formatted = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="container">
      <div className={styles.article}>
        <Link to="/blog" className={styles.back}>← Back to blog</Link>
        <div className={styles.meta}>
          <time dateTime={post.date} className={styles.date}>{formatted}</time>
          <div className={styles.tags}>
            {post.tags.map(tag => <TagBadge key={tag} label={tag} />)}
          </div>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <hr className={styles.divider} />
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <Engagement slug={slug} initialLikes={post.likes} initialShares={post.shares} />
        <Comments slug={slug} />
      </div>
    </div>
  )
}
