import { useState } from 'react'
import Modal from './Modal.jsx'
import { createRegistration } from '../api/index.js'
import { REGISTRATION_TYPES, formatCurrency } from '../utils/format.js'

// Hint only — the backend is the one that really sets the fee.
const FEE_HINT = { Exhibitor: 1500, Competitor: 2500, VIP: 5000 }

const EMPTY = {
  participantName: '', contactNumber: '', email: '', address: '',
  carMakeModel: '', plateNumber: '', registrationType: 'Exhibitor', amountPaid: '0',
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className="col-12 col-md-6">
      <label htmlFor={id} className="form-label fw-medium">{label}</label>
      {children}
      {error && <div className="invalid-feedback d-block" id={`${id}-error`}>{error}</div>}
      {!error && hint && <div className="form-text">{hint}</div>}
    </div>
  )
}

// POST /api/registrations — shows 400 validation errors and the 409 duplicate-plate error next to the right field.
export default function NewRegistrationModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [name]: undefined })) // clear that field's error once edited
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setFormError('')
    try {
      const created = await createRegistration({
        ...form,
        participantName: form.participantName.trim(),
        plateNumber: form.plateNumber.trim(),
        amountPaid: Number(form.amountPaid) || 0,
      })
      onCreated(created)
    } catch (err) {
      setErrors(err.fieldErrors ?? {})
      // Only show a general message when no field could explain the problem.
      if (!Object.keys(err.fieldErrors ?? {}).length) setFormError(err.message)
      else setFormError(err.status === 409 ? 'This car is already registered.' : 'Please fix the highlighted fields.')
    } finally {
      setSaving(false)
    }
  }

  const input = (name, props = {}) => (
    <input
      id={name}
      className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      value={form[name]}
      onChange={set(name)}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      {...props}
    />
  )

  return (
    <Modal
      title="New registration"
      size="modal-lg"
      onClose={saving ? () => {} : onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" form="new-registration-form" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : <><i className="bi bi-check-lg me-1" aria-hidden="true" />Save registration</>}
          </button>
        </>
      }
    >
      <form id="new-registration-form" onSubmit={submit} noValidate>
        {formError && <div className="alert alert-danger" role="alert">{formError}</div>}
        <div className="row g-3">
          <Field id="participantName" label="Participant name" error={errors.participantName}>
            {input('participantName', { placeholder: 'e.g. Juan Dela Cruz', autoFocus: true })}
          </Field>
          <Field id="contactNumber" label="Contact number" error={errors.contactNumber} hint="PH mobile number, e.g. 09171234567">
            {input('contactNumber', { placeholder: '09XXXXXXXXX', inputMode: 'numeric' })}
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            {input('email', { type: 'email', placeholder: 'name@example.com' })}
          </Field>
          <Field id="address" label="Address" error={errors.address}>
            {input('address', { placeholder: 'Street, city' })}
          </Field>
          <Field id="carMakeModel" label="Car make / model" error={errors.carMakeModel}>
            {input('carMakeModel', { placeholder: 'e.g. Toyota Supra MK4' })}
          </Field>
          <Field id="plateNumber" label="Plate number" error={errors.plateNumber}>
            {input('plateNumber', { placeholder: 'e.g. ABC 1234' })}
          </Field>
          <Field id="registrationType" label="Registration type" error={errors.registrationType} hint={`Fee: ${formatCurrency(FEE_HINT[form.registrationType])}`}>
            <select id="registrationType" className={`form-select ${errors.registrationType ? 'is-invalid' : ''}`} value={form.registrationType} onChange={set('registrationType')}>
              {REGISTRATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field id="amountPaid" label="Amount paid (₱)" error={errors.amountPaid} hint="Between ₱0 and the registration fee">
            {input('amountPaid', { type: 'number', min: 0, step: '0.01' })}
          </Field>
        </div>
      </form>
    </Modal>
  )
}
