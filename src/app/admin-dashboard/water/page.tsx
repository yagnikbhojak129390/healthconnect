'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplets, MapPin, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface WaterTest {
    id: string;
    sourceName: string;
    sourceType: string;
    villageName: string;
    district: string;
    phLevel: number;
    turbidity: number;
    chlorineLevel: number;
    coliformPresent: boolean;
    riskLevel: string;
    createdAt: string;
}

export default function WaterQualityPage() {
    const [waterTests, setWaterTests] = useState<WaterTest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWaterTests() {
            try {
                const res = await fetch('/api/water-tests');
                if (res.ok) {
                    const data = await res.json();
                    setWaterTests(data.waterTests || []);
                }
            } catch (err) {
                console.error('Error fetching water tests:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchWaterTests();
    }, []);

    const getRiskBadge = (riskLevel: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            CRITICAL: { bg: 'var(--danger-light)', color: 'var(--danger)' },
            HIGH: { bg: 'var(--warning-light)', color: 'var(--warning)' },
            MEDIUM: { bg: 'var(--info-light)', color: 'var(--info)' },
            LOW: { bg: 'var(--success-light)', color: 'var(--success)' },
        };
        const style = styles[riskLevel] || styles.LOW;
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                background: style.bg,
                color: style.color,
            }}>
                {riskLevel}
            </span>
        );
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
                <style jsx>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Count by risk level
    const criticalCount = waterTests.filter(w => w.riskLevel === 'CRITICAL').length;
    const highCount = waterTests.filter(w => w.riskLevel === 'HIGH').length;
    const mediumCount = waterTests.filter(w => w.riskLevel === 'MEDIUM').length;
    const lowCount = waterTests.filter(w => w.riskLevel === 'LOW').length;

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
                    <h1 className="page-title">Water Quality Monitoring</h1>
                    <p className="page-subtitle">
                        {waterTests.length} water sources tested across all districts
                    </p>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card" style={{ '--stat-color': 'var(--danger)' } as React.CSSProperties}>
                    <div className="stat-value">{criticalCount}</div>
                    <div className="stat-label">Critical</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--warning)' } as React.CSSProperties}>
                    <div className="stat-value">{highCount}</div>
                    <div className="stat-label">High Risk</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--info)' } as React.CSSProperties}>
                    <div className="stat-value">{mediumCount}</div>
                    <div className="stat-label">Medium Risk</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--success)' } as React.CSSProperties}>
                    <div className="stat-value">{lowCount}</div>
                    <div className="stat-label">Safe</div>
                </div>
            </div>

            {/* Water Tests Table */}
            <div className="card" style={{ padding: 0 }}>
                {waterTests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                        <Droplets size={48} style={{ opacity: 0.5, marginBottom: 'var(--space-4)' }} />
                        <h3>No Water Tests Yet</h3>
                        <p>Water quality tests will appear here once health workers submit them.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Location</th>
                                    <th>pH Level</th>
                                    <th>Turbidity</th>
                                    <th>Coliform</th>
                                    <th>Risk Level</th>
                                    <th>Tested</th>
                                </tr>
                            </thead>
                            <tbody>
                                {waterTests.map(test => (
                                    <tr key={test.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{test.sourceName}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                                {test.sourceType?.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                                                <span>{test.villageName}</span>
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                                {test.district}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 600,
                                                color: test.phLevel < 6.5 || test.phLevel > 8.5 ? 'var(--warning)' : 'var(--success)'
                                            }}>
                                                {test.phLevel?.toFixed(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: 600,
                                                color: test.turbidity > 4 ? 'var(--warning)' : 'var(--success)'
                                            }}>
                                                {test.turbidity?.toFixed(1)} NTU
                                            </span>
                                        </td>
                                        <td>
                                            {test.coliformPresent ? (
                                                <span className="badge badge-critical">
                                                    <AlertTriangle size={12} />
                                                    Present
                                                </span>
                                            ) : (
                                                <span className="badge badge-success">
                                                    <CheckCircle size={12} />
                                                    Absent
                                                </span>
                                            )}
                                        </td>
                                        <td>{getRiskBadge(test.riskLevel)}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                                <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                                                {getTimeAgo(test.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
