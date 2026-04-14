'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getCurrentPosition, formatCoordinates, getNearestVillage, GPSCoordinates } from '@/lib/gps';
import {
    ChevronLeft,
    Droplets,
    MapPin,
    Send,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Navigation
} from 'lucide-react';

const TURBIDITY_OPTIONS = [
    { value: 'CLEAR', label: 'Clear', color: 'var(--success)', desc: 'Transparent, no particles' },
    { value: 'CLOUDY', label: 'Cloudy', color: 'var(--warning)', desc: 'Slightly opaque' },
    { value: 'MUDDY', label: 'Muddy', color: 'var(--danger)', desc: 'Very opaque, particles visible' },
];

const SOURCE_TYPES = [
    { value: 'PUMP', label: 'Hand Pump', icon: '🚰' },
    { value: 'WELL', label: 'Well', icon: '🕳️' },
    { value: 'RIVER', label: 'River/Stream', icon: '🌊' },
    { value: 'TANK', label: 'Tank/Reservoir', icon: '🏗️' },
];

export default function WorkerWaterTestPage() {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [location, setLocation] = useState<GPSCoordinates | null>(null);
    const [nearestVillage, setNearestVillage] = useState<string | null>(null);

    // Form state
    const [sourceName, setSourceName] = useState('');
    const [sourceType, setSourceType] = useState('PUMP');
    const [phLevel, setPhLevel] = useState('');
    const [turbidity, setTurbidity] = useState('CLEAR');
    const [chlorineLevel, setChlorineLevel] = useState('');
    const [hasColiform, setHasColiform] = useState<boolean | null>(null);
    const [notes, setNotes] = useState('');

    const handleGetLocation = async () => {
        setGpsLoading(true);
        try {
            const coords = await getCurrentPosition();
            setLocation(coords);
            const { village, distance } = getNearestVillage(coords);
            setNearestVillage(`${village.name} (${distance.toFixed(1)} km)`);
        } catch (error) {
            console.error('GPS error:', error);
        } finally {
            setGpsLoading(false);
        }
    };

    const getRiskLevel = () => {
        const ph = parseFloat(phLevel);
        if (!ph) return null;

        if (ph < 6 || ph > 8.5 || turbidity === 'MUDDY' || hasColiform) {
            return { level: 'CRITICAL', color: 'var(--danger)', label: 'Critical Risk' };
        }
        if (ph < 6.5 || ph > 8 || turbidity === 'CLOUDY') {
            return { level: 'HIGH', color: 'var(--warning)', label: 'Moderate Risk' };
        }
        return { level: 'LOW', color: 'var(--success)', label: 'Safe' };
    };

    const risk = getRiskLevel();
    const { village } = location ? getNearestVillage(location) : { village: null };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const report = {
            sourceName,
            sourceType,
            latitude: location?.latitude,
            longitude: location?.longitude,
            district: village?.district || user?.district || '',
            villageName: village?.name || nearestVillage || '',
            phLevel: parseFloat(phLevel),
            turbidity: TURBIDITY_OPTIONS.findIndex(t => t.value === turbidity),
            chlorine: chlorineLevel ? parseFloat(chlorineLevel) : null,
            coliforms: hasColiform || false,
            riskLevel: risk?.level || 'LOW',
            notes,
            reporterId: user?.id,
        };

        try {
            const res = await fetch('/api/water-tests', {
                method: 'POST',
                body: JSON.stringify(report),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Failed');
        } catch {
            // Save offline
            const queue = JSON.parse(localStorage.getItem('waterQueue') || '[]');
            queue.push(report);
            localStorage.setItem('waterQueue', JSON.stringify(queue));
        }

        setSubmitted(true);
        setIsSubmitting(false);
    }

    const resetForm = () => {
        setSubmitted(false);
        setSourceName('');
        setPhLevel('');
        setChlorineLevel('');
        setHasColiform(null);
        setNotes('');
        setLocation(null);
    };

    if (submitted) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4)',
                background: 'var(--color-bg)',
            }}>
                <div className="card animate-slide-up" style={{ textAlign: 'center', maxWidth: 400 }}>
                    <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--space-4)' }} />
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>Water Report Submitted!</h2>
                    {risk && (
                        <div className={`badge badge-${risk.level.toLowerCase()}`} style={{ marginBottom: 'var(--space-4)' }}>
                            {risk.label}
                        </div>
                    )}
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                        Your water quality report has been recorded and sent for analysis.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Link href="/worker" className="btn btn-ghost">
                            Dashboard
                        </Link>
                        <button onClick={resetForm} className="btn btn-warning">
                            New Test
                        </button>
                    </div>
                </div>
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
                background: 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)',
                padding: 'var(--space-4)',
                color: 'white',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
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
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Test Water Quality</h1>
                    <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>Record water source readings</p>
                </div>
            </header>

            {/* Form */}
            <div style={{ maxWidth: 600, margin: '0 auto', padding: 'var(--space-4)' }}>
                <form onSubmit={handleSubmit}>
                    {/* Source Info */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <Droplets size={16} />
                            WATER SOURCE
                        </h3>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Source Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Village Pump #2"
                                value={sourceName}
                                onChange={(e) => setSourceName(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                            {SOURCE_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setSourceType(type.value)}
                                    style={{
                                        padding: 'var(--space-3)',
                                        border: sourceType === type.value
                                            ? '2px solid var(--warning)'
                                            : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: sourceType === type.value
                                            ? 'var(--warning-light)'
                                            : 'var(--color-surface)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                    }}
                                >
                                    <span style={{ fontSize: 'var(--text-lg)' }}>{type.icon}</span>
                                    <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{type.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--space-4)',
                        }}>
                            TEST RESULTS
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">pH Level (0-14)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    className="form-input"
                                    placeholder="7.0"
                                    value={phLevel}
                                    onChange={(e) => setPhLevel(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Chlorine (mg/L)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className="form-input"
                                    placeholder="Optional"
                                    value={chlorineLevel}
                                    onChange={(e) => setChlorineLevel(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Turbidity / Clarity</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {TURBIDITY_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setTurbidity(option.value)}
                                        style={{
                                            flex: 1,
                                            padding: 'var(--space-3)',
                                            border: turbidity === option.value
                                                ? `2px solid ${option.color}`
                                                : '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            background: turbidity === option.value
                                                ? `${option.color}15`
                                                : 'var(--color-surface)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{option.label}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{option.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Coliform Test Result</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button
                                    type="button"
                                    onClick={() => setHasColiform(false)}
                                    className={`btn ${hasColiform === false ? 'btn-success' : 'btn-ghost'}`}
                                    style={{ flex: 1 }}
                                >
                                    Negative (Safe)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHasColiform(true)}
                                    className={`btn ${hasColiform === true ? 'btn-danger' : 'btn-ghost'}`}
                                    style={{ flex: 1 }}
                                >
                                    Positive (Unsafe)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Risk Indicator */}
                    {risk && (
                        <div
                            className={`alert alert-${risk.level === 'CRITICAL' ? 'critical' : risk.level === 'HIGH' ? 'warning' : 'success'}`}
                            style={{ marginBottom: 'var(--space-4)' }}
                        >
                            <AlertTriangle size={18} />
                            <div>
                                <strong>Calculated Risk: {risk.label}</strong>
                                <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
                                    Based on pH level, turbidity, and coliform results
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Additional Notes (Optional)</label>
                            <textarea
                                className="form-input"
                                placeholder="Any additional observations..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <Navigation size={16} />
                            LOCATION
                        </h3>

                        {!location ? (
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={gpsLoading}
                                className="btn btn-ghost"
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-4)',
                                    border: '2px dashed var(--color-border)',
                                }}
                            >
                                {gpsLoading ? (
                                    <>
                                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <MapPin size={18} />
                                        Tap to Capture Location
                                    </>
                                )}
                            </button>
                        ) : (
                            <div style={{
                                padding: 'var(--space-4)',
                                background: 'var(--success-light)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--success)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                    <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>Location Captured</span>
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
                                    {formatCoordinates(location)}
                                </div>
                                {nearestVillage && (
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                                        📍 {nearestVillage}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-warning btn-lg"
                        style={{ width: '100%', color: 'white' }}
                        disabled={isSubmitting || !phLevel || !sourceName}
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Water Report
                            </>
                        )}
                    </button>
                </form>
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
