import React from 'react';
import { bots, revenueStreams } from './data/mockData.js';

function ProgressBar({ value }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="progress" aria-valuenow={width} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-filled" style={{ width: `${width}%` }} />
    </div>
  );
}

function DashboardCard({ title, children }) {
  return (
    <section className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">{children}</div>
    </section>
  );
}

// Theme toggle: lightweight, stores preference in localStorage and applies via data-theme on root
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button aria-label="Toggle color theme" className="theme-toggle" onClick={onToggle}>
      {isDark ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}

export default function App() {
  const totalRevenue = revenueStreams.reduce((acc, r) => acc + r.amount, 0);

  // simple last-6-month bars for a tiny chart
  const monthlyRevenue = [1200, 1650, 980, 2100, 2750, 1900];
  const maxMonth = Math.max(...monthlyRevenue, 1);

  // Theme state and effects
  const [theme, setTheme] = React.useState('dark');

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved || (systemDark ? 'dark' : 'light');
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Moltbot Dashboard Studio</h1>
            <p>Dashboard for Moltbot creation and revenue stream activity with mock data</p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>
      <main className="grid">
        <DashboardCard title="Moltbot Creation Dashboard">
          <table className="table" aria-label="moltbot table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Campaigns</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((b) => (
                <tr key={b.id}>
                  <td className="name">{b.name}</td>
                  <td>{b.created}</td>
                  <td>
                    <ProgressBar value={b.progress} />
                  </td>
                  <td>{b.status}</td>
                  <td>{b.campaigns}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <button className="btn">Create New Moltbot</button>
            <span className="hint">Mock data, no backend connected</span>
          </div>
        </DashboardCard>
        <DashboardCard title="Revenue Stream Activity">
          <div className="revenue">
            <div className="summary">
              <div className="metric">
                <span className="muted">Total Revenue</span>
                <div className="value">${totalRevenue.toLocaleString()}</div>
              </div>
              <div className="metric">
                <span className="muted">Active Streams</span>
                <div className="value">{revenueStreams.length}</div>
              </div>
            </div>
            <div className="chart" aria-label="monthly revenue chart">
              {monthlyRevenue.map((v, i) => {
                const h = Math.round((v / maxMonth) * 120) + 8; // min height for visibility
                return (
                  <div key={i} className="bar" style={{ height: `${h}px` }} title={`Month ${i + 1}: $${v}`} />
                );
              })}
            </div>
          </div>
          <table className="table small" aria-label="revenue streams table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Platform</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {revenueStreams.map((r) => (
                <tr key={r.id}>
                  <td className="name">{r.name}</td>
                  <td>{r.platform}</td>
                  <td>{r.date}</td>
                  <td>${r.amount.toLocaleString()}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>
      </main>
    </div>
  );
}
