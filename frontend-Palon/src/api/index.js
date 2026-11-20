// ONE place that decides where data comes from.
// - Real C# API (default):   VITE_USE_SAMPLE_DATA=false   (or just remove the line)
// - Local sample data:       VITE_USE_SAMPLE_DATA=true    (in .env.development, then restart `npm run dev`)
// Both modules export the same function names and return shapes, so nothing else changes.
import * as realApi from './registrationsApi.js'
import * as sampleApi from './sample-data.js'

export const USING_SAMPLE_DATA = import.meta.env.VITE_USE_SAMPLE_DATA === 'true'

const api = USING_SAMPLE_DATA ? sampleApi : realApi

export const { getRegistrations, getSummary, getRegistrationById, createRegistration } = api
export { ApiError } from './ApiError.js'
