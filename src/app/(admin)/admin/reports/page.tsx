'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockSymptomReports, SymptomReport, ReportStatus, DiseaseType } from '@/lib/data/mockData';
import {
    FileText,
    Download,
    Filter,
    Search,
    Clock,
    MapPin,
    User,
    ChevronDown,
    Eye,
    CheckCircle
} from 'lucide-react';

export default function ReportsPage() {
    const [reports, setReports] = useState(mockSymptomReports);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [diseaseFilter, setDiseaseFilter] = useState<DiseaseType | 'all'>('all');

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesDisease = diseaseFilter === 'all' || report.diseaseType === diseaseFilter;
        return matchesSearch && matchesStatus && matchesDisease;
    });

    const handleVerify = (reportId: string) => {
        setReports(prev => prev.map(r =>
            r.id === reportId ? { ...r, status: 'verified' as ReportStatus } : r
        ));
    };

    const getStatusBadge = (status: ReportStatus) => {
        const styles: Record<ReportStatus, { class: string; label: string }> = {
            pending: { class: 'badge-warning', label: 'Pending' },
            verified: { class: 'badge-success', label: 'Verified' },
            investigating: { class: 'badge-info', label: 'Investigating' },
            resolved: { class: 'badge-low', label: 'Resolved' },
        };
        return <span className={`badge ${styles[status].class}`}>{styles[status].label}</span>;
    };

    const getSeverityBadge = (severity: string) => {
        const map: Record<string, string> = {
            severe: 'badge-critical',
            moderate: 'badge-medium',
            mild: 'badge-low',
        };
        return <span className={`badge ${map[severity]}`} style={{ textTransform: 'capitalize' }}>{severity}</span>;
    };

    const exportToCsv = () => {
        const headers = ['ID', 'Patient', 'Village', 'District', 'Symptoms', 'Severity', 'Status', 'Date'];
        const rows = filteredReports.map(r => [
            r.id,
            r.patientId,
            r.villageName,
            r.district,
            r.symptoms.join('; '),
            r.severity,
            r.status,
            new Date(r.reportedAt).toLocaleDateString(),
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `health-reports-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h1 className="page-title">Health Reports</h1>
                    <p className="page-subtitle">
                        {filteredReports.length} reports found • {reports.filter(r => r.status === 'pending').length} pending review
                    </p>
                </div>
                <button onClick={exportToCsv} className="btn btn-primary">
                    <Download size={16} />
                    Export CSV
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { label: 'Total Reports', value: reports.length, color: 'var(--primary-600)' },
                    { label: 'Pending Review', value: reports.filter(r => r.status === 'pending').length, color: 'var(--warning)' },
                    { label: 'Severe Cases', value: reports.filter(r => r.severity === 'severe').length, color: 'var(--danger)' },
                    { label: 'Unique Villages', value: new Set(reports.map(r => r.villageName)).size, color: 'var(--info)' },
                ].map(stat => (
                    <div key={stat.label} className="stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                        }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by village, patient, or district..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: 42 }}
                        />
                    </div>

                    <select
                        className="form-input form-select"
                        style={{ width: 'auto' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        className="form-input form-select"
                        style={{ width: 'auto' }}
                        value={diseaseFilter}
                        onChange={(e) => setDiseaseFilter(e.target.value as DiseaseType | 'all')}
                    >
                        <option value="all">All Diseases</option>
                        <option value="cholera">Cholera</option>
                        <option value="typhoid">Typhoid</option>
                        <option value="hepatitis_a">Hepatitis A</option>
                        <option value="diarrhea">Diarrhea</option>
                        <option value="dysentery">Dysentery</option>
                    </select>
                </div>
            </div>

            {/* Reports Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Patient / Location</th>
                                <th>Symptoms</th>
                                <th>Severity</th>
                                <th>Disease</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map(report => (
                                <tr key={report.id}>
                                    <td>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                            {report.id}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{report.patientId}</div>
                                        <div style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-1)',
                                        }}>
                                            <MapPin size={12} />
                                            {report.villageName}, {report.district}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'var(--space-1)',
                                            maxWidth: 200,
                                        }}>
                                            {report.symptoms.slice(0, 3).map(symptom => (
                                                <span
                                                    key={symptom}
                                                    style={{
                                                        padding: '2px 6px',
                                                        background: 'var(--gray-100)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: 'var(--text-xs)',
                                                        textTransform: 'capitalize',
                                                    }}
                                                >
                                                    {symptom.replace('_', ' ')}
                                                </span>
                                            ))}
                                            {report.symptoms.length > 3 && (
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                                    +{report.symptoms.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{getSeverityBadge(report.severity)}</td>
                                    <td>
                                        <span style={{ fontSize: 'var(--text-sm)', textTransform: 'capitalize' }}>
                                            {report.diseaseType?.replace('_', ' ') || '—'}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(report.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            <span style={{ fontSize: 'var(--text-sm)' }}>
                                                {new Date(report.reportedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button className="btn btn-sm btn-ghost" title="View Details">
                                                <Eye size={14} />
                                            </button>
                                            {report.status === 'pending' && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    title="Verify"
                                                    onClick={() => handleVerify(report.id)}
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
        </div>
    );
}
