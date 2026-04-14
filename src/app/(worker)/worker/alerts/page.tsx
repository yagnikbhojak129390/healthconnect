'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Bell, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    createdAt: string;
    location: string;
    read: boolean;
}

export default function WorkerAlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const res = await fetch('/api/alerts');
                if (res.ok) {
                    const data = await res.json();
                    setAlerts((data.alerts || []).map((a: any) => ({
                        ...a,
                        severity: a.severity?.toLowerCase() || 'info',
                        read: false,
                    })));
                }
            } catch (err) {
                console.error('Error fetching alerts:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAlerts();
    }, []);

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'critical':
                return { bg: 'var(--danger-light)', color: 'var(--danger)', icon: AlertTriangle };
            case 'warning':
                return { bg: 'var(--warning-light)', color: 'var(--warning)', icon: AlertTriangle };
            default:
                return { bg: 'var(--info-light)', color: 'var(--info)', icon: Info };
        }
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
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            paddingBottom: 'var(--space-8)',
        }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, var(--danger) 0%, #b91c1c 100%)',
                padding: 'var(--space-4)',
                color: 'white',
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Link href="/worker" style={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-3)',
                    }}>
                        <ChevronLeft size={18} />
                        Back to Dashboard
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Health Alerts</h1>
                            <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>
                                {alerts.length} alerts in your area
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Alerts List */}
            <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-4)' }}>
                {alerts.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                        <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 'var(--space-4)' }} />
                        <h3>All Clear!</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>No active alerts in your area</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {alerts.map(alert => {
                            const style = getSeverityStyle(alert.severity);
                            const Icon = style.icon;
                            return (
                                <div
                                    key={alert.id}
                                    className="card"
                                    style={{
                                        borderLeft: `4px solid ${style.color}`,
                                        background: style.bg,
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            background: style.color,
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={20} style={{ color: 'white' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3 style={{ margin: 0, fontWeight: 600, color: 'var(--gray-800)' }}>
                                                    {alert.title}
                                                </h3>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    background: style.color,
                                                    color: 'white',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p style={{ margin: 'var(--space-2) 0', fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}>
                                                {alert.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--gray-600)' }}>
                                                <span>📍 {alert.location}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={12} />
                                                    {getTimeAgo(alert.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
