'use client';

import { useState, useEffect } from 'react';
import { Clock, User, Activity, Shield, FileText, AlertTriangle, Users, Settings, Loader2 } from 'lucide-react';

interface AuditEntry {
    id: string;
    action: string;
    user: string;
    role: string;
    timestamp: Date;
    type: 'user' | 'report' | 'alert' | 'system' | 'settings';
    details?: string;
}

export default function AuditLog() {
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAuditData() {
            try {
                // Fetch recent reports, alerts, and users to build audit trail
                const [reportsRes, alertsRes, usersRes] = await Promise.all([
                    fetch('/api/reports?limit=5'),
                    fetch('/api/alerts'),
                    fetch('/api/users'),
                ]);

                const logs: AuditEntry[] = [];

                if (reportsRes.ok) {
                    const data = await reportsRes.json();
                    (data.reports || []).slice(0, 3).forEach((report: any) => {
                        logs.push({
                            id: `report-${report.id}`,
                            action: 'Symptom report submitted',
                            user: report.reporter?.name || 'Health Worker',
                            role: 'Health Worker',
                            timestamp: new Date(report.createdAt),
                            type: 'report',
                            details: `${report.severity} case in ${report.villageName || 'Unknown location'}`,
                        });
                    });
                }

                if (alertsRes.ok) {
                    const data = await alertsRes.json();
                    (data.alerts || []).slice(0, 2).forEach((alert: any) => {
                        logs.push({
                            id: `alert-${alert.id}`,
                            action: alert.status === 'RESOLVED' ? 'Alert resolved' : 'Alert created',
                            user: 'System',
                            role: 'System',
                            timestamp: new Date(alert.updatedAt || alert.createdAt),
                            type: 'alert',
                            details: alert.title,
                        });
                    });
                }

                if (usersRes.ok) {
                    const data = await usersRes.json();
                    const recentUsers = (data.users || [])
                        .filter((u: any) => u.lastLogin)
                        .sort((a: any, b: any) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
                        .slice(0, 2);

                    recentUsers.forEach((user: any) => {
                        logs.push({
                            id: `login-${user.id}`,
                            action: 'User logged in',
                            user: user.name,
                            role: user.role === 'ADMIN' ? 'Admin' : 'Health Worker',
                            timestamp: new Date(user.lastLogin),
                            type: 'user',
                        });
                    });
                }

                // Sort by timestamp
                logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                setAuditLogs(logs.slice(0, 6));
            } catch (err) {
                console.error('Error fetching audit data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAuditData();
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'user': return <Users size={14} />;
            case 'report': return <FileText size={14} />;
            case 'alert': return <AlertTriangle size={14} />;
            case 'settings': return <Settings size={14} />;
            default: return <Activity size={14} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'user': return { bg: 'var(--primary-100)', color: 'var(--primary-600)' };
            case 'report': return { bg: 'var(--info-light)', color: 'var(--info)' };
            case 'alert': return { bg: 'var(--warning-light)', color: 'var(--warning)' };
            case 'settings': return { bg: 'var(--gray-200)', color: 'var(--gray-600)' };
            default: return { bg: 'var(--success-light)', color: 'var(--success)' };
        }
    };

    const getTimeAgo = (date: Date) => {
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
                </div>
                <style jsx>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, var(--gray-600) 0%, var(--gray-800) 100%)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Shield size={20} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h2 className="card-title" style={{ margin: 0 }}>Activity Log</h2>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            Recent system activities
                        </div>
                    </div>
                </div>
            </div>

            {auditLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                    No recent activity to display.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {auditLogs.map((entry, index) => {
                        const typeStyle = getTypeColor(entry.type);
                        return (
                            <div
                                key={entry.id}
                                style={{
                                    display: 'flex',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) 0',
                                    borderBottom: index < auditLogs.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                }}
                            >
                                {/* Type Icon */}
                                <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 'var(--radius-md)',
                                    background: typeStyle.bg,
                                    color: typeStyle.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {getTypeIcon(entry.type)}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 500,
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--gray-800)',
                                    }}>
                                        {entry.action}
                                    </div>
                                    {entry.details && (
                                        <div style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-secondary)',
                                            marginTop: 2,
                                        }}>
                                            {entry.details}
                                        </div>
                                    )}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        marginTop: 'var(--space-1)',
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <User size={10} />
                                            {entry.user}
                                        </span>
                                        <span>•</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Clock size={10} />
                                            {getTimeAgo(entry.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
