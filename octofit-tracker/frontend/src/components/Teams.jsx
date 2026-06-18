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

function Teams({ apiBaseUrl }) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : `${apiBaseUrl}/api/teams/`

  const [teams, setTeams] = useState([])
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadTeams = async () => {
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
        setTeams(normalized.items)
        setCount(normalized.count)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadTeams()

    return () => controller.abort()
  }, [endpoint])

  return (
    <section className="card card-muted rounded-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-2">Teams</h2>
        <p className="text-secondary mb-3">Total teams: {count}</p>

        {loading && <p className="mb-0">Loading teams...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>City</th>
                  <th>Members</th>
                  <th>Total Points</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team._id}>
                    <td>{team.name ?? '-'}</td>
                    <td>{team.city ?? '-'}</td>
                    <td>{Array.isArray(team.members) ? team.members.length : '-'}</td>
                    <td>{team.totalPoints ?? '-'}</td>
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

export default Teams
