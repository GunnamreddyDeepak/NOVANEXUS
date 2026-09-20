import { useState } from 'react'
import {
  AlertTriangle,
  Search,
  MapPin,
  Bus,
  Clock3,
} from 'lucide-react'

const incidents = [
  {
    id: 'EVT-2048',
    type: 'Waterlogging',
    bus: 'BUS-1042',
    location: 'Anna Nagar',
    severity: 'Critical',
    status: 'Detected',
    source: 'SIMULATED EDGE AI',
    time: '4 min ago',
  },
  {
    id: 'EVT-2047',
    type: 'Road Damage',
    bus: 'BUS-1021',
    location: 'Guindy',
    severity: 'Medium',
    status: 'Validated',
    source: 'SIMULATED EDGE AI',
    time: '12 min ago',
  },
  {
    id: 'EVT-2046',
    type: 'Congestion',
    bus: 'BUS-1098',
    location: 'T. Nagar',
    severity: 'Medium',
    status: 'Detected',
    source: 'SIMULATED EDGE AI',
    time: '18 min ago',
  },
  {
    id: 'EVT-2045',
    type: 'Infrastructure Damage',
    bus: 'BUS-1065',
    location: 'Velachery',
    severity: 'Low',
    status: 'Acknowledged',
    source: 'SIMULATED EDGE AI',
    time: '27 min ago',
  },
]

function IncidentCentre() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All')
  const [selectedIncident, setSelectedIncident] = useState(null)

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      `${incident.id} ${incident.type} ${incident.bus} ${incident.location}`
        .toLowerCase()
        .includes(search.toLowerCase())

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
            Review detected events, severity, status, location and source
            information.
          </p>
        </div>

        <span className="simulation-badge">
          SIMULATED DATA
        </span>
      </div>

      <div className="incident-summary">
        <div className="incident-summary-card critical">
          <AlertTriangle size={19} />
          <div>
            <span>Critical</span>
            <strong>01</strong>
          </div>
        </div>

        <div className="incident-summary-card warning">
          <AlertTriangle size={19} />
          <div>
            <span>Medium</span>
            <strong>02</strong>
          </div>
        </div>

        <div className="incident-summary-card">
          <AlertTriangle size={19} />
          <div>
            <span>Low</span>
            <strong>01</strong>
          </div>
        </div>

        <div className="incident-summary-card">
          <Clock3 size={19} />
          <div>
            <span>Active Events</span>
            <strong>04</strong>
          </div>
        </div>
      </div>

      <section className="panel incident-panel">
        <div className="panel-header incident-toolbar">
          <div>
            <span className="panel-label">EVENT MONITORING</span>
            <h4>Detected Incidents</h4>
          </div>

          <div className="incident-controls">
            <div className="incident-search">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search event, bus or location"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="severity-filter"
            >
              <option value="All">All severity</option>
              <option value="Critical">Critical</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="incident-list-table">
          {filteredIncidents.map((incident) => (
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
                  className={`severity-dot-large ${incident.severity.toLowerCase()}`}
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
                className={`status-badge ${incident.severity.toLowerCase()}`}
              >
                {incident.severity}
              </span>

              <span className="incident-time">
                {incident.time}
              </span>
            </button>
          ))}

          {filteredIncidents.length === 0 && (
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
          simulated incidents
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
            >
              ×
            </button>
          </div>

          <div className="detail-status">
            <span
              className={`status-badge ${selectedIncident.severity.toLowerCase()}`}
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
              <span>OBSERVED</span>
              <strong>{selectedIncident.time}</strong>
            </div>
          </div>

          <div className="detail-note">
            <strong>Frontend preview</strong>

            <p>
              Event details will be populated from the backend event
              contract when API integration is implemented.
            </p>
          </div>
        </aside>
      )}
    </div>
  )
}

export default IncidentCentre