// One error type for both the real API and the sample data, so the UI handles them the same way.
export class ApiError extends Error {
  /**
   * @param {string} message  readable message for the user
   * @param {{status?: number, fieldErrors?: Record<string,string>, network?: boolean}} [details]
   */
  constructor(message, { status = 0, fieldErrors = {}, network = false } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status // HTTP status (0 = request never reached the server)
    this.fieldErrors = fieldErrors // { plateNumber: 'already registered', ... } keyed by camelCase field
    this.network = network
  }
}
