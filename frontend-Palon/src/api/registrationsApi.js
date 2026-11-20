import { ApiError } from './ApiError.js'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205').replace(/\/$/, '')

/** Build ?a=1&b=2 and leave out empty values (the API cannot bind `status=` to an enum). */
function buildQuery(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, String(value).trim())
    }
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

// ProblemDetails -> ApiError. Validation errors look like { errors: { PlateNumber: ["..."] } }.
async function toApiError(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    /* body was not JSON */
  }

  if (body?.errors && typeof body.errors === 'object') {
    const fieldErrors = {}
    Object.entries(body.errors).forEach(([field, messages]) => {
      const key = field.charAt(0).toLowerCase() + field.slice(1) // PlateNumber -> plateNumber
      fieldErrors[key] = Array.isArray(messages) ? messages.join(' ') : String(messages)
    })
    return new ApiError('Please fix the highlighted fields.', { status: response.status, fieldErrors })
  }

  const detail = body?.detail || body?.title || `The API returned an error (${response.status}).`
  const fieldErrors =
    response.status === 409 && /plate/i.test(`${body?.title} ${body?.detail}`)
      ? { plateNumber: detail }
      : {}
  return new ApiError(detail, { status: response.status, fieldErrors })
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...(options.headers ?? {}) },
    })
  } catch {
    throw new ApiError(
      `Cannot reach the API at ${BASE_URL}. Make sure the backend is running and try again.`,
      { network: true },
    )
  }
  if (!response.ok) throw await toApiError(response)
  return response.json()
}

/** GET /api/registrations?participantName=&type=&status=&page=&pageSize= */
export function getRegistrations({ participantName, type, status, page = 1, pageSize = 10 } = {}) {
  return request(`/api/registrations${buildQuery({ participantName, type, status, page, pageSize })}`)
}

/** GET /api/registrations/summary */
export function getSummary() {
  return request('/api/registrations/summary')
}

/** GET /api/registrations/{id} */
export function getRegistrationById(id) {
  return request(`/api/registrations/${encodeURIComponent(id)}`)
}

/** POST /api/registrations  (201 on success, 400 validation, 409 duplicate plate) */
export function createRegistration(payload) {
  return request('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
