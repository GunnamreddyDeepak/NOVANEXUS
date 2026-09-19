import {
  AlertTriangle,
  Bus,
  MapPin,
  Activity,
} from 'lucide-react'

const stats = [
  {
    label: 'Active Incidents',
    value: '08',
    icon: AlertTriangle,
    type: 'warning',
  },
  {
    label: 'Buses Online',
    value: '42',
    icon: Bus,
    type: 'healthy',
  },
  {
    label: 'Events Today',
    value: '126',
    icon: Activity,
    type: 'info',
  },
  {
    label: 'Mapped Locations',
    value: '31',
    icon: MapPin,
    type: 'info',
  },
]

function Overview() {
  return (
    <div className="overview-page">
      <div className="page-heading">
        <div>
          <span className="page-label">OPERATIONS</span>
          <h3>Control Tower Overview</h3>
          <p>
            Monitor urban mobility conditions, fleet activity and detected
            events from one operational view.
          </p>
        </div>

        <span className="simulation-badge">
          SIMULATED DATA
        </span>
      </div>

      <div className="kpi-grid">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div className="kpi-card" key={stat.label}>
              <div className={`kpi-icon ${stat.type}`}>
                <Icon size={20} />
              </div>

              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overview-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">CURRENT CONDITIONS</span>
              <h4>Urban Situation</h4>
            </div>

            <span className="status-badge healthy">
              Operational
            </span>
          </div>

          <div className="situation-content">
            <div className="situation-map">
              <div className="map-grid" />

              <div className="map-marker marker-one" />
              <div className="map-marker marker-two" />
              <div className="map-marker marker-three" />
              <div className="map-marker marker-four" />

              <span className="map-label">SIMULATED MAP DATA</span>
            </div>

            <div className="condition-list">
              <div>
                <span>Traffic</span>
                <strong>Moderate</strong>
              </div>

              <div>
                <span>Road Conditions</span>
                <strong>3 Areas Requiring Review</strong>
              </div>

              <div>
                <span>Fleet Connectivity</span>
                <strong>96% Online</strong>
              </div>

              <div>
                <span>Last Update</span>
                <strong>2 min ago</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">INCIDENTS</span>
              <h4>Recent Activity</h4>
            </div>

            <span className="panel-action">View all</span>
          </div>

          <div className="incident-list">
            <div className="incident-item">
              <span className="severity-dot critical" />

              <div>
                <strong>Waterlogging detected</strong>
                <span>BUS-1042 · 4 min ago</span>
              </div>

              <span className="status-badge critical">
                Critical
              </span>
            </div>

            <div className="incident-item">
              <span className="severity-dot warning" />

              <div>
                <strong>Road damage detected</strong>
                <span>BUS-1021 · 12 min ago</span>
              </div>

              <span className="status-badge warning">
                Review
              </span>
            </div>

            <div className="incident-item">
              <span className="severity-dot info" />

              <div>
                <strong>Traffic congestion</strong>
                <span>BUS-1098 · 18 min ago</span>
              </div>

              <span className="status-badge info">
                Detected
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Overview