'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { mockVillages, VillageData, RiskLevel } from '@/lib/data/mockData';
import {
    Layers,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Filter,
    Info,
    MapPin,
    AlertTriangle,
    Droplets,
    X
} from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
    ssr: false,
    loading: () => <div className="map-placeholder" style={{ height: '100%' }}><div className="loading-spinner" /></div>
});

export default function MapPage() {
    const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);
    const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
    const [showHeatmap, setShowHeatmap] = useState(true);

    const filteredVillages = riskFilter === 'all'
        ? mockVillages
        : mockVillages.filter(v => v.riskLevel === riskFilter);

    const handleVillageClick = (village: VillageData) => {
        setSelectedVillage(village);
    };

    const getRiskColor = (level: RiskLevel) => {
        const colors: Record<RiskLevel, string> = {
            critical: 'var(--danger)',
            high: 'var(--risk-high)',
            medium: 'var(--warning)',
            low: 'var(--success)',
        };
        return colors[level];
    };

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-4) 0',
                flexShrink: 0,
            }}>
                <div>
                    <h1 className="page-title">GIS Command Center</h1>
                    <p className="page-subtitle">
                        Interactive map of all monitored regions • {filteredVillages.length} locations
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setShowHeatmap(!showHeatmap)}
                    >
                        <Layers size={14} />
                        Heatmap
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: selectedVillage ? '1fr 350px' : '1fr',
                gap: 'var(--space-4)',
                minHeight: 0,
            }}>
                {/* Map */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {/* Map Toolbar */}
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Risk Level:</span>
                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setRiskFilter(level)}
                                        className={`btn btn-sm ${riskFilter === level ? 'btn-primary' : 'btn-ghost'}`}
                                        style={{
                                            textTransform: 'capitalize',
                                            padding: '4px 12px',
                                        }}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            {(['critical', 'high', 'medium', 'low'] as RiskLevel[]).map(level => (
                                <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <span style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        background: getRiskColor(level),
                                    }} />
                                    <span style={{ fontSize: 'var(--text-xs)', textTransform: 'capitalize' }}>{level}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Container */}
                    <div style={{ flex: 1 }}>
                        <InteractiveMap
                            villages={filteredVillages}
                            height="100%"
                            showHeatmap={showHeatmap}
                            onVillageClick={handleVillageClick}
                        />
                    </div>
                </div>

                {/* Side Panel */}
                {selectedVillage && (
                    <div className="card animate-slide-up" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 'var(--space-4)',
                        }}>
                            <div>
                                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                                    {selectedVillage.name}
                                </h2>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    {selectedVillage.district}, {selectedVillage.state}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVillage(null)}
                                className="btn btn-icon btn-ghost btn-sm"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Risk Badge */}
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <span
                                className={`badge badge-${selectedVillage.riskLevel}`}
                                style={{ fontSize: 'var(--text-sm)', padding: '6px 12px' }}
                            >
                                {selectedVillage.riskLevel.toUpperCase()} RISK ZONE
                            </span>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}>
                                <AlertTriangle size={20} style={{ color: 'var(--danger)', marginBottom: 'var(--space-1)' }} />
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{selectedVillage.activeCases}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Active Cases</div>
                            </div>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                            }}>
                                <Droplets size={20} style={{ color: 'var(--warning)', marginBottom: 'var(--space-1)' }} />
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{selectedVillage.waterIssues}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Water Issues</div>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                <MapPin size={14} style={{ display: 'inline', marginRight: 'var(--space-1)' }} />
                                Coordinates
                            </h3>
                            <div style={{
                                padding: 'var(--space-3)',
                                background: 'var(--gray-50)',
                                borderRadius: 'var(--radius-md)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--text-sm)',
                            }}>
                                {selectedVillage.latitude.toFixed(6)}° N, {selectedVillage.longitude.toFixed(6)}° E
                            </div>
                        </div>

                        {/* Last Report */}
                        {selectedVillage.lastReportAt && (
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                    Last Report
                                </h3>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    {new Date(selectedVillage.lastReportAt).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <Link href={`/admin/reports?village=${selectedVillage.name}`} className="btn btn-primary">
                                View Reports
                            </Link>
                            <Link href={`/admin/alerts?location=${selectedVillage.name}`} className="btn btn-ghost">
                                Check Alerts
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
