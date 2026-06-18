import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

function App() {
  const routes = [
    { to: '/users', label: 'Users' },
    { to: '/teams', label: 'Teams' },
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts', label: 'Workouts' },
  ]

  return (
    <div className="app-shell container py-4 py-lg-5">
      <header className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src="/octofitapp-small.png"
            alt="OctoFit Tracker logo"
            width="56"
            height="56"
            className="brand-logo"
          />
          <div>
            <h1 className="h2 mb-0">OctoFit Tracker</h1>
            <p className="text-secondary mb-0">
              React 19 presentation tier connected to the Node.js API.
            </p>
          </div>
        </div>

        <div className="alert alert-info mb-3" role="status">
          <div><strong>API base URL:</strong> {apiBaseUrl}</div>
          {!codespaceName && (
            <div className="small mt-1">
              VITE_CODESPACE_NAME is not set. Using localhost fallback.
            </div>
          )}
        </div>

        <nav className="nav nav-pills flex-wrap gap-2">
          {routes.map((route) => (
            <NavLink
              key={route.to}
              to={route.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : 'link-secondary'}`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
          <Route
            path="/activities"
            element={<Activities apiBaseUrl={apiBaseUrl} />}
          />
          <Route
            path="/leaderboard"
            element={<Leaderboard apiBaseUrl={apiBaseUrl} />}
          />
          <Route
            path="/workouts"
            element={<Workouts apiBaseUrl={apiBaseUrl} />}
          />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
