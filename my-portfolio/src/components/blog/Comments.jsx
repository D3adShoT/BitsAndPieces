import { useEffect, useState } from 'react'
import { fetchComments, addComment } from '../../services/sheetsApi.js'
import styles from './Comments.module.css'

export default function Comments({ slug }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchComments(slug).then(data => {
      if (cancelled) return
      setComments(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [slug])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      const comment = await addComment(slug, name.trim(), text.trim())
      setComments(prev => [comment, ...prev])
      setName('')
      setText('')
    } catch {
      setSubmitError('Failed to post comment. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        Comments{comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          maxLength={100}
          className={styles.input}
        />
        <textarea
          placeholder="Leave a comment…"
          value={text}
          onChange={e => setText(e.target.value)}
          required
          maxLength={2000}
          rows={4}
          className={styles.textarea}
        />
        {submitError && <p className={styles.error}>{submitError}</p>}
        <button type="submit" disabled={submitting} className={styles.submit}>
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>

      <div className={styles.list}>
        {loading && <p className={styles.empty}>Loading comments…</p>}
        {!loading && comments.length === 0 && (
          <p className={styles.empty}>No comments yet. Be the first!</p>
        )}
        {comments.map(c => (
          <div key={c.id} className={styles.comment}>
            <div className={styles.commentMeta}>
              <span className={styles.commentName}>{c.name}</span>
              <time className={styles.commentDate}>
                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </time>
            </div>
            <p className={styles.commentText}>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
