export default function KpiCard({ label, value, hint, icon, tone = 'primary', loading = false }) {
  return (
    <div className={`card kpi-card kpi-${tone} h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <span className="kpi-label">{label}</span>
          <span className="kpi-icon" aria-hidden="true">
            <i className={`bi ${icon}`} />
          </span>
        </div>
        {loading ? (
          <div className="placeholder-glow" aria-hidden="true">
            <span className="placeholder col-7 kpi-skeleton-value" />
            <span className="placeholder col-10 d-block mt-2" />
          </div>
        ) : (
          <>
            <div className="kpi-value">{value}</div>
            <div className="kpi-hint">{hint}</div>
          </>
        )}
      </div>
    </div>
  )
}
