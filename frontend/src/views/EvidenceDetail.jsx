import { useState } from 'react'
import {
  FileSearch,
  MapPin,
  Bus,
  Clock3,
  Camera,
  Database,
  ShieldCheck,
} from 'lucide-react'

const events = [
  {
    id: 'EVT-2048',
    type: 'Waterlogging',
    subType: 'Road Water Accumulation',
    severity: 'Critical',
    status: 'Detected',
    confidence: '94%',
    bus: 'BUS-1042',
    device: 'EDGE-1042',
    location: 'Anna Nagar',
    latitude: '13.0878',
    longitude: '80.2081',
    observed: '4 min ago',
    source: 'SIMULATED EDGE AI',
  },
  {
    id: 'EVT-2047',
    type: 'Road Damage',
    subType: 'Surface Damage',
    severity: 'Medium',
    status: 'Validated',
    confidence: '87%',
    bus: 'BUS-1021',
    device: 'EDGE-1021',
    location: 'Guindy',
    latitude: '13.0067',
    longitude: '80.2206',
    observed: '12 min ago',
    source: 'SIMULATED EDGE AI',
  },
  {
    id: 'EVT-2046',
    type: 'Congestion',
    subType: 'Traffic Build-up',
    severity: 'Medium',
    status: 'Detected',
    confidence: '82%',
    bus: 'BUS-1098',
    device: 'EDGE-1098',
    location: 'T. Nagar',
    latitude: '13.0418',
    longitude: '80.2341',
    observed: '18 min ago',
    source: 'SIMULATED EDGE AI',
  },
]

function EvidenceDetail() {
  const [selectedId, setSelectedId] = useState(events[0].id)

  const selectedEvent =
    events.find((event) => event.id === selectedId) || events[0]

  return (
    <div className="evidence-page">

      <div className="page-heading">
        <div>
          <span className="page-label">TRACEABILITY</span>

          <h3>Evidence & Detail</h3>

          <p>
            Inspect event metadata, source information and supporting
            evidence for detected events.
          </p>
        </div>

        <span className="simulation-badge">
          SIMULATED DATA
        </span>
      </div>

      <div className="evidence-layout">

        <section className="panel evidence-events">

          <div className="panel-header">
            <div>
              <span className="panel-label">
                EVENT RECORDS
              </span>

              <h4>Available Events</h4>
            </div>

            <FileSearch size={18} />
          </div>

          <div className="evidence-event-list">

            {events.map((event) => (
              <button
                key={event.id}
                className={`evidence-event-row ${
                  selectedEvent.id === event.id
                    ? 'selected'
                    : ''
                }`}
                onClick={() => setSelectedId(event.id)}
              >

                <div
                  className={`evidence-event-icon ${event.severity.toLowerCase()}`}
                >
                  <FileSearch size={16} />
                </div>

                <div className="evidence-event-info">

                  <strong>{event.type}</strong>

                  <span>{event.id}</span>

                  <small>
                    {event.location} · {event.observed}
                  </small>

                </div>

                <span
                  className={`status-badge ${event.severity.toLowerCase()}`}
                >
                  {event.severity}
                </span>

              </button>
            ))}

          </div>

        </section>

        <section className="panel evidence-detail-card">

          <div className="panel-header evidence-detail-header">

            <div>
              <span className="panel-label">
                EVENT RECORD
              </span>

              <h4>{selectedEvent.type}</h4>

              <span className="evidence-subtitle">
                {selectedEvent.id}
              </span>
            </div>

            <span
              className={`status-badge ${selectedEvent.severity.toLowerCase()}`}
            >
              {selectedEvent.severity}
            </span>

          </div>

          <div className="evidence-grid">

            <div className="evidence-section">

              <div className="evidence-section-title">
                <Database size={16} />
                Event Information
              </div>

              <div className="metadata-grid">

                <div>
                  <span>EVENT TYPE</span>
                  <strong>{selectedEvent.type}</strong>
                </div>

                <div>
                  <span>SUB TYPE</span>
                  <strong>{selectedEvent.subType}</strong>
                </div>

                <div>
                  <span>STATUS</span>
                  <strong>{selectedEvent.status}</strong>
                </div>

                <div>
                  <span>CONFIDENCE</span>
                  <strong>{selectedEvent.confidence}</strong>
                </div>

              </div>

            </div>

            <div className="evidence-section">

              <div className="evidence-section-title">
                <MapPin size={16} />
                Location
              </div>

              <div className="metadata-grid">

                <div>
                  <span>LOCATION</span>
                  <strong>{selectedEvent.location}</strong>
                </div>

                <div>
                  <span>LATITUDE</span>
                  <strong>{selectedEvent.latitude}</strong>
                </div>

                <div>
                  <span>LONGITUDE</span>
                  <strong>{selectedEvent.longitude}</strong>
                </div>

                <div>
                  <span>OBSERVED</span>
                  <strong>{selectedEvent.observed}</strong>
                </div>

              </div>

            </div>

            <div className="evidence-section">

              <div className="evidence-section-title">
                <Bus size={16} />
                Source & Device
              </div>

              <div className="metadata-grid">

                <div>
                  <span>BUS ID</span>
                  <strong>{selectedEvent.bus}</strong>
                </div>

                <div>
                  <span>DEVICE ID</span>
                  <strong>{selectedEvent.device}</strong>
                </div>

                <div>
                  <span>SOURCE TYPE</span>
                  <strong>{selectedEvent.source}</strong>
                </div>

                <div>
                  <span>SCHEMA</span>
                  <strong>v1</strong>
                </div>

              </div>

            </div>

          </div>

          <div className="evidence-preview">

            <div className="evidence-section-title">
              <Camera size={16} />
              Evidence Preview
            </div>

            <div className="evidence-placeholder">

              <Camera size={32} />

              <strong>
                Simulated Evidence
              </strong>

              <span>
                Real image or video evidence will be loaded
                from the backend evidence service.
              </span>

              <small>
                SIMULATED EVIDENCE
              </small>

            </div>

          </div>

          <div className="evidence-source-note">

            <ShieldCheck size={16} />

            <div>
              <strong>
                Traceability
              </strong>

              <p>
                This record keeps the event, bus, device,
                location, source and evidence relationship
                visible for operational verification.
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default EvidenceDetail