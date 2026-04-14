'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth/AuthContext';
import OutbreakPredictor from '@/components/dashboard/OutbreakPredictor';
import ResourcesPanel from '@/components/dashboard/ResourcesPanel';
import AuditLog from '@/components/dashboard/AuditLog';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { PromptModal } from '@/components/ui/Modal';
import {
  AlertTriangle,
  Activity,
  Droplets,
  Wifi,
  TrendingUp,
  MapPin,
  Clock,
  ChevronRight,
  Bell,
  RefreshCw,
  Megaphone,
  Download,
  Settings,
  BarChart3
} from 'lucide-react';

// Dynamic import for map
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="map-placeholder" style={{ height: 350 }}><div className="loading-spinner" /></div>
});

interface DashboardStats {
  newCases24h: number;
  waterIssues: number;
  criticalZones: number;
  syncRate: number;
  activeAlerts: number;
}

interface ReportData {
  id: string;
  villageName: string;
  symptoms: string[];
  severity: string;
  createdAt: string;
}

interface AlertData {
  id: string;
  title: string;
  location: string;
  severity: string;
  status: string;
}

interface VillageData {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  riskLevel: string;
  population: number;
}

export default function AdminDashboard() {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [villages, setVillages] = useState<VillageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, reportsRes, alertsRes, villagesRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/reports?limit=5'),
          fetch('/api/alerts'),
          fetch('/api/villages')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData.reports || []);
        }

        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData.alerts || []);
        }

        if (villagesRes.ok) {
          const villagesData = await villagesRes.json();
          setVillages(villagesData.villages || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleBroadcast = () => {
    setBroadcastModalOpen(true);
  };

  const handleBroadcastConfirm = (message: string) => {
    // In production, this would call an API to send notifications
    console.log('Broadcasting:', message);
    // Toast will be shown via ToastContext in the wrapper
  };

  const handleExportData = async () => {
    // In production, this would trigger a download
    try {
      // Simulate export
      const data = { reports, alerts, stats };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthconnect-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED');

  // Transform villages for map - ensure all required fields are present with valid values
  const mapVillages = villages
    .filter(v => v.latitude && v.longitude) // Only include villages with valid coordinates
    .map(v => ({
      name: v.name,
      district: v.district || 'Unknown',
      state: 'Northeast India',
      latitude: v.latitude,
      longitude: v.longitude,
      riskLevel: (v.riskLevel?.toLowerCase() || 'low') as 'low' | 'medium' | 'high' | 'critical',
      activeCases: 0,
      waterIssues: 0,
    }));

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">
            Smart Health Surveillance System • {user?.district || 'All Districts'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-icon" title="Refresh Data" onClick={() => window.location.reload()}>
            <RefreshCw size={18} />
          </button>
          {hasPermission('canExportData') && (
            <button onClick={handleExportData} className="btn btn-ghost" title="Export Data">
              <Download size={16} />
              Export
            </button>
          )}
          {hasPermission('canBroadcast') && (
            <button onClick={handleBroadcast} className="btn btn-warning">
              <Megaphone size={16} />
              Broadcast
            </button>
          )}
          <Link href="/admin/alerts" className="btn btn-danger">
            <Bell size={16} />
            Alerts ({activeAlerts.length})
          </Link>
        </div>
      </header>

      {/* Critical Alert Banner */}
      {activeAlerts.filter(a => a.severity === 'CRITICAL').length > 0 && (
        <div className="alert alert-critical" style={{ marginBottom: 'var(--space-6)' }}>
          <AlertTriangle size={20} />
          <div style={{ flex: 1 }}>
            <strong>Critical Alert:</strong> {activeAlerts.find(a => a.severity === 'CRITICAL')?.title}
            — {activeAlerts.find(a => a.severity === 'CRITICAL')?.location}
          </div>
          <Link href="/admin/alerts" className="btn btn-sm btn-danger">
            View Details
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card" style={{ '--stat-color': 'var(--primary-600)' } as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value">{stats?.newCases24h || 0}</div>
              <div className="stat-label">New Cases (24h)</div>
            </div>
            <Activity size={24} style={{ color: 'var(--primary-400)' }} />
          </div>
          <div className="stat-trend up">
            <TrendingUp size={14} />
            <span>From symptom reports</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--warning)' } as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value">{stats?.waterIssues || 0}</div>
              <div className="stat-label">Water Quality Issues</div>
            </div>
            <Droplets size={24} style={{ color: 'var(--warning)' }} />
          </div>
          <div className="stat-trend" style={{ color: 'var(--warning)' }}>
            <span>High/Critical risk sources</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--success)' } as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value">{stats?.syncRate || 0}%</div>
              <div className="stat-label">Sync Rate</div>
            </div>
            <Wifi size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
            <span className="status-dot online pulse" />
            <span style={{ color: 'var(--success)' }}>All systems operational</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--danger)' } as React.CSSProperties}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value">{stats?.criticalZones || 0}</div>
              <div className="stat-label">Critical Zones</div>
            </div>
            <MapPin size={24} style={{ color: 'var(--danger)' }} />
          </div>
          <Link href="/admin/map" style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--primary-600)',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            View on map →
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-3) var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            <Settings size={16} />
            Quick Actions:
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link href="/admin/analytics" className="btn btn-sm btn-ghost">
              <BarChart3 size={14} /> Analytics
            </Link>
            <Link href="/admin/reports" className="btn btn-sm btn-ghost">
              <Activity size={14} /> Reports
            </Link>
            <Link href="/admin/users" className="btn btn-sm btn-ghost">
              <Megaphone size={14} /> Users
            </Link>
            <Link href="/admin/map" className="btn btn-sm btn-primary">
              <MapPin size={14} /> GIS Map
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gap: 'var(--space-6)',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: 'var(--space-6)',
      }}>
        {/* Map */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Geographic Overview</h2>
            <Link href="/admin/map" className="btn btn-ghost btn-sm">
              Full Map <ChevronRight size={14} />
            </Link>
          </div>
          {mapVillages.length > 0 ? (
            <InteractiveMap
              villages={mapVillages}
              height="350px"
              showHeatmap
            />
          ) : (
            <div className="map-placeholder" style={{ height: 350 }}>
              No village data available
            </div>
          )}
        </div>

        {/* Outbreak Prediction */}
        <OutbreakPredictor />
      </div>

      {/* Second Row */}
      <div style={{
        display: 'grid',
        gap: 'var(--space-6)',
        gridTemplateColumns: '1fr 1fr 380px',
      }}>
        {/* Recent Reports */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Reports</h2>
            <Link href="/admin/reports" className="btn btn-ghost btn-sm">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {reports.length > 0 ? reports.map((report, index) => (
              <div
                key={report.id}
                style={{
                  padding: 'var(--space-3) 0',
                  borderBottom: index < reports.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-1)',
                }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {report.villageName}
                  </span>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}>
                    <Clock size={12} />
                    {getTimeAgo(report.createdAt)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--text-sm)',
                }}>
                  <span className={`badge badge-${report.severity === 'SEVERE' ? 'critical' : report.severity === 'MODERATE' ? 'medium' : 'low'}`}>
                    {report.severity}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {report.symptoms?.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No reports found
              </div>
            )}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Alerts</h2>
            <Link href="/admin/alerts" className="btn btn-ghost btn-sm">
              Manage <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {activeAlerts.length > 0 ? activeAlerts.slice(0, 4).map(alert => (
              <div
                key={alert.id}
                className={`alert alert-${alert.severity === 'CRITICAL' ? 'critical' : alert.severity === 'WARNING' ? 'warning' : 'info'}`}
                style={{ padding: 'var(--space-3)' }}
              >
                <AlertTriangle size={16} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{alert.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>{alert.location}</div>
                </div>
              </div>
            )) : (
              <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No active alerts
              </div>
            )}
          </div>
        </div>

        {/* Audit Log */}
        <AuditLog />
      </div>

      {/* Resources Panel */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <ResourcesPanel />
      </div>

      {/* Responsive styles */}
      <style jsx>{`
                @media (max-width: 1400px) {
                    div[style*="grid-template-columns: 1fr 1fr 380px"] {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

      {/* Broadcast Modal */}
      <PromptModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onConfirm={handleBroadcastConfirm}
        title="Broadcast Alert"
        message="Enter the message to broadcast to all health workers. This will send SMS and push notifications."
        placeholder="Enter alert message..."
        confirmText="Send Broadcast"
      />
    </div>
  );
}
