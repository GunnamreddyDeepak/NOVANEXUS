import {
  AlertTriangle,
  Camera,
  MapPin,
  Repeat2,
  Route,
  ShieldCheck,
} from 'lucide-react'

const roadObservations = [
  {
    id: 'RI-001',
    location: 'Anna Nagar',
    road: '2nd Avenue',
    issue: 'Waterlogging',
    severity: 'Critical',
    events: 6,
    buses: 3,
    evidence: 'Available',
    lastObserved: '4 min ago',
  },
  {
    id: 'RI-002',
    location: 'Guindy',
    road: 'GST Road',
    issue: 'Road Damage',
    severity: 'Medium',
    events: 4,
    buses: 2,
    evidence: 'Available',
    lastObserved: '12 min ago',
  },
  {
    id: 'RI-003',
    location: 'T. Nagar',
    road: 'Usman Road',
    issue: 'Congestion',
    severity: 'Medium',
    events: 5,
    buses: 3,
    evidence: 'Available',
    lastObserved: '18 min ago',
  },
  {
    id: 'RI-004',
    location: 'Velachery',
    road: 'Velachery Main Road',
    issue: 'Infrastructure Damage',
    severity: 'Low',
    events: 2,
    buses: 1,
    evidence: 'Pending',
    lastObserved: '31 min ago',
  },
  {
    id: 'RI-005',
    location: 'Adyar',
    road: 'LB Road',
    issue: 'Road Damage',
    severity: 'Medium',
    events: 3,
    buses: 2,
    evidence: 'Available',
    lastObserved: '46 min ago',
  },
]

const severityClass = {
  Critical: 'critical',
  Medium: 'warning',
  Low: 'info',
}

function RoadIntelligence() {
  const recurringLocations = roadObservations.filter(
    (observation) => observation.events >= 3
  ).length

  const evidenceAvailable = roadObservations.filter(
    (observation) => observation.evidence === 'Available'
  ).length

  const criticalLocations = roadObservations.filter(
    (observation) => observation.severity === 'Critical'
  ).length

  return (
    <div className="road-intelligence-page">
      <div className="page-heading">
        <div>
          <div className="page-label">
            <Route size={15} />
            ROAD INTELLIGENCE
          </div>
          <h3>Road Condition Intelligence</h3>
          <p>
            Prototype view connecting bus observations with recurring road
            events and affected locations.
          </p>
        </div>

        <span className="simulation-badge">
          <MapPin size={14} />
          SIMULATED DATA
        </span>
      </div>

      <div className="road-intelligence-note">
        <strong>Prototype limitation:</strong> These are simulated road-event
        observations. No PostGIS processing, automated hotspot engine, or
        production spatial analytics is connected.
      </div>

      <div className="kpi-grid road-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon info">
            <MapPin size={21} />
          </div>
          <div>
            <span>Observed Locations</span>
            <strong>{roadObservations.length}</strong>
            <small>Simulated problem locations</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon warning">
            <Repeat2 size={21} />
          </div>
          <div>
            <span>Recurring Locations</span>
            <strong>{recurringLocations}</strong>
            <small>3+ observations in sample</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon critical">
            <AlertTriangle size={21} />
          </div>
          <div>
            <span>Critical Locations</span>
            <strong>{criticalLocations}</strong>
            <small>Requires validation</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon healthy">
            <Camera size={21} />
          </div>
          <div>
            <span>Evidence Available</span>
            <strong>{evidenceAvailable}</strong>
            <small>Of {roadObservations.length} observations</small>
          </div>
        </div>
      </div>

      <section className="panel road-observation-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">ROAD OBSERVATIONS</span>
            <h4>Problem locations and recurring observations</h4>
          </div>

          <span className="simulation-badge">SIMULATED</span>
        </div>

        <div className="road-table-wrapper">
          <table className="road-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Road / Segment</th>
                <th>Issue</th>
                <th>Severity</th>
                <th>Events</th>
                <th>Buses</th>
                <th>Evidence</th>
                <th>Last Observed</th>
              </tr>
            </thead>

            <tbody>
              {roadObservations.map((observation) => (
                <tr key={observation.id}>
                  <td>
                    <div className="road-location">
                      <MapPin size={15} />
                      <strong>{observation.location}</strong>
                    </div>
                  </td>

                  <td>{observation.road}</td>

                  <td>{observation.issue}</td>

                  <td>
                    <span
                      className={`road-severity ${severityClass[observation.severity]}`}
                    >
                      {observation.severity}
                    </span>
                  </td>

                  <td>
                    <strong>{observation.events}</strong>
                  </td>

                  <td>{observation.buses}</td>

                  <td>
                    <span
                      className={`evidence-status ${
                        observation.evidence === 'Available'
                          ? 'available'
                          : 'pending'
                      }`}
                    >
                      {observation.evidence === 'Available' ? (
                        <ShieldCheck size={13} />
                      ) : (
                        <Camera size={13} />
                      )}
                      {observation.evidence}
                    </span>
                  </td>

                  <td>{observation.lastObserved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="road-intelligence-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">RECURRING OBSERVATION</span>
              <h4>How road intelligence is formed</h4>
            </div>
            <Repeat2 size={18} />
          </div>

          <div className="intelligence-flow">
            <div className="flow-step">
              <span>01</span>
              <strong>Bus Detection</strong>
              <p>A bus reports an observed road event.</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span>02</span>
              <strong>Road Event</strong>
              <p>Event type and severity are recorded.</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span>03</span>
              <strong>Location</strong>
              <p>Observation is associated with a location.</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span>04</span>
              <strong>Recurring Observation</strong>
              <p>Repeated observations become a prototype signal.</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-step">
              <span>05</span>
              <strong>Road Intelligence</strong>
              <p>Operators can inspect the affected location.</p>
            </div>
          </div>
        </section>

        <section className="panel road-summary-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">LOCATION SUMMARY</span>
              <h4>Current prototype observations</h4>
            </div>
            <MapPin size={18} />
          </div>

          <div className="road-summary-list">
            {roadObservations.slice(0, 4).map((observation) => (
              <div className="road-summary-item" key={observation.id}>
                <div>
                  <strong>{observation.location}</strong>
                  <span>{observation.issue}</span>
                </div>

                <div className="road-summary-count">
                  <strong>{observation.events}</strong>
                  <span>events</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="road-disclaimer">
        <AlertTriangle size={16} />
        <span>
          Repeated observations shown above are prototype signals only. They
          should be validated through the future backend event/fusion pipeline
          before being treated as confirmed road conditions.
        </span>
      </div>
    </div>
  )
}

export default RoadIntelligence