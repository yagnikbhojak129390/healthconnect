'use client';

import { useState, useEffect } from 'react';
import { Package, Users, MapPin, AlertCircle, DollarSign, Loader2, CheckCircle } from 'lucide-react';

interface WorkerStats {
    totalWorkers: number;
    activeWorkers: number;
}

export default function ResourcesPanel() {
    const [workerStats, setWorkerStats] = useState<WorkerStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    const workers = (data.users || []).filter((u: any) =>
                        u.role?.toLowerCase() === 'health_worker'
                    );
                    const recentlyActive = workers.filter((u: any) => {
                        if (!u.lastLogin) return false;
                        const lastLogin = new Date(u.lastLogin);
                        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                        return lastLogin > dayAgo;
                    });

                    setWorkerStats({
                        totalWorkers: workers.length,
                        activeWorkers: recentlyActive.length,
                    });
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'critical': return 'var(--danger)';
            case 'warning': return 'var(--warning)';
            default: return 'var(--success)';
        }
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
                        background: 'linear-gradient(135deg, var(--success) 0%, #16a34a 100%)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Package size={20} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h2 className="card-title" style={{ margin: 0 }}>System Overview</h2>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            Personnel & Coverage
                        </div>
                    </div>
                </div>
            </div>

            {/* Personnel Status */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--gray-600)',
                }}>
                    <Users size={16} />
                    Field Personnel
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{
                        padding: 'var(--space-3)',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                    }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'var(--success)',
                        }} />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--space-1)',
                            }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                                    Health Workers
                                </span>
                                <span style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    color: 'var(--success)',
                                }}>
                                    {workerStats?.activeWorkers || 0}/{workerStats?.totalWorkers || 0} active
                                </span>
                            </div>
                            <div style={{
                                height: 4,
                                background: 'var(--gray-200)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: workerStats?.totalWorkers
                                        ? `${(workerStats.activeWorkers / workerStats.totalWorkers) * 100}%`
                                        : '0%',
                                    background: 'var(--success)',
                                    borderRadius: 'var(--radius-full)',
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div style={{
                padding: 'var(--space-4)',
                background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-3)',
                }}>
                    <CheckCircle size={18} style={{ color: 'var(--primary-600)' }} />
                    <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>System Status</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>Data Sync</div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--success)' }}>
                            Online
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>API Status</div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--success)' }}>
                            Healthy
                        </div>
                    </div>
                </div>
            </div>

            {/* Coverage Info */}
            <div style={{
                padding: 'var(--space-3)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
            }}>
                <MapPin size={16} style={{ color: 'var(--primary-600)' }} />
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                    Covering multiple districts across Northeast India
                </div>
            </div>
        </div>
    );
}
