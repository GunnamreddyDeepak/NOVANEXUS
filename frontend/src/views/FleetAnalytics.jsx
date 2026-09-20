import {
  Activity,
  Bus,
  Radio,
  Server,
  Wifi,
  WifiOff,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const fleetData = [
  { bus: 'BUS-1042', events: 18, activity: 92, status: 'Online' },
  { bus: 'BUS-1021', events: 14, activity: 84, status: 'Online' },
  { bus: 'BUS-1098', events: 11, activity: 76, status: 'Degraded' },
  { bus: 'BUS-1065', events: 9, activity: 68, status: 'Online' },
  { bus: 'BUS-1017', events: 6, activity: 54, status: 'Offline' },
]

const connectivityData = [
  { status: 'Online', buses: 42 },
  { status: 'Degraded', buses: 3 },
  { status: 'Offline', buses: 3 },
]

const statusClass = {
  Online: 'healthy',
  Degraded: 'warning',
  Offline: 'critical',
}

function FleetAnalytics() {
  const totalEvents = fleetData.reduce((sum, bus) => sum + bus.events, 0)

  return (
    <div className="fleet-analytics-page">
      <div className="page-heading">
        <div>
          <div className="page-label">
            <Bus size={15} />
            FLEET ANALYTICS
          </div>

          <h3>Fleet Activity & Health</h3>

          <p>
            Prototype view of bus activity, event contribution and
            device connectivity health.
          </p>
        </div>

        <span className="simulation-badge">
          <Radio size={14} />
          SIMULATED DATA
        </span>
      </div>

      <div className="fleet-analytics-note">
        <strong>Prototype analytics:</strong> Fleet values are simulated
        observations for the SIH demonstration. No live telemetry,
        vehicle tracking service or production fleet API is connected.
      </div>

      <div className="kpi-grid fleet-analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon info">
            <Bus size={21} />
          </div>

          <div>
            <span>Total Fleet</span>
            <strong>48</strong>
            <small>Simulated buses</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon healthy">
            <Wifi size={21} />
          </div>

          <div>
            <span>Online</span>
            <strong>42</strong>
            <small>87.5% of fleet</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon warning">
            <Activity size={21} />
          </div>

          <div>
            <span>Degraded</span>
            <strong>3</strong>
            <small>Connectivity attention</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon critical">
            <WifiOff size={21} />
          </div>

          <div>
            <span>Offline</span>
            <strong>3</strong>
            <small>Connectivity unavailable</small>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">EVENT CONTRIBUTION</span>
              <h4>Events detected by bus</h4>
            </div>

            <Bus size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="bus" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="events"
                  name="Events"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">CONNECTIVITY</span>
              <h4>Fleet device health</h4>
            </div>

            <Server size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={connectivityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="status" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="buses"
                  name="Buses"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel fleet-activity-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">BUS ACTIVITY</span>
            <h4>Fleet event contribution</h4>
          </div>

          <span className="simulation-badge">
            SIMULATED
          </span>
        </div>

        <div className="fleet-table-wrapper">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Events Detected</th>
                <th>Activity</th>
                <th>Connectivity</th>
              </tr>
            </thead>

            <tbody>
              {fleetData.map((bus) => (
                <tr key={bus.bus}>
                  <td>
                    <strong>{bus.bus}</strong>
                  </td>

                  <td>{bus.events}</td>

                  <td>
                    <div className="activity-cell">
                      <div className="activity-bar">
                        <span
                          style={{
                            width: `${bus.activity}%`,
                          }}
                        />
                      </div>

                      <small>{bus.activity}%</small>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`fleet-status ${
                        statusClass[bus.status]
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="fleet-summary">
        <div>
          <strong>{totalEvents}</strong>
          <span>Total simulated events contributed by tracked buses</span>
        </div>

        <div>
          <strong>48</strong>
          <span>Total simulated fleet size</span>
        </div>

        <div>
          <strong>87.5%</strong>
          <span>Simulated online connectivity</span>
        </div>
      </div>

      <div className="fleet-flow">
        <span>Bus</span>
        <span>→</span>
        <span>Device Status</span>
        <span>→</span>
        <span>Event Detection</span>
        <span>→</span>
        <span>Fleet Analytics</span>
      </div>
    </div>
  )
}

export default FleetAnalytics