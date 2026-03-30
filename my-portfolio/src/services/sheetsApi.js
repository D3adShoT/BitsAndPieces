const BASE_URL = '/api/sheets'

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'api_error')
  return data
}

export async function fetchPostsList() {
  try {
    const data = await apiFetch(`${BASE_URL}?action=listPosts`)
    return data.posts
  } catch {
    return []
  }
}

export async function fetchPost(slug) {
  try {
    const data = await apiFetch(`${BASE_URL}?action=getPost&slug=${encodeURIComponent(slug)}`)
    return data.post
  } catch {
    return null
  }
}

export async function fetchComments(slug) {
  try {
    const data = await apiFetch(`${BASE_URL}?action=getComments&slug=${encodeURIComponent(slug)}`)
    return data.comments
  } catch {
    return []
  }
}

export async function addComment(slug, name, text) {
  const data = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addComment', slug, name, text })
  })
  return data.comment
}

export async function incrementLikes(slug) {
  const data = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'incrementLikes', slug })
  })
  return data.count
}

export async function incrementShares(slug) {
  const data = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'incrementShares', slug })
  })
  return data.count
}

// Agent-facing: publish or update a post without a code deploy
export async function publishPost(postData) {
  const data = await apiFetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'publishPost', ...postData })
  })
  return { action: data.action }
}
