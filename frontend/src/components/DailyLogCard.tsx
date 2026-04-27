import { Link } from 'react-router-dom'

import type { DailyLog } from '../api/client'

type DailyLogCardProps = {
  log: DailyLog
}

function DailyLogCard({ log }: DailyLogCardProps) {
  return (
    <article className="log-card">
      <div className="log-card-header">
        <div>
          <p className="log-card-date">{new Date(log.log_date).toLocaleDateString()}</p>
          <h3>{log.mood}</h3>
        </div>
        <span className="pill-badge">{log.visibility}</span>
      </div>

      <dl className="log-card-meta">
        <div>
          <dt>Weight</dt>
          <dd>{log.weight_kg} kg</dd>
        </div>
        <div>
          <dt>User</dt>
          <dd>#{log.user_id}</dd>
        </div>
      </dl>

      <p className="log-card-notes">{log.notes}</p>

      <Link className="inline-link" to={`/daily-logs/${log.id}`}>
        Open daily log
      </Link>
    </article>
  )
}

export default DailyLogCard
