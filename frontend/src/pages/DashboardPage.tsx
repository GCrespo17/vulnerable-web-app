import { Link } from 'react-router-dom'

import type { DemoUser } from '../api/client'

type DashboardPageProps = {
  currentUser: DemoUser
  onSwitchUser: () => void
}

const featureCards = [
  {
    title: 'Daily Logs',
    description: 'Review current check-ins, training notes, and the timeline of each day.',
    href: '/tracker',
    actionLabel: 'Open tracker',
  },
  {
    title: 'Workouts',
    description: 'Add workouts from a daily log entry and review completed training sessions.',
    href: '/tracker',
    actionLabel: 'Open logs to add workouts',
  },
  {
    title: 'Meals',
    description: 'Add meals from a daily log entry and review recovery-focused nutrition notes.',
    href: '/tracker',
    actionLabel: 'Open logs to add meals',
  },
  {
    title: 'Search',
    description: 'Find recent notes across training and nutrition entries from one place.',
    href: '/search',
    actionLabel: 'Open search',
  },
  {
    title: 'Files',
    description: 'Open shared templates and member-specific reports stored for the local demo.',
    href: '/files',
    actionLabel: 'Open files',
  },
]

function DashboardPage({ currentUser, onSwitchUser }: DashboardPageProps) {
  return (
    <main className="page-shell dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Local classroom dashboard</p>
          <h1>Welcome back, {currentUser.name}</h1>
          <p className="page-copy">
            This foundation page gives the fitness tracker a normal entry point before the rest
            of the tracker workflows are added.
          </p>
        </div>

        <div className="user-summary-card">
          <p className="user-summary-label">Active demo user</p>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.email}</span>
          <span className="role-badge">{currentUser.role}</span>
          <button className="secondary-button" type="button" onClick={onSwitchUser}>
            Switch user
          </button>
        </div>
      </section>

      <section className="feature-grid" aria-label="Core tracker areas">
        {featureCards.map((card) => (
            <article key={card.title} className="feature-card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <Link className="inline-link" to={card.href}>
                {card.actionLabel}
              </Link>
            </article>
        ))}
      </section>
    </main>
  )
}

export default DashboardPage
