'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
    Activity,
    Droplets,
    AlertTriangle,
    BookOpen,
    Phone,
    Clock,
    CheckCircle,
    Circle,
    ChevronRight,
    Calendar,
    FileText,
    Users
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    type: string;
    priority: string;
    dueDate: string;
    status: string;
}

interface Stats {
    reportsSubmitted: number;
    householdsVisited: number;
    alertsResponded: number;
}

export default function WorkerDashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats>({ reportsSubmitted: 0, householdsVisited: 0, alertsResponded: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch reports created by this worker
                const reportsRes = await fetch(`/api/reports?limit=100`);
                if (reportsRes.ok) {
                    const data = await reportsRes.json();
                    const myReports = data.reports?.filter((r: any) => r.reporterId === user?.id) || [];
                    setStats(prev => ({ ...prev, reportsSubmitted: myReports.length }));
                }

                // Fetch alerts
                const alertsRes = await fetch('/api/alerts');
                if (alertsRes.ok) {
                    const data = await alertsRes.json();
                    setStats(prev => ({ ...prev, alertsResponded: data.alerts?.length || 0 }));
                }

                // Sample tasks (these would come from a tasks API in production)
                setTasks([
                    { id: '1', title: 'Follow-up visit for fever cases', type: 'FOLLOWUP', priority: 'HIGH', dueDate: new Date().toISOString(), status: 'PENDING' },
                    { id: '2', title: 'Water source testing - Village well', type: 'WATER_TEST', priority: 'MEDIUM', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'PENDING' },
                    { id: '3', title: 'Monthly health survey', type: 'SURVEY', priority: 'LOW', dueDate: new Date(Date.now() + 172800000).toISOString(), status: 'PENDING' },
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchData();
        }
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="loading-spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700,
                    color: 'var(--gray-900)',
                    marginBottom: 'var(--space-1)',
                }}>
                    {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {user?.village ? `${user.village}, ${user.district}` : user?.district} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { href: '/worker/report', label: 'Report Symptoms', icon: Activity, color: '#e68a00', bg: '#fff7ed' },
                    { href: '/worker/water-test', label: 'Test Water', icon: Droplets, color: 'var(--info)', bg: 'var(--info-light)' },
                    { href: '#', label: 'Emergency', icon: Phone, color: 'var(--danger)', bg: 'var(--danger-light)' },
                    { href: '/worker/learn', label: 'Training', icon: BookOpen, color: 'var(--success)', bg: 'var(--success-light)' },
                ].map((action, i) => (
                    <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                            background: action.bg,
                            border: `1px solid ${action.color}20`,
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--space-4)',
                            textAlign: 'center',
                            transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                        }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-full)',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto var(--space-3)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <action.icon size={24} style={{ color: action.color }} />
                            </div>
                            <div style={{ fontWeight: 600, color: action.color, fontSize: 'var(--text-sm)' }}>
                                {action.label}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-6)' }}>
                <div>
                    {/* My Tasks */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="card-header">
                            <h2 className="card-title">My Tasks</h2>
                            <span className="badge badge-warning">{tasks.filter(t => t.status === 'PENDING').length} pending</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {tasks.map((task, i) => (
                                <div key={task.id} style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: i < tasks.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                }}>
                                    <div style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 'var(--radius-full)',
                                        border: `2px solid ${task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--gray-300)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {task.status === 'COMPLETED' ? (
                                            <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                                        ) : (
                                            <Circle size={12} style={{ color: 'var(--gray-300)' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: 2 }}>
                                            {task.title}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Clock size={12} />
                                            Due: {formatDate(task.dueDate)}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Recent Activity</h2>
                        </div>
                        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
                            No recent activity. Start by submitting a report!
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* This Month Stats */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-4)' }}>This Month</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                            {[
                                { value: stats.reportsSubmitted, label: 'Reports', icon: FileText, color: '#e68a00' },
                                { value: stats.householdsVisited, label: 'Households', icon: Users, color: 'var(--info)' },
                                { value: stats.alertsResponded, label: 'Alerts', icon: AlertTriangle, color: 'var(--success)' },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <stat.icon size={20} style={{ color: stat.color, marginBottom: 'var(--space-2)' }} />
                                    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Training Progress */}
                    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                        <div className="card-header" style={{ marginBottom: 'var(--space-2)' }}>
                            <h3 style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>Training Progress</h3>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success)', fontWeight: 600 }}>67%</span>
                        </div>
                        <div style={{
                            height: 8,
                            background: 'var(--gray-200)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                            marginBottom: 'var(--space-3)',
                        }}>
                            <div style={{
                                width: '67%',
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--success) 0%, #16a34a 100%)',
                                borderRadius: 'var(--radius-full)',
                            }} />
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            8 of 12 modules completed
                        </div>
                        <Link href="/worker/learn" className="btn btn-sm btn-ghost" style={{ marginTop: 'var(--space-3)', width: '100%', justifyContent: 'center' }}>
                            Continue Learning
                        </Link>
                    </div>

                    {/* Upcoming Schedule */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>Upcoming</h3>
                            <Calendar size={16} style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No upcoming events scheduled
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile responsive */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 380px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
