// Same functions and return shapes as registrationsApi.js, but everything runs in the browser.
import { ApiError } from './ApiError.js'

const FEES = { Exhibitor: 1500, Competitor: 2500, VIP: 5000 }
const DELAY_MS = 350 // pretend to be a network call so loading states are visible

// [name, car, plate, type, status, payment: U = unpaid, P = half paid, F = fully paid]
const ROWS = [
  ['Juan Dela Cruz', 'Toyota Supra MK4', 'ABC 1234', 'Competitor', 'Confirmed', 'P'],
  ['Maria Santos', 'Honda Civic Type R', 'NBA 2210', 'Exhibitor', 'Pending', 'U'],
  ['Pedro Reyes', 'Nissan Skyline R34', 'DAE 4471', 'VIP', 'CheckedIn', 'F'],
  ['Ana Garcia', 'Mazda MX-5 Miata', 'GHT 9082', 'Competitor', 'Confirmed', 'F'],
  ['Jose Mendoza', 'Subaru WRX STI', 'KLM 3305', 'Exhibitor', 'Cancelled', 'U'],
  ['Carlo Ramos', 'Mitsubishi Lancer Evo IX', 'PQR 7716', 'VIP', 'Pending', 'P'],
  ['Angela Flores', 'Toyota GR86', 'STU 1129', 'Competitor', 'CheckedIn', 'F'],
  ['Mark Bautista', 'Ford Mustang GT', 'VWX 5543', 'VIP', 'Confirmed', 'F'],
  ['Sofia Torres', 'Volkswagen Golf GTI', 'YZA 6638', 'Exhibitor', 'Confirmed', 'P'],
  ['Daniel Cruz', 'Honda S2000', 'BCD 2271', 'Competitor', 'Pending', 'U'],
  ['Miguel Lopez', 'Chevrolet Camaro SS', 'EFG 8814', 'VIP', 'Cancelled', 'P'],
  ['Ella Fernandez', 'Mini Cooper S', 'HIJ 4426', 'Exhibitor', 'CheckedIn', 'F'],
  ['Gabriel Rivera', 'BMW M3 E46', 'KLN 1907', 'Competitor', 'Confirmed', 'P'],
  ['Nicole Castillo', 'Porsche 911 Carrera', 'OPQ 3358', 'VIP', 'CheckedIn', 'F'],
  ['Joshua Aquino', 'Toyota AE86 Trueno', 'RST 7790', 'Exhibitor', 'Pending', 'U'],
  ['Isabella Gomez', 'Mazda RX-7 FD', 'UVW 5521', 'Competitor', 'Confirmed', 'F'],
  ['Adrian Morales', 'Nissan GT-R R35', 'XYZ 6643', 'VIP', 'Pending', 'P'],
  ['Patricia Diaz', 'Suzuki Swift Sport', 'ABD 2285', 'Exhibitor', 'Confirmed', 'F'],
  ['Christian Perez', 'Hyundai Veloster N', 'CDE 9916', 'Competitor', 'Cancelled', 'U'],
  ['Camille Navarro', 'Audi TT RS', 'FGH 1174', 'VIP', 'Confirmed', 'P'],
  ['Rafael Lim', 'Honda Integra DC2', 'IJK 8830', 'Exhibitor', 'CheckedIn', 'P'],
  ['Andrea Valdez', 'Lexus IS 300', 'LMN 4402', 'Competitor', 'Pending', 'P'],
  ['Nathan Villanueva', 'Datsun 240Z', 'NOP 6075', 'VIP', 'CheckedIn', 'F'],
  ['Bea Santiago', 'Toyota Corolla AE92', 'QRS 3318', 'Exhibitor', 'Confirmed', 'U'],
  ['Enzo Martinez', 'Mercedes-Benz A45 AMG', 'TUV 7761', 'Competitor', 'Confirmed', 'F'],
  ['Lara Domingo', 'Kia Stinger GT', 'WXY 2209', 'VIP', 'Pending', 'U'],
  ['Paolo Esguerra', 'Mazda 3 Turbo', 'ZAB 5584', 'Exhibitor', 'Confirmed', 'F'],
  ['Trina Alcantara', 'Volkswagen Beetle 1968', 'CDF 9937', 'Competitor', 'CheckedIn', 'P'],
]

function paymentStatusOf(fee, paid) {
  if (paid <= 0) return 'Unpaid'
  return paid >= fee ? 'Paid' : 'Partial'
}

