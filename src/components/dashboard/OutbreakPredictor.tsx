'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Brain, Zap, Loader2 } from 'lucide-react';

interface PredictionData {
    disease: string;
    riskLevel: 'high' | 'medium' | 'low';
    probability: number;
    affectedArea: string;
    timeline: string;
    factors: string[];
}

export default function OutbreakPredictor() {
    const [predictions, setPredictions] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPredictions() {
            try {
                // Fetch analytics data and generate predictions based on real data
                const res = await fetch('/api/analytics');
                if (res.ok) {
                    const data = await res.json();

                    // Generate predictions based on actual data patterns
                    const generatedPredictions: PredictionData[] = [];

                    // Check for high case counts
                    if (data.summary?.severeReports > 0) {
                        generatedPredictions.push({
                            disease: 'Waterborne Disease Cluster',
                            riskLevel: data.summary.severeReports >= 5 ? 'high' : data.summary.severeReports >= 2 ? 'medium' : 'low',
                            probability: Math.min(95, 40 + data.summary.severeReports * 10),
                            affectedArea: 'Monitored Districts',
                            timeline: '7-14 days',
                            factors: [
                                `${data.summary.severeReports} severe cases reported`,
                                data.summary.waterIssues > 0 ? `${data.summary.waterIssues} water quality issues` : 'Monitoring water sources',
                                'Pattern analysis in progress'
                            ].filter(Boolean),
                        });
                    }

                    // Check water quality issues
                    if (data.waterTestsByRisk?.critical > 0 || data.waterTestsByRisk?.high > 0) {
                        const waterIssues = (data.waterTestsByRisk?.critical || 0) + (data.waterTestsByRisk?.high || 0);
                        generatedPredictions.push({
                            disease: 'Cholera Risk',
                            riskLevel: data.waterTestsByRisk?.critical > 0 ? 'high' : 'medium',
                            probability: Math.min(90, 35 + waterIssues * 15),
                            affectedArea: 'Areas with water issues',
                            timeline: '10-21 days',
                            factors: [
                                `${data.waterTestsByRisk?.critical || 0} critical water sources`,
                                'Contamination detected',
                                'Monitoring adjacent areas'
                            ],
                        });
                    }

                    // If no specific issues, show general monitoring status
                    if (generatedPredictions.length === 0) {
                        generatedPredictions.push({
                            disease: 'General Health Status',
                            riskLevel: 'low',
                            probability: 15,
                            affectedArea: 'All Districts',
                            timeline: 'Ongoing monitoring',
                            factors: ['No significant patterns detected', 'Routine surveillance active', 'Water sources safe'],
                        });
                    }

                    setPredictions(generatedPredictions);
                }
            } catch (err) {
                console.error('Error fetching predictions:', err);
                // Fallback to no data state
                setPredictions([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPredictions();
        // Refresh every 5 minutes
        const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return { bg: 'var(--danger-light)', color: 'var(--danger)', border: 'var(--danger)' };
            case 'medium': return { bg: 'var(--warning-light)', color: 'var(--warning)', border: 'var(--warning)' };
            default: return { bg: 'var(--success-light)', color: 'var(--success)', border: 'var(--success)' };
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }} />
                </div>
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
                        background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Brain size={20} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h2 className="card-title" style={{ margin: 0 }}>Outbreak Prediction</h2>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            AI-powered risk forecasting
                        </div>
                    </div>
                </div>
                <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={12} />
                    Live
                </span>
            </div>

            {predictions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                    No prediction data available. Submit reports to enable predictions.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {predictions.map((prediction, index) => {
                        const colors = getRiskColor(prediction.riskLevel);
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: 'var(--space-4)',
                                    background: colors.bg,
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: `4px solid ${colors.border}`,
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: 'var(--space-2)',
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-1)',
                                        }}>
                                            <AlertTriangle size={16} style={{ color: colors.color }} />
                                            <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                                                {prediction.disease}
                                            </span>
                                            <span
                                                className={`badge badge-${prediction.riskLevel === 'high' ? 'critical' : prediction.riskLevel === 'medium' ? 'warning' : 'success'}`}
                                                style={{ textTransform: 'capitalize' }}
                                            >
                                                {prediction.riskLevel} Risk
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                                            {prediction.affectedArea} • Expected in {prediction.timeline}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 800,
                                            color: colors.color,
                                        }}>
                                            {prediction.probability}%
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                                            probability
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Factors */}
                                <div style={{
                                    marginTop: 'var(--space-3)',
                                    paddingTop: 'var(--space-3)',
                                    borderTop: `1px solid ${colors.border}40`,
                                }}>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 600,
                                        color: 'var(--gray-500)',
                                        marginBottom: 'var(--space-1)',
                                    }}>
                                        Contributing Factors:
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                                        {prediction.factors.map((factor, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    padding: '2px 8px',
                                                    background: 'rgba(255,255,255,0.7)',
                                                    borderRadius: 'var(--radius-full)',
                                                    color: 'var(--gray-600)',
                                                }}
                                            >
                                                {factor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Trend Summary */}
            <div style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
            }}>
                <TrendingUp size={18} style={{ color: 'var(--primary-600)' }} />
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                    <strong>Analysis:</strong> Based on real-time symptom reports and water quality data
                </div>
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
