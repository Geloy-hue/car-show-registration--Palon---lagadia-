import KpiCard from './KpiCard.jsx'
import { formatCurrency, formatNumber, formatPercent } from '../utils/format.js'

// Every value comes from GET /api/registrations/summary (never from the rows on screen).
export default function KpiCards({ summary, loading }) {
  const s = summary
  const dash = '—'
  const collectionRate = s && s.totalFees > 0 ? (s.totalPayments / s.totalFees) * 100 : 0
  const show = (fn, value) => (s ? fn(value) : dash)

  const cards = [
    { label: 'Total Registrations', value: show(formatNumber, s?.totalRegistrations), hint: 'All participants', icon: 'bi-people', tone: 'primary' },
    { label: 'Total Payments', value: show(formatCurrency, s?.totalPayments), hint: s ? `Collected of ${formatCurrency(s.totalFees)} in fees` : 'Collected', icon: 'bi-cash-coin', tone: 'success' },
    { label: 'Uncollected Payments', value: show(formatCurrency, s?.uncollectedPayments), hint: 'Still to be collected', icon: 'bi-exclamation-circle', tone: 'danger' },
    { label: 'Confirmed', value: show(formatNumber, s?.confirmed), hint: 'Ready for the event', icon: 'bi-patch-check', tone: 'primary' },
    { label: 'Checked In', value: show(formatNumber, s?.checkedIn), hint: 'Already at the venue', icon: 'bi-box-arrow-in-right', tone: 'info' },
    { label: 'Pending', value: show(formatNumber, s?.pending), hint: 'Awaiting confirmation', icon: 'bi-hourglass-split', tone: 'warning' },
    { label: 'Cancelled', value: show(formatNumber, s?.cancelled), hint: 'Withdrawn registrations', icon: 'bi-x-circle', tone: 'secondary' },
    { label: 'Collection Rate', value: s ? formatPercent(collectionRate) : dash, hint: 'Payments ÷ total fees', icon: 'bi-graph-up-arrow', tone: 'success' },
  ]

  return (
    <section aria-label="Key figures">
      <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-4">
        {cards.map((card) => (
          <div className="col" key={card.label}>
            <KpiCard {...card} loading={loading && !s} />
          </div>
        ))}
      </div>
    </section>
  )
}
