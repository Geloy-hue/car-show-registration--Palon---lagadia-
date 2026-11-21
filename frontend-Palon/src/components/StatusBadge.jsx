import { STATUS_LABELS } from '../utils/format.js'

const STYLES = {
  Pending: { cls: 'badge-pending', icon: 'bi-hourglass-split' },
  Confirmed: { cls: 'badge-confirmed', icon: 'bi-patch-check' },
  CheckedIn: { cls: 'badge-checkedin', icon: 'bi-box-arrow-in-right' },
  Cancelled: { cls: 'badge-cancelled', icon: 'bi-x-circle' },
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? STYLES.Pending
  return (
    <span className={`status-badge ${style.cls}`}>
      <i className={`bi ${style.icon}`} aria-hidden="true" />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
