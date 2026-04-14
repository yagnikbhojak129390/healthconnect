'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Droplets, AlertTriangle, MapPin, Loader2 } from 'lucide-react';

const COLORS = {
    primary: '#14b8a6',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#22c55e',
    info: '#3b82f6',
    purple: '#8b5cf6',
};

const RISK_COLORS = ['#dc2626', '#ea580c', '#d97706', '#16a34a'];
const DISEASE_COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#6b7280'];

interface AnalyticsData {
    summary: {
        totalReports: number;
        severeReports: number;
        waterIssues: number;
        criticalZones: number;
        reportsLast24h: number;
    };
    weeklyTrend: { name: string; cases: number; waterIssues: number; resolved: number }[];
    diseaseDistribution: { name: string; value: number }[];
    riskDistribution: { name: string; value: number }[];
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch('/api/analytics');
                if (res.ok) {
                    const analyticsData = await res.json();
                    setData({
                        summary: analyticsData.summary || {},
                        weeklyTrend: analyticsData.weeklyTrend || [],
                        diseaseDistribution: analyticsData.diseaseDistribution || [],
                        riskDistribution: analyticsData.riskDistribution || [],
                    });
                }
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

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

    const totalCases = data?.summary?.totalReports || 0;
    const severeCases = data?.summary?.severeReports || 0;
    const waterIssues = data?.summary?.waterIssues || 0;
    const criticalZones = data?.summary?.criticalZones || 0;
    const trendData = data?.weeklyTrend || [];
    const diseaseData = data?.diseaseDistribution || [];
    const riskData = data?.riskDistribution || [];

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
                    <h1 className="page-title">Analytics & Trends</h1>
                    <p className="page-subtitle">
                        Disease surveillance insights and trend analysis (Real-time data)
                    </p>
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card" style={{ '--stat-color': 'var(--primary-600)' } as React.CSSProperties}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{totalCases}</div>
                            <div className="stat-label">Total Reports</div>
                        </div>
                        <Activity size={24} style={{ color: 'var(--primary-400)' }} />
                    </div>
                    <div className="stat-trend" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        From database
                    </div>
                </div>

                <div className="stat-card" style={{ '--stat-color': 'var(--danger)' } as React.CSSProperties}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{severeCases}</div>
                            <div className="stat-label">Severe Cases</div>
                        </div>
                        <AlertTriangle size={24} style={{ color: 'var(--danger)' }} />
                    </div>
                </div>

                <div className="stat-card" style={{ '--stat-color': 'var(--warning)' } as React.CSSProperties}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{waterIssues}</div>
                            <div className="stat-label">Water Issues</div>
                        </div>
                        <Droplets size={24} style={{ color: 'var(--warning)' }} />
                    </div>
                </div>

                <div className="stat-card" style={{ '--stat-color': 'var(--danger)' } as React.CSSProperties}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-value">{criticalZones}</div>
                            <div className="stat-label">Critical Zones</div>
                        </div>
                        <MapPin size={24} style={{ color: 'var(--danger)' }} />
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                {/* Weekly Trend */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                        Weekly Disease Trend
                    </h2>
                    {trendData.length > 0 ? (
                        <>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="cases"
                                            stroke={COLORS.primary}
                                            fillOpacity={1}
                                            fill="url(#colorCases)"
                                            strokeWidth={2}
                                        />
                                        <Line type="monotone" dataKey="resolved" stroke={COLORS.success} strokeWidth={2} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span style={{ width: 12, height: 3, background: COLORS.primary, borderRadius: 2 }} />
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>New Cases</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span style={{ width: 12, height: 3, background: COLORS.success, borderRadius: 2 }} />
                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Resolved</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            No trend data available. Submit reports to see trends.
                        </div>
                    )}
                </div>

                {/* Disease Distribution */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                        Disease Distribution
                    </h2>
                    {diseaseData.filter(d => d.value > 0).length > 0 ? (
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={diseaseData.filter(d => d.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {diseaseData.filter(d => d.value > 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DISEASE_COLORS[index % DISEASE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            No disease data available.
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Risk Zone Distribution */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                        Risk Zone Distribution
                    </h2>
                    {riskData.filter(d => d.value > 0).length > 0 ? (
                        <div style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={riskData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                            No risk zone data available.
                        </div>
                    )}
                </div>

                {/* Water Quality Overview */}
                <div className="card">
                    <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                        Data Summary
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{
                            padding: 'var(--space-4)',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--primary-500)',
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Reports Submitted</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary-600)' }}>
                                {totalCases}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                Total symptom reports in database
                            </div>
                        </div>
                        <div style={{
                            padding: 'var(--space-4)',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--warning)',
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Water Tests</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--warning)' }}>
                                {waterIssues}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                Sources with quality issues
                            </div>
                        </div>
                        <div style={{
                            padding: 'var(--space-4)',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--success)',
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Last 24 Hours</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--success)' }}>
                                {data?.summary?.reportsLast24h || 0}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                New reports today
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
