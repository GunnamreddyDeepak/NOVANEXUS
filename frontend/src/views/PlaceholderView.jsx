const viewContent = {
  overview: {
    title: 'Control Tower Overview',
    description: 'Central view for urban mobility intelligence.',
  },
  fleet: {
    title: 'Live Fleet',
    description: 'Bus and fleet status will appear here.',
  },
  incidents: {
    title: 'Incident Centre',
    description: 'Detected and confirmed incidents will appear here.',
  },
  map: {
    title: 'GIS / Map',
    description: 'Bus, event, hazard and road locations will appear here.',
  },
  analytics: {
    title: 'Analytics',
    description: 'Traffic, road and fleet analytics will appear here.',
  },
  evidence: {
    title: 'Evidence & Detail',
    description: 'Event evidence and detailed information will appear here.',
  },
}

function PlaceholderView({ activeView }) {
  const content = viewContent[activeView] || viewContent.overview

  return (
    <div className="placeholder-view">
      <div className="placeholder-header">
        <span className="placeholder-label">STATIC PLACEHOLDER</span>
        <h3>{content.title}</h3>
        <p>{content.description}</p>
      </div>

      <div className="placeholder-grid">
        <div className="placeholder-card">
          <span>STATUS</span>
          <strong>Waiting for integration</strong>
        </div>

        <div className="placeholder-card">
          <span>DATA</span>
          <strong>No live data</strong>
        </div>

        <div className="placeholder-card">
          <span>MODULE</span>
          <strong>Frontend + GIS</strong>
        </div>
      </div>

      <div className="integration-note">
        <strong>Shell placeholder</strong>
        <p>
          Backend API, database, real-time data, GIS layers and production
          visualizations will be integrated in later phases.
        </p>
      </div>
    </div>
  )
}

export default PlaceholderView