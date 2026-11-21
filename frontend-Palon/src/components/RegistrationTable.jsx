import StatusBadge from './StatusBadge.jsx'
import PaymentBadge from './PaymentBadge.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'

const COLUMNS = ['Reg. No.', 'Date', 'Participant', 'Car', 'Type', 'Status', 'Fee / Paid', 'Payment', '']

function SkeletonRows({ count }) {
  return Array.from({ length: count }, (_, row) => (
    <tr key={row} aria-hidden="true">
      {COLUMNS.map((_, col) => (
        <td key={col}><span className="placeholder-glow d-block"><span className="placeholder col-10" /></span></td>
      ))}
    </tr>
  ))
}

export default function RegistrationTable({ items, showSkeleton, skeletonRows, onView }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0 registrations-table">
        <thead>
          <tr>
            {COLUMNS.map((name, i) => (
              <th key={i} scope="col" className={name === 'Fee / Paid' ? 'text-end' : ''}>
                {name || <span className="visually-hidden">Actions</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {showSkeleton ? (
            <SkeletonRows count={skeletonRows} />
          ) : (
            items.map((r) => (
              <tr key={r.id}>
                <td className="fw-semibold text-nowrap">{r.registrationNumber}</td>
                <td className="text-nowrap">{formatDate(r.registrationDate)}</td>
                <td>
                  <div className="fw-medium">{r.participantName}</div>
                  <div className="cell-sub">{r.contactNumber} · {r.email}</div>
                </td>
                <td>
                  <div>{r.carMakeModel}</div>
                  <div className="cell-sub plate">{r.plateNumber}</div>
                </td>
                <td>{r.registrationType}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="text-end text-nowrap amount">
                  {formatCurrency(r.registrationFee)} / <span className="text-muted">{formatCurrency(r.amountPaid)}</span>
                </td>
                <td><PaymentBadge paymentStatus={r.paymentStatus} /></td>
                <td className="text-end">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onView(r)} aria-label={`View details for ${r.participantName}`}>
                    <i className="bi bi-eye me-1" aria-hidden="true" />View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
