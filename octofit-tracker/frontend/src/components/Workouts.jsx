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

function Workouts({ apiBaseUrl }) {
  const [workouts, setWorkouts] = useState([])
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadWorkouts = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${apiBaseUrl}/api/workouts/`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeCollectionResponse(payload)
        setWorkouts(normalized.items)
        setCount(normalized.count)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadWorkouts()

    return () => controller.abort()
  }, [apiBaseUrl])

  return (
    <section className="card card-muted rounded-4">
      <div className="card-body p-4">
        <h2 className="h4 mb-2">Workouts</h2>
        <p className="text-secondary mb-3">Total workouts: {count}</p>

        {loading && <p className="mb-0">Loading workouts...</p>}
        {!loading && error && <p className="text-danger mb-0">{error}</p>}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Equipment</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout._id}>
                    <td>{workout.title ?? '-'}</td>
                    <td>{workout.category ?? '-'}</td>
                    <td>{workout.difficulty ?? '-'}</td>
                    <td>{workout.durationMinutes ?? '-'} min</td>
                    <td>
                      {Array.isArray(workout.equipment)
                        ? workout.equipment.join(', ')
                        : '-'}
                    </td>
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

export default Workouts
