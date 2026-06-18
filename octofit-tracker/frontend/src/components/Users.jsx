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

function Users({ apiBaseUrl }) {
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadUsers = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${apiBaseUrl}/api/users/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeCollectionResponse(payload)
        setUsers(normalized.items)
        setCount(normalized.count)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()

    return () => controller.abort()
  }, [apiBaseUrl])

  return (
    <section className="card card-muted rounded-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-2">Users</h2>
        <p className="text-secondary mb-3">Total users: {count}</p>

        {loading && <p className="mb-0">Loading users...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Level</th>
                  <th>Total Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.displayName ?? user.username}</td>
                    <td>{user.email ?? '-'}</td>
                    <td>{user.team?.name ?? '-'}</td>
                    <td>{user.level ?? '-'}</td>
                    <td>{user.totalPoints ?? '-'}</td>
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

export default Users
