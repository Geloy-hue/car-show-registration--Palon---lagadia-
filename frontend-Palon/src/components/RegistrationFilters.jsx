import { REGISTRATION_STATUSES, REGISTRATION_TYPES, STATUS_LABELS } from '../utils/format.js'

export default function RegistrationFilters({
  search, type, status,
  onSearchChange, onTypeChange, onStatusChange, onClear,
}) {
  const hasFilters = Boolean(search || type || status)

  return (
    <div className="row g-2 align-items-end">
      <div className="col-12 col-md-5 col-xl-4">
        <label htmlFor="filter-search" className="form-label filter-label">Participant name</label>
        <div className="input-group">
          <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
          <input
            id="filter-search"
            type="search"
            className="form-control"
            placeholder="Search participant name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="col-6 col-md-3 col-xl-2">
        <label htmlFor="filter-type" className="form-label filter-label">Registration type</label>
        <select id="filter-type" className="form-select" value={type} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="">All types</option>
          {REGISTRATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="col-6 col-md-3 col-xl-2">
        <label htmlFor="filter-status" className="form-label filter-label">Status</label>
        <select id="filter-status" className="form-select" value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">All statuses</option>
          {REGISTRATION_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="col-12 col-md-auto">
        <button type="button" className="btn btn-outline-secondary w-100" onClick={onClear} disabled={!hasFilters}>
          <i className="bi bi-x-lg me-1" aria-hidden="true" />Clear filters
        </button>
      </div>
    </div>
  )
}
