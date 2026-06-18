import { useEffect, useState } from 'react'

const normalizeCollectionResponse = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, count: payload.length }
  }

  if (Array.isArray(payload?.data)) {
    return {
      items: payload.data,
      count: Number(payload.count ?? payload.total ?? payload.data.length),
    }
  }

  if (Array.isArray(payload?.results)) {
    return {
      items: payload.results,
      count: Number(payload.count ?? payload.total ?? payload.results.length),
    }
  }

  return { items: [], count: 0 }
}

function Leaderboard({ apiBaseUrl }) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : `${apiBaseUrl}/api/leaderboard/`

  const [entries, setEntries] = useState([])
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadLeaderboard = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeCollectionResponse(payload)
        setEntries(normalized.items)
        setCount(normalized.count)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadLeaderboard()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card card-muted rounded-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-2">Leaderboard</h2>
        <p className="text-secondary mb-3">Total entries: {count}</p>

        {loading && <p className="mb-0">Loading leaderboard...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Points</th>
                  <th>Streak Days</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.rank ?? '-'}</td>
                    <td>{entry.user?.displayName ?? entry.user?.username ?? '-'}</td>
                    <td>{entry.points ?? '-'}</td>
                    <td>{entry.streakDays ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default Leaderboard
