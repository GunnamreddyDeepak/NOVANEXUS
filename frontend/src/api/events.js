const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8010'

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/api/v1/events`)

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`)
  }

  const data = await response.json()

  // Backend may return either:
  // 1. An array of events
  // 2. An object containing the events array
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data.events)) {
    return data.events
  }

  throw new Error('Invalid events response from backend')
}