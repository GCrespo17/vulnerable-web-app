import type { DemoUser } from '../api/client'

type DashboardPageProps = {
  currentUser: DemoUser
  onSwitchUser: () => void
}

const featureCards = [
  {
    title: 'Daily Logs',
    description: 'Review current check-ins, training notes, and the timeline of each day.',
  },
  {
    title: 'Workouts',
    description: 'Track completed sessions, volume, and short reflections after each lift or run.',
  },
  {
    title: 'Meals',
    description: 'Capture calorie totals, meal structure, and the habits that support recovery.',
  },
  {
    title: 'Search',
    description: 'Find recent notes across training and nutrition entries from one place.',
  },
  {
    title: 'Files',
    description: 'Open shared templates and member-specific reports stored for the local demo.',
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
            <span className="feature-status">Foundation ready</span>
          </article>
        ))}
      </section>
    </main>
  )
}

export default DashboardPage
