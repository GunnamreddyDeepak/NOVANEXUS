import {
  Bus,
  MapPin,
  Gauge,
  Wifi,
  WifiOff,
  Search,
} from 'lucide-react'
import { useState } from 'react'

const buses = [
  {
    id: 'BUS-1042',
    route: 'Route 21A',
    status: 'Moving',
    location: 'Anna Nagar',
    speed: '38 km/h',
    connectivity: 'Online',
    updated: '1 min ago',
  },
  {
    id: 'BUS-1021',
    route: 'Route 15B',
    status: 'Moving',
    location: 'Guindy',
    speed: '31 km/h',
    connectivity: 'Online',
    updated: '2 min ago',
  },
  {
    id: 'BUS-1098',
    route: 'Route 7C',
    status: 'Stopped',
    location: 'T. Nagar',
    speed: '0 km/h',
    connectivity: 'Online',
    updated: '3 min ago',
  },
  {
    id: 'BUS-1065',
    route: 'Route 32',
    status: 'Moving',
    location: 'Velachery',
    speed: '42 km/h',
    connectivity: 'Online',
    updated: '1 min ago',
  },
  {
    id: 'BUS-1017',
    route: 'Route 12',
    status: 'Offline',
    location: 'Adyar',
    speed: '—',
    connectivity: 'Offline',
    updated: '14 min ago',
  },
]

function LiveFleet() {
  const [search, setSearch] = useState('')

  const filteredBuses = buses.filter((bus) =>
    `${bus.id} ${bus.route} ${bus.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="fleet-page">
      <div className="page-heading">
        <div>
          <span className="page-label">OPERATIONS</span>

          <h3>Live Fleet</h3>

          <p>
            Monitor active buses, connectivity, location and current
            operating status.
          </p>
        </div>

        <span className="simulation-badge">
          SIMULATED DATA
        </span>
      </div>

      <div className="fleet-summary">
        <div className="fleet-summary-card">
          <Bus size={20} />
          <div>
            <span>Total Fleet</span>
            <strong>48</strong>
          </div>
        </div>

        <div className="fleet-summary-card healthy">
          <Wifi size={20} />
          <div>
            <span>Online</span>
            <strong>42</strong>
          </div>
        </div>

        <div className="fleet-summary-card warning">
          <WifiOff size={20} />
          <div>
            <span>Offline</span>
            <strong>6</strong>
          </div>
        </div>

        <div className="fleet-summary-card">
          <Gauge size={20} />
          <div>
            <span>Moving</span>
            <strong>39</strong>
          </div>
        </div>
      </div>

      <section className="panel fleet-panel">
        <div className="panel-header fleet-header">
          <div>
            <span className="panel-label">FLEET MONITORING</span>
            <h4>Active Bus Status</h4>
          </div>

          <div className="fleet-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search bus, route or location"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="fleet-table-wrapper">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>BUS</th>
                <th>ROUTE</th>
                <th>STATUS</th>
                <th>LOCATION</th>
                <th>SPEED</th>
                <th>CONNECTIVITY</th>
                <th>UPDATED</th>
              </tr>
            </thead>

            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.id}>
                  <td>
                    <div className="bus-id">
                      <Bus size={16} />
                      <strong>{bus.id}</strong>
                    </div>
                  </td>

                  <td>{bus.route}</td>

                  <td>
                    <span
                      className={`fleet-status ${bus.status.toLowerCase()}`}
                    >
                      <span className="status-indicator" />
                      {bus.status}
                    </span>
                  </td>

                  <td>
                    <div className="location-cell">
                      <MapPin size={14} />
                      {bus.location}
                    </div>
                  </td>

                  <td>{bus.speed}</td>

                  <td>
                    <span
                      className={`connectivity ${
                        bus.connectivity.toLowerCase()
                      }`}
                    >
                      {bus.connectivity === 'Online' ? (
                        <Wifi size={14} />
                      ) : (
                        <WifiOff size={14} />
                      )}

                      {bus.connectivity}
                    </span>
                  </td>

                  <td>{bus.updated}</td>
                </tr>
              ))}

              {filteredBuses.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-fleet">
                    No buses match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fleet-footer">
          <span>
            Showing {filteredBuses.length} of {buses.length} simulated buses
          </span>

          <span className="fleet-note">
            Frontend preview data
          </span>
        </div>
      </section>
    </div>
  )
}

export default LiveFleet