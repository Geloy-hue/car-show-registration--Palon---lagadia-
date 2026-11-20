// Page numbers with "…" gaps, e.g. 1 … 4 [5] 6 … 12
function pageWindow(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1])
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const result = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push('gap-' + p)
    result.push(p)
  })
  return result
}

export const PAGE_SIZES = [5, 10, 20]

export default function Pagination({ page, pageSize, totalCount, totalPages, itemCount, disabled, onPageChange, onPageSizeChange }) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = totalCount === 0 ? 0 : from + itemCount - 1
  const atFirst = page <= 1
  const atLast = page >= totalPages

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-3 border-top">
      <div className="text-muted small" aria-live="polite">
        Showing <strong>{from}–{to}</strong> of <strong>{totalCount}</strong>
      </div>

      <nav aria-label="Registrations pages">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${disabled || atFirst ? 'disabled' : ''}`}>
            <button type="button" className="page-link" disabled={disabled || atFirst} onClick={() => onPageChange(page - 1)}>
              <i className="bi bi-chevron-left" aria-hidden="true" /> Prev
            </button>
          </li>
          {pageWindow(page, totalPages).map((p) =>
            typeof p === 'string' ? (
              <li key={p} className="page-item disabled"><span className="page-link">…</span></li>
            ) : (
              <li key={p} className={`page-item ${p === page ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
                <button type="button" className="page-link" disabled={disabled} aria-current={p === page ? 'page' : undefined} onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            ),
          )}
          <li className={`page-item ${disabled || atLast ? 'disabled' : ''}`}>
            <button type="button" className="page-link" disabled={disabled || atLast} onClick={() => onPageChange(page + 1)}>
              Next <i className="bi bi-chevron-right" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>

      <div className="d-flex align-items-center gap-2">
        <label htmlFor="page-size" className="small text-muted mb-0">Rows per page</label>
        <select id="page-size" className="form-select form-select-sm w-auto" value={pageSize} disabled={disabled} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  )
}
