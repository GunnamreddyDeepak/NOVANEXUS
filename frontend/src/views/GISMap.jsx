import { useEffect, useState } from 'react'
import {
  MapPin,
  Bus,
  AlertTriangle,
  Navigation,
} from 'lucide-react'

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import { fetchEvents } from '../api/events'

function GISMap() {
  const [showBuses, setShowBuses] = useState(true)
  const [showIncidents, setShowIncidents] = useState(true)

  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /*
   * Bus markers remain simulated for this integration step because
   * the current backend does not yet expose a buses API.
   *
   * We will replace this with GET /api/v1/buses later.
   */
  const buses = []

  useEffect(() => {
    let mounted = true

    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const response = await fetchEvents()

        const backendEvents = Array.isArray(response)
          ? response
          : Array.isArray(response?.events)
            ? response.events
            : []

        const mappedEvents = backendEvents
          .filter(
            (event) =>
              typeof event.latitude === 'number' &&
              typeof event.longitude === 'number'
          )
          .map((event) => ({
            id: event.event_id,
            type:
              event.sub_type === 'POTHOLE'
                ? 'Road Damage'
                : (event.event_type || 'Unknown Event').replaceAll(
                    '_',
                    ' '
                  ),
            subType: event.sub_type || 'Not specified',
            bus: event.bus_id || 'Unknown',
            device: event.device_id || 'Unknown',
            severity: event.severity || 'UNKNOWN',
            status: event.status || 'UNKNOWN',
            source: event.source_type || 'UNKNOWN',
            confidence:
              typeof event.confidence === 'number'
                ? event.confidence
                : null,
            lat: event.latitude,
            lng: event.longitude,
            observedAt: event.observed_at,
          }))

        if (mounted) {
          setIncidents(mappedEvents)
        }
      } catch (err) {
        if (mounted) {
          setIncidents([])
          setError(
            err?.message || 'Failed to load events from backend'
          )
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

  const getSeverityClass = (severity) =>
    String(severity || 'unknown').toLowerCase()

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '#dc2626'

      case 'HIGH':
        return '#f59e0b'

      case 'MEDIUM':
        return '#f59e0b'

      case 'LOW':
        return '#06b6d4'

      default:
        return '#06b6d4'
    }
  }

  return (
    <div className="gis-page">
      <div className="page-heading">
        <div>
          <span className="page-label">OPERATIONS</span>

          <h3>GIS / Map</h3>

          <p>
            View fleet locations, detected events and urban
            conditions on the operational map.
          </p>
        </div>

        <span className="simulation-badge">
          BACKEND EVENT DATA
        </span>
      </div>

      <div className="gis-layout">
        <section className="gis-map-panel">
          <div className="gis-toolbar">
            <div>
              <span className="panel-label">
                LIVE SPATIAL VIEW
              </span>

              <strong>
                Chennai Urban Mobility
              </strong>
            </div>

            <div className="gis-filters">
              <label>
                <input
                  type="checkbox"
                  checked={showBuses}
                  onChange={(event) =>
                    setShowBuses(event.target.checked)
                  }
                />

                Buses
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={(event) =>
                    setShowIncidents(event.target.checked)
                  }
                />

                Incidents
              </label>
            </div>
          </div>

          <div className="map-container">
            <MapContainer
              center={[13.0821, 80.2691]}
              zoom={12}
              scrollWheelZoom={true}
              className="leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {showIncidents &&
                incidents.map((incident) => (
                  <CircleMarker
                    key={incident.id}
                    center={[
                      incident.lat,
                      incident.lng,
                    ]}
                    radius={9}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 2,
                      fillColor: getMarkerColor(
                        incident.severity
                      ),
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <strong>{incident.type}</strong>

                      <br />

                      {incident.subType}

                      <br />

                      Event: {incident.id}

                      <br />

                      Bus: {incident.bus}

                      <br />

                      Device: {incident.device}

                      <br />

                      Severity: {incident.severity}

                      <br />

                      Status: {incident.status}

                      <br />

                      Confidence:{' '}
                      {incident.confidence !== null
                        ? `${incident.confidence}%`
                        : 'Unavailable'}

                      <br />

                      Source: {incident.source}

                      <br />

                      Coordinates:{' '}
                      {incident.lat.toFixed(4)},{' '}
                      {incident.lng.toFixed(4)}
                    </Popup>
                  </CircleMarker>
                ))}

              {showBuses &&
                buses.map((bus) => (
                  <CircleMarker
                    key={bus.id}
                    center={[
                      bus.lat,
                      bus.lng,
                    ]}
                    radius={7}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 2,
                      fillColor: '#2563eb',
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <strong>{bus.id}</strong>

                      <br />

                      Route: {bus.route}

                      <br />

                      Location: {bus.location}

                      <br />

                      Status: {bus.status}
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>

            <span className="map-simulation-label">
              REAL BACKEND EVENTS
            </span>
          </div>

          <div className="map-legend">
            <span>
              <i className="legend-dot bus" />
              Bus
            </span>

            <span>
              <i className="legend-dot critical" />
              Critical
            </span>

            <span>
              <i className="legend-dot medium" />
              High / Medium
            </span>

            <span>
              <i className="legend-dot low" />
              Other Event
            </span>
          </div>
        </section>

        <aside className="gis-side-panel">
          <div className="gis-side-header">
            <div>
              <span className="panel-label">
                MAPPED EVENTS
              </span>

              <h4>
                Active Locations
              </h4>
            </div>

            <Navigation size={18} />
          </div>

          <div className="gis-event-list">
            {loading && (
              <div className="gis-event">
                <div className="gis-event-content">
                  <strong>Loading events...</strong>

                  <small>
                    Fetching spatial event data from backend
                  </small>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="gis-event">
                <div className="gis-event-icon critical">
                  <AlertTriangle size={15} />
                </div>

                <div className="gis-event-content">
                  <strong>
                    Unable to load events
                  </strong>

                  <small>{error}</small>
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              incidents.map((incident) => (
                <div
                  className="gis-event"
                  key={incident.id}
                >
                  <div
                    className={`gis-event-icon ${getSeverityClass(
                      incident.severity
                    )}`}
                  >
                    <AlertTriangle size={15} />
                  </div>

                  <div className="gis-event-content">
                    <strong>
                      {incident.type}
                    </strong>

                    <span>
                      <MapPin size={12} />

                      {incident.lat.toFixed(4)},{' '}
                      {incident.lng.toFixed(4)}
                    </span>

                    <small>
                      {incident.bus} · {incident.id}
                    </small>
                  </div>
                </div>
              ))}

            {!loading &&
              !error &&
              incidents.length === 0 && (
                <div className="gis-event">
                  <div className="gis-event-content">
                    <strong>
                      No mapped events
                    </strong>

                    <small>
                      No backend events with valid coordinates
                      are currently available.
                    </small>
                  </div>
                </div>
              )}
          </div>

          <div className="gis-bus-summary">
            <div className="gis-summary-icon">
              <Bus size={18} />
            </div>

            <div>
              <span>
                Mapped Buses
              </span>

              <strong>
                {buses.length}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GISMap