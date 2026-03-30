export const handler = async (event) => {
  const SHEETS_API_URL = process.env.SHEETS_API_URL

  if (!SHEETS_API_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'SHEETS_API_URL not configured' }),
    }
  }

  const params = new URLSearchParams(event.queryStringParameters || {})
  const url = params.toString() ? `${SHEETS_API_URL}?${params}` : SHEETS_API_URL

  const options = {
    method: event.httpMethod,
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
  }

  if (event.httpMethod === 'POST' && event.body) {
    options.body = event.body
  }

  const res = await fetch(url, options)
  const body = await res.text()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body,
  }
}
