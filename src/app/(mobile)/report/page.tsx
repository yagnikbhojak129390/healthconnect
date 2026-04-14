'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentPosition, formatCoordinates, getNearestVillage, GPSCoordinates } from '@/lib/gps';
import {
    MapPin,
    Wifi,
    WifiOff,
    ChevronLeft,
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    User,
    Calendar,
    ThermometerSun,
    Navigation
} from 'lucide-react';

const SYMPTOMS = [
    { id: 'fever', label: 'High Fever (>3 days)', icon: '🌡️' },
    { id: 'diarrhea', label: 'Severe Diarrhea', icon: '💧' },
    { id: 'vomiting', label: 'Vomiting', icon: '🤢' },
    { id: 'rash', label: 'Skin Rashes', icon: '🔴' },
    { id: 'dehydration', label: 'Dehydration', icon: '💧' },
    { id: 'abdominal_pain', label: 'Abdominal Pain', icon: '😣' },
];

const SEVERITY_LEVELS = [
    { value: 'mild', label: 'Mild', color: 'var(--success)', desc: 'Minor symptoms, manageable' },
    { value: 'moderate', label: 'Moderate', color: 'var(--warning)', desc: 'Needs attention' },
    { value: 'severe', label: 'Severe', color: 'var(--danger)', desc: 'Urgent care required' },
];

export default function ReportPage() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [location, setLocation] = useState<GPSCoordinates | null>(null);
    const [nearestVillage, setNearestVillage] = useState<string | null>(null);

    // Form state
    const [patientId, setPatientId] = useState('');
    const [age, setAge] = useState('');
    const [caseCount, setCaseCount] = useState('1');
    const [severity, setSeverity] = useState('moderate');
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        function handleOnline() { setIsOnline(true); }
        function handleOffline() { setIsOnline(false); }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleGetLocation = async () => {
        setGpsLoading(true);
        setGpsError(null);

        try {
            const coords = await getCurrentPosition();
            setLocation(coords);

            const { village, distance } = getNearestVillage(coords);
            setNearestVillage(`${village.name} (${distance.toFixed(1)} km away)`);
        } catch (error: any) {
            setGpsError(error.message);
        } finally {
            setGpsLoading(false);
        }
    };

    const toggleSymptom = (symptomId: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(s => s !== symptomId)
                : [...prev, symptomId]
        );
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const report = {
            patientId,
            age: parseInt(age),
            caseCount: parseInt(caseCount),
            severity,
            symptoms: selectedSymptoms,
            location,
            nearestVillage,
            timestamp: Date.now(),
        };

        if (navigator.onLine) {
            try {
                const res = await fetch('/api/reports', {
                    method: 'POST',
                    body: JSON.stringify(report),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (res.ok) {
                    setSubmitted(true);
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                saveOffline(report);
                setSubmitted(true);
            }
        } else {
            saveOffline(report);
            setSubmitted(true);
        }

        setIsSubmitting(false);
    }

    function saveOffline(data: any) {
        const queue = JSON.parse(localStorage.getItem('reportQueue') || '[]');
        queue.push(data);
        localStorage.setItem('reportQueue', JSON.stringify(queue));
    }

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
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>Report Submitted!</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                        {isOnline
                            ? 'Your report has been sent to the command center.'
                            : 'Your report has been saved and will sync when online.'}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                        <Link href="/" className="btn btn-ghost">
                            Go Home
                        </Link>
                        <button onClick={() => { setSubmitted(false); setPatientId(''); setAge(''); setSelectedSymptoms([]); }} className="btn btn-primary">
                            New Report
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
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                padding: 'var(--space-4)',
                color: 'white',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <Link href="/" style={{
                        color: 'rgba(255,255,255,0.8)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        fontSize: 'var(--text-sm)',
                        marginBottom: 'var(--space-3)',
                    }}>
                        <ChevronLeft size={18} />
                        Back to Home
                    </Link>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Report Symptoms</h1>
                            <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>Submit health observations</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-2) var(--space-3)',
                            background: isOnline ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-xs)',
                        }}>
                            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                            {isOnline ? 'Online' : 'Offline'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div style={{ maxWidth: 600, margin: '0 auto', padding: 'var(--space-4)' }}>
                <form onSubmit={handleSubmit}>
                    {/* Patient Info Card */}
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
                            <User size={16} />
                            PATIENT INFORMATION
                        </h3>

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Patient ID / Identifier</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Village A - House 42"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Years"
                                    min="0"
                                    max="120"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Number of Cases</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="1"
                                    min="1"
                                    max="100"
                                    value={caseCount}
                                    onChange={(e) => setCaseCount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Symptoms Card */}
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
                            <ThermometerSun size={16} />
                            SYMPTOMS OBSERVED
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                            {SYMPTOMS.map(symptom => (
                                <button
                                    key={symptom.id}
                                    type="button"
                                    onClick={() => toggleSymptom(symptom.id)}
                                    style={{
                                        padding: 'var(--space-3)',
                                        border: selectedSymptoms.includes(symptom.id)
                                            ? '2px solid var(--primary-500)'
                                            : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: selectedSymptoms.includes(symptom.id)
                                            ? 'var(--primary-50)'
                                            : 'var(--color-surface)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <span style={{ marginRight: 'var(--space-2)' }}>{symptom.icon}</span>
                                    <span style={{ fontSize: 'var(--text-sm)' }}>{symptom.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Severity Card */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--space-4)',
                        }}>
                            SEVERITY LEVEL
                        </h3>

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {SEVERITY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setSeverity(level.value)}
                                    style={{
                                        flex: 1,
                                        padding: 'var(--space-3)',
                                        border: severity === level.value
                                            ? `2px solid ${level.color}`
                                            : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: severity === level.value
                                            ? `${level.color}10`
                                            : 'var(--color-surface)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <div style={{
                                        fontWeight: 600,
                                        fontSize: 'var(--text-sm)',
                                        color: severity === level.value ? level.color : 'var(--color-text)',
                                    }}>
                                        {level.label}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {level.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location Card */}
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
                                        <Loader2 size={18} className="animate-pulse" style={{ animation: 'spin 1s linear infinite' }} />
                                        Detecting Location...
                                    </>
                                ) : (
                                    <>
                                        <MapPin size={18} />
                                        Tap to Auto-Detect Location
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
                                        📍 Near: {nearestVillage}
                                    </div>
                                )}
                            </div>
                        )}

                        {gpsError && (
                            <div className="alert alert-warning" style={{ marginTop: 'var(--space-3)' }}>
                                <AlertCircle size={16} />
                                <span>{gpsError}</span>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%' }}
                        disabled={isSubmitting || selectedSymptoms.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Report
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