let store = ROWS.map(([name, car, plate, type, status, pay], i) => {
  const fee = FEES[type]
  const paid = pay === 'F' ? fee : pay === 'P' ? fee / 2 : 0
  const n = i + 1
  return {
    id: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
    registrationNumber: `CS27-${String(n).padStart(4, '0')}`,
    registrationDate: new Date(Date.UTC(2027, 0, 5 + i, (i * 7) % 10, (i * 13) % 60)).toISOString(),
    participantName: name,
    contactNumber: `0917${String(1234500 + n * 37).padStart(7, '0')}`,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
    address: `${100 + n} Rizal St., Sorsogon City`,
    carMakeModel: car,
    plateNumber: plate,
    registrationType: type,
    status,
    registrationFee: fee,
    amountPaid: paid,
    paymentStatus: paymentStatusOf(fee, paid),
  }
})

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS))
const newestFirst = (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)

export function getRegistrations({ participantName, type, status, page = 1, pageSize = 10 } = {}) {
  const name = (participantName ?? '').trim().toLowerCase()
  const filtered = store
    .filter((r) => !name || r.participantName.toLowerCase().includes(name))
    .filter((r) => !type || r.registrationType === type)
    .filter((r) => !status || r.status === status)
    .sort(newestFirst)

  const size = Math.min(Math.max(pageSize, 1), 50)
  const current = Math.max(page, 1)
  return wait({
    items: filtered.slice((current - 1) * size, current * size),
    page: current,
    pageSize: size,
    totalCount: filtered.length,
    totalPages: Math.ceil(filtered.length / size),
  })
}

export function getSummary() {
  const count = (s) => store.filter((r) => r.status === s).length
  const active = store.filter((r) => r.status !== 'Cancelled') // like the backend, money ignores cancelled
  const sum = (list, pick) => list.reduce((total, r) => total + pick(r), 0)
  return wait({
    totalRegistrations: store.length,
    confirmed: count('Confirmed'),
    checkedIn: count('CheckedIn'),
    pending: count('Pending'),
    cancelled: count('Cancelled'),
    totalFees: sum(active, (r) => r.registrationFee),
    totalPayments: sum(active, (r) => r.amountPaid),
    uncollectedPayments: sum(active, (r) => r.registrationFee - r.amountPaid),
  })
}

export function getRegistrationById(id) {
  const found = store.find((r) => r.id === id)
  return found
    ? wait({ ...found })
    : Promise.reject(new ApiError('Registration not found.', { status: 404 }))
}

export function createRegistration(payload) {
  const fieldErrors = {}
  const required = ['participantName', 'contactNumber', 'email', 'address', 'carMakeModel', 'plateNumber']
  required.forEach((key) => {
    if (!String(payload[key] ?? '').trim()) fieldErrors[key] = `'${key}' must not be empty.`
  })
  if (!fieldErrors.contactNumber && !/^09\d{9}$/.test(payload.contactNumber)) {
    fieldErrors.contactNumber = 'Contact number must be a valid PH mobile number (09XXXXXXXXX).'
  }
  if (!fieldErrors.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    fieldErrors.email = "'email' is not a valid email address."
  }
  const fee = FEES[payload.registrationType]
  if (!fee) fieldErrors.registrationType = 'Invalid registration type.'
  if (fee && !(payload.amountPaid >= 0 && payload.amountPaid <= fee)) {
    fieldErrors.amountPaid = 'Amount paid must be between zero and the registration fee.'
  }
  if (Object.keys(fieldErrors).length) {
    return wait(null).then(() => {
      throw new ApiError('Please fix the highlighted fields.', { status: 400, fieldErrors })
    })
  }
  if (store.some((r) => r.plateNumber === payload.plateNumber)) {
    return wait(null).then(() => {
      throw new ApiError('This plate number is already registered.', {
        status: 409,
        fieldErrors: { plateNumber: 'This plate number is already registered.' },
      })
    })
  }

  const n = store.length + 1
  const created = {
    id: crypto.randomUUID(),
    registrationNumber: `CS27-${String(n).padStart(4, '0')}`,
    // sample dates are in 2027, so put the new one right after the newest so it shows on page 1
    registrationDate: new Date(Math.max(...store.map((r) => +new Date(r.registrationDate))) + 3600_000).toISOString(),
    ...payload,
    status: 'Pending',
    registrationFee: fee,
    paymentStatus: paymentStatusOf(fee, payload.amountPaid),
  }
  store = [...store, created]
  return wait({ ...created })
}
