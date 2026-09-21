import { useEffect, useState } from "react";
import {
  FileSearch,
  MapPin,
  Bus,
  Camera,
  Database,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { fetchEvents } from "../api/events";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8010";

function EvidenceDetail() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetchEvents();

        // Support both possible API response shapes:
        // 1. [...]
        // 2. { events: [...] }
        const backendEvents = Array.isArray(response)
          ? response
          : Array.isArray(response?.events)
            ? response.events
            : [];

        const mappedEvents = backendEvents.map((event) => ({
          id: event.event_id,
          type:
            event.sub_type === "POTHOLE"
              ? "Road Damage"
              : (event.event_type || "Unknown Event").replaceAll("_", " "),
          subType: event.sub_type || "Not specified",
          severity: event.severity || "UNKNOWN",
          status: event.status || "UNKNOWN",
          confidence:
            typeof event.confidence === "number"
              ? `${event.confidence}%`
              : "Unavailable",
          bus: event.bus_id || "Unknown",
          device: event.device_id || "Unknown",
          latitude:
            typeof event.latitude === "number"
              ? event.latitude.toFixed(4)
              : "Unavailable",
          longitude:
            typeof event.longitude === "number"
              ? event.longitude.toFixed(4)
              : "Unavailable",
          observed: event.observed_at
            ? new Date(event.observed_at).toLocaleString()
            : "Unavailable",
          source: event.source_type || "UNKNOWN",
          schema: event.schema_version || "Unknown",
          evidence: event.evidence || {},
          metadata: event.metadata || {},
        }));

        if (mounted) {
          setEvents(mappedEvents);

          const firstEvidenceEvent = mappedEvents.find(
            (event) => event.evidence?.image_ref,
          );

          if (firstEvidenceEvent) {
            setSelectedId(firstEvidenceEvent.id);
          } else if (mappedEvents.length > 0) {
            setSelectedId(mappedEvents[0].id);
          } else {
            setSelectedId(null);
          }
        }
      } catch (err) {
        if (mounted) {
          setEvents([]);
          setSelectedId(null);
          setError(err?.message || "Failed to load events from backend");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedEvent =
    events.find((event) => event.id === selectedId) || events[0] || null;
  const getEvidenceUrl = (imageRef) => {
    if (!imageRef) {
      return null;
    }

    const filename = imageRef.replaceAll("\\", "/").split("/").pop();

    if (!filename) {
      return null;
    }

    return `${API_BASE_URL}/api/v1/evidence/${encodeURIComponent(filename)}`;
  };
  return (
    <div className="evidence-page">
      <div className="page-heading">
        <div>
          <span className="page-label">TRACEABILITY</span>

          <h3>Evidence & Detail</h3>

          <p>
            Inspect event metadata, source information and supporting evidence
            for detected events.
          </p>
        </div>

        <span className="simulation-badge">BACKEND DATA</span>
      </div>

      <div className="evidence-layout">
        <section className="panel evidence-events">
          <div className="panel-header">
            <div>
              <span className="panel-label">EVENT RECORDS</span>

              <h4>Available Events</h4>
            </div>

            <FileSearch size={18} />
          </div>

          <div className="evidence-event-list">
            {loading && (
              <div className="evidence-empty">
                <strong>Loading events...</strong>
              </div>
            )}

            {error && !loading && (
              <div className="evidence-empty">
                <AlertTriangle size={24} />

                <strong>Unable to load events</strong>

                <span>{error}</span>
              </div>
            )}

            {!loading &&
              !error &&
              events.map((event) => (
                <button
                  key={event.id}
                  className={`evidence-event-row ${
                    selectedEvent?.id === event.id ? "selected" : ""
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
                      {event.latitude}, {event.longitude} · {event.observed}
                    </small>
                  </div>

                  <span
                    className={`status-badge ${event.severity.toLowerCase()}`}
                  >
                    {event.severity}
                  </span>
                </button>
              ))}

            {!loading && !error && events.length === 0 && (
              <div className="evidence-empty">
                <FileSearch size={24} />

                <strong>No events available</strong>

                <span>
                  No events are currently available from the BUSSENSE backend.
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="panel evidence-detail-card">
          {!selectedEvent && !loading && !error ? (
            <div className="evidence-empty detail-empty">
              <FileSearch size={28} />

              <strong>No event selected</strong>

              <span>Select an event to inspect its details.</span>
            </div>
          ) : (
            <>
              {selectedEvent && (
                <>
                  <div className="panel-header evidence-detail-header">
                    <div>
                      <span className="panel-label">EVENT RECORD</span>

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

                          <strong>
                            {selectedEvent.latitude}, {selectedEvent.longitude}
                          </strong>
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

                          <strong>{selectedEvent.schema}</strong>
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

                      {selectedEvent.evidence?.image_ref ? (
                        <>
                          <strong>Evidence Captured</strong>

                          <span>
                            Actual evidence image captured by Edge AI.
                          </span>

                          <img
                            src={getEvidenceUrl(
                              selectedEvent.evidence.image_ref,
                            )}
                            alt={`Evidence for ${selectedEvent.id}`}
                            style={{
                              width: "100%",
                              maxWidth: "720px",
                              maxHeight: "420px",
                              objectFit: "contain",
                              borderRadius: "10px",
                              marginTop: "12px",
                              border: "1px solid #dbe3ec",
                            }}
                          />

                          <small>{selectedEvent.evidence.image_ref}</small>
                        </>
                      ) : selectedEvent.evidence?.video_ref ? (
                        <>
                          <strong>Video Evidence Available</strong>

                          <span>
                            A video evidence reference is available for this
                            event.
                          </span>

                          <small>{selectedEvent.evidence.video_ref}</small>
                        </>
                      ) : (
                        <>
                          <strong>No Evidence Reference</strong>

                          <span>
                            No image or video evidence reference is available
                            for this event.
                          </span>

                          <small>BACKEND EVENT DATA</small>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="evidence-source-note">
                    <ShieldCheck size={16} />

                    <div>
                      <strong>Traceability</strong>

                      <p>
                        This record keeps the event, bus, device, location,
                        source and evidence relationship visible for operational
                        verification.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default EvidenceDetail;
