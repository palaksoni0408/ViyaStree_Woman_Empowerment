/**
 * API base URL for backend.
 * - Production (Vercel): set VITE_API_URL on Vercel to your Render backend URL.
 * - Local: leave empty so requests go to same origin (Vite proxy).
 */
export const API_BASE = import.meta.env.VITE_API_URL || ''
