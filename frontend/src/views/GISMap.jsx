import { useState } from 'react'
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

const incidents = [
  {
    id: 'EVT-2048',
    type: 'Waterlogging',
    bus: 'BUS-1042',
    location: 'Anna Nagar',
    severity: 'Critical',
    lat: 13.0878,
    lng: 80.2081,
  },
  {
    id: 'EVT-2047',
    type: 'Road Damage',
    bus: 'BUS-1021',
    location: 'Guindy',
    severity: 'Medium',
    lat: 13.0067,
    lng: 80.2206,
  },
  {
    id: 'EVT-2046',
    type: 'Congestion',
    bus: 'BUS-1098',
    location: 'T. Nagar',
    severity: 'Medium',
    lat: 13.0418,
    lng: 80.2341,
  },
  {
    id: 'EVT-2045',
    type: 'Infrastructure Damage',
    bus: 'BUS-1065',
    location: 'Velachery',
    severity: 'Low',
    lat: 12.9756,
    lng: 80.2212,
  },
]

const buses = [
  {
    id: 'BUS-1042',
    route: '21G',
    location: 'Anna Nagar',
    lat: 13.0827,
    lng: 80.2102,
    status: 'Online',
  },
  {
    id: 'BUS-1021',
    route: '18D',
    location: 'Guindy',
    lat: 13.008,
    lng: 80.215,
    status: 'Online',
  },
  {
    id: 'BUS-1098',
    route: '5C',
    location: 'T. Nagar',
    lat: 13.038,
    lng: 80.230,
    status: 'Online',
  },
]

function GISMap() {
  const [showBuses, setShowBuses] = useState(true)
  const [showIncidents, setShowIncidents] = useState(true)

  return (
    <div className="gis-page">

      <div className="page-heading">
        <div>
          <span className="page-label">OPERATIONS</span>

          <h3>GIS / Map</h3>

          <p>
            View fleet locations, detected events and urban conditions
            on the operational map.
          </p>
        </div>

        <span className="simulation-badge">
          SIMULATED MAP DATA
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
              center={[13.0475, 80.2089]}
              zoom={12}
              scrollWheelZoom={true}
              className="leaflet-map"
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {showIncidents &&
                incidents.map((incident) => {

                  const radius = 9

                  let fillColor = '#06b6d4'

                  if (incident.severity === 'Critical') {
                    fillColor = '#dc2626'
                  }

                  if (incident.severity === 'Medium') {
                    fillColor = '#f59e0b'
                  }

                  return (
                    <CircleMarker
                      key={incident.id}
                      center={[
                        incident.lat,
                        incident.lng,
                      ]}
                      radius={radius}
                      pathOptions={{
                        color: '#ffffff',
                        weight: 2,
                        fillColor,
                        fillOpacity: 0.9,
                      }}
                    >

                      <Popup>
                        <strong>
                          {incident.type}
                        </strong>

                        <br />

                        {incident.location}

                        <br />

                        {incident.bus}

                        <br />

                        Severity: {incident.severity}
                      </Popup>

                    </CircleMarker>
                  )
                })}

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
              SIMULATED MAP DATA
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
              Medium
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

            {incidents.map((incident) => (
              <div
                className="gis-event"
                key={incident.id}
              >

                <div
                  className={`gis-event-icon ${incident.severity.toLowerCase()}`}
                >
                  <AlertTriangle size={15} />
                </div>

                <div className="gis-event-content">

                  <strong>
                    {incident.type}
                  </strong>

                  <span>
                    <MapPin size={12} />
                    {incident.location}
                  </span>

                  <small>
                    {incident.bus} · {incident.id}
                  </small>

                </div>

              </div>
            ))}

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