'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { PromptModal } from '@/components/ui/Modal';
import {
    AlertTriangle,
    CheckCircle,
    Eye,
    MessageSquare,
    Filter,
    Megaphone,
    Clock,
    MapPin,
    Users
} from 'lucide-react';

type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'active' | 'acknowledged' | 'investigating' | 'resolved';

interface Alert {
    id: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    location: string;
    district: string;
    status: AlertStatus;
    createdAt: string;
    caseCount?: number;
}

export default function AlertsPage() {
    const { hasPermission } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState<AlertSeverity | 'all'>('all');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch('/api/alerts');
                if (res.ok) {
                    const data = await res.json();
                    setAlerts(data.alerts?.map((a: any) => ({
                        ...a,
                        severity: a.severity?.toLowerCase() || 'info',
                        status: a.status?.toLowerCase() || 'active',
                    })) || []);
                }
            } catch (err) {
                console.error('Error fetching alerts:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, []);

    const filteredAlerts = selectedFilter === 'all'
        ? alerts
        : alerts.filter(a => a.severity === selectedFilter);

    const handleAcknowledge = async (alertId: string) => {
        try {
            await fetch(`/api/alerts/${alertId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ACKNOWLEDGED' })
            });
            setAlerts(prev => prev.map(a =>
                a.id === alertId ? { ...a, status: 'acknowledged' } : a
            ));
        } catch (err) {
            console.error('Error acknowledging alert:', err);
        }
    };

    const handleResolve = async (alertId: string) => {
        try {
            await fetch(`/api/alerts/${alertId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'RESOLVED' })
            });
            setAlerts(prev => prev.map(a =>
                a.id === alertId ? { ...a, status: 'resolved' } : a
            ));
        } catch (err) {
            console.error('Error resolving alert:', err);
        }
    };

    const handleBroadcast = () => {
        setBroadcastModalOpen(true);
    };

    const handleBroadcastConfirm = (message: string) => {
        console.log('Broadcasting:', message);
        // In production, call an API to send SMS/push notifications
    };

    const getSeverityIcon = (severity: AlertSeverity) => {
        switch (severity) {
            case 'critical': return <AlertTriangle size={16} />;
            case 'warning': return <AlertTriangle size={16} />;
            case 'info': return <Eye size={16} />;
        }
    };

    const getStatusBadge = (status: AlertStatus) => {
        const styles: Record<string, { bg: string; color: string; label: string }> = {
            active: { bg: 'var(--danger-light)', color: 'var(--danger)', label: 'Active' },
            acknowledged: { bg: 'var(--warning-light)', color: 'var(--warning)', label: 'Acknowledged' },
            investigating: { bg: 'var(--info-light)', color: 'var(--info)', label: 'Investigating' },
            resolved: { bg: 'var(--success-light)', color: 'var(--success)', label: 'Resolved' },
        };
        const style = styles[status];
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                background: style.bg,
                color: style.color,
            }}>
                {style.label}
            </span>
        );
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

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
                    <Link href="/admin" style={{
                        color: 'var(--primary-600)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        display: 'block',
                        marginBottom: 'var(--space-2)',
                    }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 className="page-title">Alert Management</h1>
                    <p className="page-subtitle">
                        {alerts.filter(a => a.status === 'active').length} active alerts requiring attention
                    </p>
                </div>
                {hasPermission('canBroadcast') && (
                    <button onClick={handleBroadcast} className="btn btn-danger">
                        <Megaphone size={16} />
                        Broadcast Alert
                    </button>
                )}
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: 'var(--danger)' },
                    { label: 'Warning', count: alerts.filter(a => a.severity === 'warning').length, color: 'var(--warning)' },
                    { label: 'Active', count: alerts.filter(a => a.status === 'active').length, color: 'var(--info)' },
                    { label: 'Resolved', count: alerts.filter(a => a.status === 'resolved').length, color: 'var(--success)' },
                ].map(stat => (
                    <div key={stat.label} className="stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
                        <div className="stat-value">{stat.count}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Filter size={18} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Filter by severity:</span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['all', 'critical', 'warning', 'info'] as const).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`btn btn-sm ${selectedFilter === filter ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Severity</th>
                                <th>Alert</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map(alert => (
                                <tr key={alert.id}>
                                    <td>
                                        <span className={`badge badge-${alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
                                            {getSeverityIcon(alert.severity)}
                                            <span style={{ marginLeft: 4, textTransform: 'capitalize' }}>{alert.severity}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{alert.title}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                            {alert.description}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            <span>{alert.location}</span>
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                            {alert.district}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(alert.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            <span style={{ fontSize: 'var(--text-sm)' }}>{getTimeAgo(alert.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            {alert.status === 'active' && (
                                                <button
                                                    onClick={() => handleAcknowledge(alert.id)}
                                                    className="btn btn-sm btn-ghost"
                                                    title="Acknowledge"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            )}
                                            {alert.status !== 'resolved' && hasPermission('canResolveAlerts') && (
                                                <button
                                                    onClick={() => handleResolve(alert.id)}
                                                    className="btn btn-sm btn-success"
                                                    title="Resolve"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Broadcast Modal */}
            <PromptModal
                isOpen={broadcastModalOpen}
                onClose={() => setBroadcastModalOpen(false)}
                onConfirm={handleBroadcastConfirm}
                title="Broadcast Alert"
                message="Enter the message to broadcast to all field workers."
                placeholder="Enter alert message..."
                confirmText="Send Broadcast"
            />
        </div>
    );
}
