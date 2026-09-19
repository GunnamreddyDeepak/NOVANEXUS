import { useState } from 'react'
import './App.css'
import AppShell from './components/AppShell'
import PlaceholderView from './views/PlaceholderView'

function App() {
  const [activeView, setActiveView] = useState('overview')

  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
    >
      <PlaceholderView activeView={activeView} />
    </AppShell>
  )
}

export default App