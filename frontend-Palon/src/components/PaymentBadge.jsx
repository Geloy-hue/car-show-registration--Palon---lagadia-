// Red = Unpaid, amber = Partial, green = Paid. The text label is always shown too.
const STYLES = {
  Unpaid: { cls: 'badge-unpaid', icon: 'bi-x-octagon' },
  Partial: { cls: 'badge-partial', icon: 'bi-circle-half' },
  Paid: { cls: 'badge-paid', icon: 'bi-check-circle' },
}

export default function PaymentBadge({ paymentStatus }) {
  const style = STYLES[paymentStatus] ?? STYLES.Unpaid
  return (
    <span className={`status-badge ${style.cls}`}>
      <i className={`bi ${style.icon}`} aria-hidden="true" />
      {paymentStatus}
    </span>
  )
}
