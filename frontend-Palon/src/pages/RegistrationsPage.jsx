import { useCallback, useEffect, useState } from 'react'
import { getRegistrations, getSummary } from '../api/index.js'
import { useDebounce } from '../hooks/useDebounce.js'
import KpiCards from '../components/KpiCards.jsx'
import RegistrationFilters from '../components/RegistrationFilters.jsx'
import RegistrationTable from '../components/RegistrationTable.jsx'
import Pagination from '../components/Pagination.jsx'
import { EmptyState, ErrorState } from '../components/StateMessages.jsx'
import RegistrationDetailsModal from '../components/RegistrationDetailsModal.jsx'
import NewRegistrationModal from '../components/NewRegistrationModal.jsx'

const FIRST_QUERY = { participantName: '', type: '', status: '', page: 1, pageSize: 10 }

// This page OWNS the state (filters, page, data, loading, error). Child components only receive
// values and callbacks, so there is a single source of truth and one place that talks to the API.
export default function RegistrationsPage() {
  const [searchText, setSearchText] = useState('') // what the user is typing (instant)
  const debouncedSearch = useDebounce(searchText, 400) // what we actually search for
  const [query, setQuery] = useState(FIRST_QUERY) // exactly what is sent to the API

  const [data, setData] = useState(null) // { items, page, pageSize, totalCount, totalPages }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [reloadKey, setReloadKey] = useState(0) // bump to refetch (Try again / after creating)
  const [selected, setSelected] = useState(null) // registration shown in the details modal
  const [showNew, setShowNew] = useState(false)
  const [notice, setNotice] = useState('')

  // The debounced search text becomes part of the query; a new search always starts at page 1.
  useEffect(() => {
    const name = debouncedSearch.trim()
    setQuery((q) => (q.participantName === name ? q : { ...q, participantName: name, page: 1 }))
  }, [debouncedSearch])

  // Registrations: refetch whenever the query changes. `ignore` drops answers from outdated requests.
  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    getRegistrations(query)
      .then((result) => { if (!ignore) { setData(result); setLoading(false) } })
      .catch((err) => { if (!ignore) { setError(err); setLoading(false) } })
    return () => { ignore = true }
  }, [query, reloadKey])

  // KPI cards: independent of filters and page.
  useEffect(() => {
    let ignore = false
    setSummaryLoading(true)
    getSummary()
      .then((result) => { if (!ignore) { setSummary(result); setSummaryLoading(false) } })
      .catch(() => { if (!ignore) { setSummary(null); setSummaryLoading(false) } })
    return () => { ignore = true }
  }, [reloadKey])

  // Changing any filter goes back to page 1.
  const changeType = (type) => setQuery((q) => ({ ...q, type, page: 1 }))
  const changeStatus = (status) => setQuery((q) => ({ ...q, status, page: 1 }))
  const changePage = (page) => setQuery((q) => ({ ...q, page }))
  const changePageSize = (pageSize) => setQuery((q) => ({ ...q, pageSize, page: 1 }))
  const clearFilters = () => {
    setSearchText('')
    setQuery((q) => ({ ...q, participantName: '', type: '', status: '', page: 1 }))
  }
  const retry = () => setReloadKey((k) => k + 1)
  const closeDetails = useCallback(() => setSelected(null), [])
  const closeNew = useCallback(() => setShowNew(false), [])

  const handleCreated = (created) => {
    setShowNew(false)
    setNotice(`Registration ${created.registrationNumber} for ${created.participantName} was created.`)
    setQuery((q) => ({ ...q, page: 1 }))
    retry()
  }

  const hasFilters = Boolean(searchText || query.type || query.status)
  const firstLoad = loading && !data
  const isEmpty = !error && !loading && data && data.items.length === 0

  return (
    <main className="container-xl py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">Registration Dashboard</h1>
          <p className="text-muted mb-0">How Car Show 2027 is doing at a glance.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowNew(true)}>
          <i className="bi bi-plus-lg me-1" aria-hidden="true" />New registration
        </button>
      </div>

      {notice && (
        <div className="alert alert-success alert-dismissible" role="status">
          <i className="bi bi-check-circle me-2" aria-hidden="true" />{notice}
          <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setNotice('')} />
        </div>
      )}

      <KpiCards summary={summary} loading={summaryLoading} />

      <section className="card mt-4 registrations-card" aria-label="Registrations">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Registrations</h2>
            {loading && !firstLoad && (
              <span className="small text-muted" role="status">
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Loading registrations…
              </span>
            )}
          </div>
          <RegistrationFilters
            search={searchText}
            type={query.type}
            status={query.status}
            onSearchChange={setSearchText}
            onTypeChange={changeType}
            onStatusChange={changeStatus}
            onClear={clearFilters}
          />
        </div>

        {error ? (
          <ErrorState
            title={error.network ? 'Cannot reach the API…' : 'Something went wrong'}
            message={error.message}
            onRetry={retry}
          />
        ) : isEmpty ? (
          <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
        ) : (
          <>
            {firstLoad && <p className="px-3 pt-3 mb-0 text-muted" role="status">Loading registrations…</p>}
            <div className={loading && !firstLoad ? 'is-refreshing' : ''}>
              <RegistrationTable
                items={data?.items ?? []}
                showSkeleton={firstLoad}
                skeletonRows={query.pageSize}
                onView={setSelected}
              />
            </div>
            {data && (
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                totalCount={data.totalCount}
                totalPages={data.totalPages}
                itemCount={data.items.length}
                disabled={loading}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
              />
            )}
          </>
        )}
      </section>

      {selected && <RegistrationDetailsModal registration={selected} onClose={closeDetails} />}
      {showNew && <NewRegistrationModal onClose={closeNew} onCreated={handleCreated} />}
    </main>
  )
}
