import { useState } from 'react'
import './App.css'
import AppShell from './components/AppShell'
import Overview from './views/Overview'
import LiveFleet from './views/LiveFleet'
import IncidentCentre from './views/IncidentCentre'
import GISMap from './views/GISMap'
import EvidenceDetail from './views/EvidenceDetail'
import TrafficAnalytics from './views/TrafficAnalytics'
import RoadIntelligence from './views/RoadIntelligence'
import FleetAnalytics from './views/FleetAnalytics'
import PlaceholderView from './views/PlaceholderView'

function App() {
  const [activeView, setActiveView] = useState('overview')

const renderView = () => {
  if (activeView === 'overview') {
    return <Overview />
  }

  if (activeView === 'fleet') {
    return <LiveFleet />
  }

  if (activeView === 'incidents') {
    return <IncidentCentre />
  }

  if (activeView === 'map') {
    return <GISMap />
  }

  if (activeView === 'analytics') {
    return <TrafficAnalytics />
  }
  if (activeView === 'road-intelligence') {
  return <RoadIntelligence />
  }
  if (activeView === 'fleet-analytics') {
  return <FleetAnalytics />
  }

  if (activeView === 'evidence') {
    return <EvidenceDetail />
  }

  return <PlaceholderView activeView={activeView} />
}
  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
    >
      {renderView()}
    </AppShell>
  )
}

export default App