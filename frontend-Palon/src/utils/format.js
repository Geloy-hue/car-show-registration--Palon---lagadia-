const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
const integer = new Intl.NumberFormat('en-PH')
const datePart = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const timePart = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

export const formatCurrency = (value) => peso.format(Number(value) || 0) // ₱2,500.00
export const formatNumber = (value) => integer.format(Number(value) || 0)
export const formatPercent = (value) => `${(Number(value) || 0).toFixed(1)}%`

/** "2027-02-10T08:30:00Z" -> "Feb 10, 2027 04:30 PM". */
export function formatDate(iso) {
  if (!iso) return '—'
  // SQLite hands back UTC dates without the trailing "Z"; without it the browser would read them as local time.
  const date = new Date(/(Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`)
  if (Number.isNaN(date.getTime())) return '—'
  return `${datePart.format(date)} ${timePart.format(date)}`
}

export const REGISTRATION_TYPES = ['Exhibitor', 'Competitor', 'VIP']
export const REGISTRATION_STATUSES = ['Pending', 'Confirmed', 'CheckedIn', 'Cancelled']
export const STATUS_LABELS = { Pending: 'Pending', Confirmed: 'Confirmed', CheckedIn: 'Checked In', Cancelled: 'Cancelled' }
