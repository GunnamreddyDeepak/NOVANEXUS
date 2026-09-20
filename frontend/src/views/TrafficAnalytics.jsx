import {
  BarChart3,
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const eventTrendData = [
  { period: '06 AM', events: 3 },
  { period: '08 AM', events: 8 },
  { period: '10 AM', events: 5 },
  { period: '12 PM', events: 7 },
  { period: '02 PM', events: 11 },
  { period: '04 PM', events: 14 },
  { period: '06 PM', events: 18 },
  { period: '08 PM', events: 9 },
]

const eventTypeData = [
  { name: 'Waterlogging', value: 18 },
  { name: 'Road Damage', value: 14 },
  { name: 'Congestion', value: 21 },
  { name: 'Infrastructure', value: 8 },
  { name: 'Pedestrian Risk', value: 5 },
]

const severityData = [
  { severity: 'Critical', count: 8 },
  { severity: 'Medium', count: 31 },
  { severity: 'Low', count: 27 },
]

const routeActivity = [
  { route: '21G', events: 18, buses: 5, status: 'High activity' },
  { route: '18D', events: 14, buses: 4, status: 'Moderate' },
  { route: '5C', events: 12, buses: 4, status: 'Moderate' },
  { route: '27B', events: 9, buses: 3, status: 'Normal' },
  { route: '29A', events: 7, buses: 3, status: 'Normal' },
]

const pieColors = ['#0891b2', '#f59e0b', '#ef4444', '#6366f1', '#10b981']

function TrafficAnalytics() {
  const totalEvents = eventTypeData.reduce((sum, item) => sum + item.value, 0)
  const peakPeriod = eventTrendData.reduce((peak, item) =>
    item.events > peak.events ? item : peak
  )

  return (
    <div className="analytics-page">
      <div className="page-heading">
        <div>
          <div className="page-label">
            <BarChart3 size={15} />
            TRAFFIC ANALYTICS
          </div>
          <h3>Traffic & Event Intelligence</h3>
          <p>
            Prototype view of event activity, traffic-related observations,
            route activity and severity distribution.
          </p>
        </div>

        <span className="simulation-badge">
          <Radio size={14} />
          SIMULATED DATA
        </span>
      </div>

      <div className="analytics-note">
        <strong>Prototype analytics:</strong> Values shown here are simulated
        observations for the SIH demonstration. No prediction ML or
        production traffic analytics engine is connected.
      </div>

      <div className="kpi-grid analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon info">
            <BarChart3 size={21} />
          </div>
          <div>
            <span>Total Events</span>
            <strong>{totalEvents}</strong>
            <small>Simulated observations</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon warning">
            <TrendingUp size={21} />
          </div>
          <div>
            <span>Peak Period</span>
            <strong>{peakPeriod.period}</strong>
            <small>{peakPeriod.events} events observed</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon healthy">
            <MapPin size={21} />
          </div>
          <div>
            <span>Active Routes</span>
            <strong>5</strong>
            <small>With event observations</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon info">
            <CalendarDays size={21} />
          </div>
          <div>
            <span>Observation Window</span>
            <strong>Today</strong>
            <small>Prototype sample</small>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">EVENT TREND</span>
              <h4>Events observed by time period</h4>
            </div>
            <Clock3 size={18} />
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="events" name="Events" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">EVENT TYPES</span>
              <h4>Observed event distribution</h4>
            </div>
            <BarChart3 size={18} />
          </div>

          <div className="chart-container pie-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={88}
                  labelLine={false}
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="analytics-grid">
        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">SEVERITY</span>
              <h4>Event severity distribution</h4>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="severity" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Events" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel analytics-chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">PEAK ACTIVITY</span>
              <h4>Highest observed event period</h4>
            </div>
            <TrendingUp size={18} />
          </div>

          <div className="peak-summary">
            <strong>{peakPeriod.period}</strong>
            <span>{peakPeriod.events} simulated events</span>
            <p>
              This represents the highest event count in the prototype sample,
              not a production traffic prediction.
            </p>
          </div>
        </section>
      </div>

      <section className="panel route-activity-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">ROUTE ACTIVITY</span>
            <h4>Event activity by route</h4>
          </div>
          <span className="simulation-badge">SIMULATED</span>
        </div>

        <div className="analytics-table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Events</th>
                <th>Buses Observed</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {routeActivity.map((route) => (
                <tr key={route.route}>
                  <td><strong>{route.route}</strong></td>
                  <td>{route.events}</td>
                  <td>{route.buses}</td>
                  <td>
                    <span className="analytics-status">
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="analytics-flow">
        <span>Bus Detection</span>
        <span>→</span>
        <span>Event Observation</span>
        <span>→</span>
        <span>Time / Route Activity</span>
        <span>→</span>
        <span>Traffic Analytics</span>
      </div>
    </div>
  )
}

export default TrafficAnalytics