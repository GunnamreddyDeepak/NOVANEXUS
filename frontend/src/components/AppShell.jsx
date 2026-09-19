import { useState } from 'react'
import {
  Menu,
  X,
  LayoutDashboard,
  Bus,
  AlertTriangle,
  Map,
  BarChart3,
  FileSearch,
} from 'lucide-react'

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'fleet', label: 'Live Fleet', icon: Bus },
  { id: 'incidents', label: 'Incident Centre', icon: AlertTriangle },
  { id: 'map', label: 'GIS / Map', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'evidence', label: 'Evidence & Detail', icon: FileSearch },
]

function AppShell({ activeView, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (view) => {
    onNavigate(view)
    setMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">B</div>
          <div>
            <h1>BUSSENSE</h1>
            <span>Urban Intelligence</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activeView === item.id ? 'active' : ''
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <span>FRONTEND + GIS</span>
          <small>Control Tower</small>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="eyebrow">BUSSENSE V2</p>
            <h2>Urban Control Tower</h2>
          </div>

          <div className="system-status">
            <span className="status-dot" />
            <span>System Shell</span>
          </div>
        </header>

        <section className="page-content">{children}</section>
      </main>
    </div>
  )
}

export default AppShell