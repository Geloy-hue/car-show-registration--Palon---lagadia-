import RegistrationsPage from './pages/RegistrationsPage.jsx'
import { USING_SAMPLE_DATA } from './api/index.js'

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="container-xl d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-car-front-fill brand-icon" aria-hidden="true" />
            <div>
              <div className="brand-title">Car Show 2027</div>
              <div className="brand-sub">AutoVista Events · Sorsogon City Coliseum</div>
            </div>
          </div>
          {USING_SAMPLE_DATA && (
            <span className="badge text-bg-warning"><i className="bi bi-database me-1" aria-hidden="true" />Using sample data</span>
          )}
        </div>
      </header>
      <RegistrationsPage />
    </>
  )
}
