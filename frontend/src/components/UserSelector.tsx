import type { DemoUser } from '../api/client'

type UserSelectorProps = {
  users: DemoUser[]
  selectedUserId: number | null
  onChange: (userId: number) => void
  disabled?: boolean
}

function UserSelector({ users, selectedUserId, onChange, disabled = false }: UserSelectorProps) {
  return (
    <label className="field-group">
      <span className="field-label">Demo user</span>
      <select
        className="field-input"
        value={selectedUserId ?? ''}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
      >
        <option value="" disabled>
          Select a demo user
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} · {user.role}
          </option>
        ))}
      </select>
    </label>
  )
}

export default UserSelector
