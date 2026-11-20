export function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="state-box text-center">
      <i className="bi bi-search state-icon" aria-hidden="true" />
      <h3 className="h5 mt-2">{hasFilters ? 'No registrations match your filters' : 'No registrations yet'}</h3>
      <p className="text-muted mb-3">
        {hasFilters ? 'Try a different name, type or status.' : 'New registrations will appear here.'}
      </p>
      {hasFilters && (
        <button type="button" className="btn btn-primary" onClick={onClear}>
          <i className="bi bi-x-lg me-1" aria-hidden="true" />Clear filters
        </button>
      )}
    </div>
  )
}

export function ErrorState({ title = 'Cannot reach the API…', message, onRetry }) {
  return (
    <div className="state-box text-center" role="alert">
      <i className="bi bi-wifi-off state-icon text-danger" aria-hidden="true" />
      <h3 className="h5 mt-2">{title}</h3>
      <p className="text-muted mb-3">{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />Try again
      </button>
    </div>
  )
}
