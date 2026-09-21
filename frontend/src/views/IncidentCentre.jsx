import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Search,
  MapPin,
  Bus,
  Clock3,
} from 'lucide-react'
import { fetchEvents } from '../api/events'

function IncidentCentre() {
  const [incidents, setIncidents] = useState([])
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All')
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const response = await fetchEvents()

        // Protect the UI from unexpected API response shapes.
        const events = Array.isArray(response)
          ? response
          : Array.isArray(response?.events)
            ? response.events
            : []

        const mappedEvents = events.map((event) => ({
          id: event.event_id,
          type:
            event.sub_type === 'POTHOLE'
              ? 'Road Damage'
              : (event.event_type || 'Unknown Event').replaceAll(
                  '_',
                  ' '
                ),
          bus: event.bus_id || 'Unknown',
          location:
            typeof event.latitude === 'number' &&
            typeof event.longitude === 'number'
              ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
              : 'Location unavailable',
          severity: event.severity || 'UNKNOWN',
          status: event.status || 'UNKNOWN',
          source: event.source_type || 'UNKNOWN',
          time: event.observed_at
            ? new Date(event.observed_at).toLocaleString()
            : 'Time unavailable',
          confidence:
            typeof event.confidence === 'number'
              ? event.confidence
              : null,
          device: event.device_id || 'Unknown',
        }))

        if (mounted) {
          setIncidents(mappedEvents)
        }
      } catch (err) {
        if (mounted) {
          setIncidents([])
          setError(err?.message || 'Failed to load events')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      mounted = false
    }
  }, [])

  const criticalCount = incidents.filter(
    (incident) => incident.severity === 'CRITICAL'
  ).length

  const highCount = incidents.filter(
    (incident) => incident.severity === 'HIGH'
  ).length

  const mediumCount = incidents.filter(
    (incident) => incident.severity === 'MEDIUM'
  ).length

  const lowCount = incidents.filter(
    (incident) => incident.severity === 'LOW'
  ).length

  const filteredIncidents = incidents.filter((incident) => {
    const searchText =
      `${incident.id} ${incident.type} ${incident.bus} ${incident.location}`
        .toLowerCase()

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    )

    const matchesSeverity =
      severity === 'All' || incident.severity === severity

    return matchesSearch && matchesSeverity
  })

  return (
    <div className="incident-page">
      <div className="page-heading">
        <div>
          <span className="page-label">OPERATIONS</span>

          <h3>Incident Centre</h3>

          <p>
            Review detected events, severity, status, location and
            source information.
          </p>
        </div>

        <span className="simulation-badge">
          BACKEND DATA
        </span>
      </div>

      <div className="incident-summary">
        <div className="incident-summary-card critical">
          <AlertTriangle size={19} />

          <div>
            <span>Critical</span>
            <strong>{criticalCount}</strong>
          </div>
        </div>

        <div className="incident-summary-card warning">
          <AlertTriangle size={19} />

          <div>
            <span>High</span>
            <strong>{highCount}</strong>
          </div>
        </div>

        <div className="incident-summary-card">
          <AlertTriangle size={19} />

          <div>
            <span>Medium</span>
            <strong>{mediumCount}</strong>
          </div>
        </div>

        <div className="incident-summary-card">
          <Clock3 size={19} />

          <div>
            <span>Low</span>
            <strong>{lowCount}</strong>
          </div>
        </div>
      </div>

      <section className="panel incident-panel">
        <div className="panel-header incident-toolbar">
          <div>
            <span className="panel-label">EVENT MONITORING</span>

            <h4>Detected Events</h4>
          </div>

          <div className="incident-controls">
            <div className="incident-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search event, bus or location"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={severity}
              onChange={(event) =>
                setSeverity(event.target.value)
              }
              className="severity-filter"
            >
              <option value="All">All severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="incident-list-table">
          {loading && (
            <div className="incident-empty">
              <strong>Loading events...</strong>
            </div>
          )}

          {error && !loading && (
            <div className="incident-empty">
              <AlertTriangle size={24} />

              <strong>Unable to load events</strong>

              <span>{error}</span>
            </div>
          )}

          {!loading &&
            !error &&
            filteredIncidents.map((incident) => (
              <button
                className={`incident-row ${
                  selectedIncident?.id === incident.id
                    ? 'selected'
                    : ''
                }`}
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
              >
                <div className="incident-main">
                  <span
                    className={`severity-dot-large ${
                      incident.severity.toLowerCase()
                    }`}
                  />

                  <div>
                    <strong>{incident.type}</strong>

                    <span>{incident.id}</span>
                  </div>
                </div>

                <div className="incident-location">
                  <MapPin size={14} />

                  {incident.location}
                </div>

                <div className="incident-bus">
                  <Bus size={14} />

                  {incident.bus}
                </div>

                <span
                  className={`status-badge ${
                    incident.severity.toLowerCase()
                  }`}
                >
                  {incident.severity}
                </span>

                <span className="incident-time">
                  {incident.time}
                </span>
              </button>
            ))}

          {!loading &&
            !error &&
            filteredIncidents.length === 0 && (
              <div className="incident-empty">
                <AlertTriangle size={24} />

                <strong>No incidents found</strong>

                <span>
                  Try changing the search or severity filter.
                </span>
              </div>
            )}
        </div>

        <div className="incident-footer">
          Showing {filteredIncidents.length} of {incidents.length}{' '}
          events
        </div>
      </section>

      {selectedIncident && (
        <aside className="incident-detail">
          <div className="incident-detail-header">
            <div>
              <span className="panel-label">EVENT DETAIL</span>

              <h4>{selectedIncident.type}</h4>
            </div>

            <button
              className="detail-close"
              onClick={() => setSelectedIncident(null)}
              aria-label="Close event details"
            >
              ×
            </button>
          </div>

          <div className="detail-status">
            <span
              className={`status-badge ${
                selectedIncident.severity.toLowerCase()
              }`}
            >
              {selectedIncident.severity}
            </span>

            <span className="detail-event-id">
              {selectedIncident.id}
            </span>
          </div>

          <div className="detail-grid">
            <div>
              <span>BUS</span>

              <strong>{selectedIncident.bus}</strong>
            </div>

            <div>
              <span>LOCATION</span>

              <strong>{selectedIncident.location}</strong>
            </div>

            <div>
              <span>STATUS</span>

              <strong>{selectedIncident.status}</strong>
            </div>

            <div>
              <span>SOURCE</span>

              <strong>{selectedIncident.source}</strong>
            </div>

            <div>
              <span>DEVICE</span>

              <strong>{selectedIncident.device}</strong>
            </div>

            <div>
              <span>CONFIDENCE</span>

              <strong>
                {selectedIncident.confidence !== null
                  ? `${selectedIncident.confidence}%`
                  : 'Unavailable'}
              </strong>
            </div>

            <div>
              <span>OBSERVED</span>

              <strong>{selectedIncident.time}</strong>
            </div>
          </div>

          <div className="detail-note">
            <strong>Backend Event</strong>

            <p>
              Event details are loaded from the BUSSENSE backend
              event contract.
            </p>
          </div>
        </aside>
      )}
    </div>
  )
}

export default IncidentCentre