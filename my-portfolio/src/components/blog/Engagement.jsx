import { useState } from 'react'
import { incrementLikes, incrementShares } from '../../services/sheetsApi.js'
import styles from './Engagement.module.css'

export default function Engagement({ slug, initialLikes, initialShares }) {
  const [likes, setLikes] = useState(initialLikes ?? 0)
  const [shares, setShares] = useState(initialShares ?? 0)
  const [likePending, setLikePending] = useState(false)
  const [sharePending, setSharePending] = useState(false)

  async function handleLike() {
    setLikePending(true)
    try {
      const count = await incrementLikes(slug)
      setLikes(count)
    } catch {
      // silently ignore — count already shown
    }
    setLikePending(false)
  }

  async function handleShare() {
    setSharePending(true)
    try {
      const count = await incrementShares(slug)
      setShares(count)
    } catch { /* ignore */ }

    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch { /* ignore */ }

    setSharePending(false)
  }

  return (
    <div className={styles.bar}>
      <button
        className={styles.btn}
        onClick={handleLike}
        disabled={likePending}
        aria-label="Like this post"
      >
        <span aria-hidden="true">♡</span>
        {likes > 0 && <span>{likes}</span>}
        <span>Like</span>
      </button>
      <button
        className={styles.btn}
        onClick={handleShare}
        disabled={sharePending}
        aria-label="Share this post"
      >
        <span aria-hidden="true">↗</span>
        {shares > 0 && <span>{shares}</span>}
        <span>Share</span>
      </button>
    </div>
  )
}
