'use client';

import Link from 'next/link';
import { ChevronLeft, BookOpen, CheckCircle } from 'lucide-react';

const MODULES = [
    {
        id: 1,
        title: 'Cholera Prevention',
        description: 'Learn how to prevent Cholera spread during monsoon season.',
        color: '#e0f7fa',
        borderColor: '#00acc1',
        icon: '🦠',
        duration: '15 min',
        completed: true,
    },
    {
        id: 2,
        title: 'Safe Water Practices',
        description: 'How to test and purify water from various sources.',
        color: '#e8f5e9',
        borderColor: '#43a047',
        icon: '💧',
        duration: '20 min',
        completed: true,
    },
    {
        id: 3,
        title: 'Hygiene for Children',
        description: 'Handwashing guides and sanitation basics for communities.',
        color: '#fff3e0',
        borderColor: '#ef6c00',
        icon: '🧼',
        duration: '12 min',
        completed: true,
    },
    {
        id: 4,
        title: 'Symptom Recognition',
        description: 'Identifying early warning signs of waterborne diseases.',
        color: '#fce4ec',
        borderColor: '#d81b60',
        icon: '🩺',
        duration: '18 min',
        completed: true,
    },
    {
        id: 5,
        title: 'Emergency Response',
        description: 'Steps to take during disease outbreaks in your area.',
        color: '#f3e5f5',
        borderColor: '#7b1fa2',
        icon: '🚨',
        duration: '25 min',
        completed: true,
    },
    {
        id: 6,
        title: 'Community Education',
        description: 'Teaching villagers about preventive healthcare.',
        color: '#e1f5fe',
        borderColor: '#0288d1',
        icon: '👥',
        duration: '15 min',
        completed: true,
    },
    {
        id: 7,
        title: 'GPS & Reporting',
        description: 'Using the mobile app for accurate location-based reports.',
        color: '#e8eaf6',
        borderColor: '#3949ab',
        icon: '📱',
        duration: '10 min',
        completed: true,
    },
    {
        id: 8,
        title: 'Data Collection Best Practices',
        description: 'Ensuring accuracy in health surveillance data.',
        color: '#f1f8e9',
        borderColor: '#689f38',
        icon: '📊',
        duration: '20 min',
        completed: true,
    },
    {
        id: 9,
        title: 'Typhoid Prevention',
        description: 'Understanding and preventing typhoid fever.',
        color: '#fff8e1',
        borderColor: '#ffa000',
        icon: '🌡️',
        duration: '15 min',
        completed: false,
    },
    {
        id: 10,
        title: 'Hepatitis A Awareness',
        description: 'Symptoms, prevention, and community education.',
        color: '#eceff1',
        borderColor: '#546e7a',
        icon: '💉',
        duration: '18 min',
        completed: false,
    },
    {
        id: 11,
        title: 'Monsoon Health Preparedness',
        description: 'Preparing communities for seasonal health challenges.',
        color: '#e3f2fd',
        borderColor: '#1976d2',
        icon: '🌧️',
        duration: '22 min',
        completed: false,
    },
    {
        id: 12,
        title: 'Mental Health First Aid',
        description: 'Supporting mental wellbeing in rural communities.',
        color: '#ede7f6',
        borderColor: '#512da8',
        icon: '🧠',
        duration: '25 min',
        completed: false,
    },
];

export default function WorkerLearnPage() {
    const completedCount = MODULES.filter(m => m.completed).length;
    const progress = Math.round((completedCount / MODULES.length) * 100);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            paddingBottom: 'var(--space-8)',
        }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, var(--success) 0%, #16a34a 100%)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>Training Modules</h1>
                            <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>Health worker certification program</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontSize: 'var(--text-sm)' }}>Your Progress</span>
                            <span style={{ fontWeight: 700 }}>{progress}%</span>
                        </div>
                        <div style={{
                            height: 8,
                            background: 'rgba(255,255,255,0.3)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'white',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginTop: 'var(--space-2)' }}>
                            {completedCount} of {MODULES.length} modules completed
                        </div>
                    </div>
                </div>
            </header>

            {/* Modules */}
            <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    {MODULES.map((mod) => (
                        <div
                            key={mod.id}
                            className="card"
                            style={{
                                background: mod.color,
                                borderLeft: `4px solid ${mod.borderColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-4)',
                                cursor: 'pointer',
                                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                            }}
                        >
                            <div style={{ fontSize: 'var(--text-3xl)' }}>{mod.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                                    <h3 style={{ margin: 0, color: 'var(--gray-800)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
                                        {mod.title}
                                    </h3>
                                    {mod.completed && (
                                        <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                                    {mod.description}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{mod.duration}</div>
                                <button
                                    className={`btn btn-sm ${mod.completed ? 'btn-ghost' : 'btn-primary'}`}
                                    style={{ marginTop: 'var(--space-2)' }}
                                >
                                    {mod.completed ? 'Review' : 'Start'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
