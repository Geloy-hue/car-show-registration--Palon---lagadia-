import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import StatusBadge from './StatusBadge.jsx'
import PaymentBadge from './PaymentBadge.jsx'
import { getRegistrationById } from '../api/index.js'
import { formatCurrency, formatDate } from '../utils/format.js'

function Row({ label, children }) {
  return (
    <div className="row py-2 border-bottom">
      <dt className="col-5 col-sm-4 text-muted fw-normal">{label}</dt>
      <dd className="col-7 col-sm-8 mb-0">{children}</dd>
    </div>
  )
}

// GET /api/registrations/{id}
export default function RegistrationDetailsModal({ registration, onClose }) {
  const [details, setDetails] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    getRegistrationById(registration.id)
      .then((data) => !ignore && setDetails(data))
      .catch((err) => !ignore && setError(err))
    return () => { ignore = true }
  }, [registration.id])

  return (
    <Modal
      title={`Registration ${registration.registrationNumber}`}
      onClose={onClose}
      footer={<button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>}
    >
      {error && <div className="alert alert-danger mb-0" role="alert">{error.message}</div>}
      {!error && !details && <p className="text-muted mb-0" role="status">Loading details…</p>}
      {details && (
        <dl className="mb-0">
          <Row label="Participant">{details.participantName}</Row>
          <Row label="Contact">{details.contactNumber}</Row>
          <Row label="Email">{details.email}</Row>
          <Row label="Address">{details.address}</Row>
          <Row label="Car">{details.carMakeModel} · <span className="plate">{details.plateNumber}</span></Row>
          <Row label="Type">{details.registrationType}</Row>
          <Row label="Registered">{formatDate(details.registrationDate)}</Row>
          <Row label="Status"><StatusBadge status={details.status} /></Row>
          <Row label="Fee">{formatCurrency(details.registrationFee)}</Row>
          <Row label="Amount paid">{formatCurrency(details.amountPaid)}</Row>
          <Row label="Payment"><PaymentBadge paymentStatus={details.paymentStatus} /></Row>
        </dl>
      )}
    </Modal>
  )
}
