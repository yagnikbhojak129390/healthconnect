'use client';

import Link from 'next/link';
import { ChevronLeft, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MOCK_TASKS = [
    {
        id: '1',
        title: 'Follow-up visit to Nongpoh village',
        description: 'Check on patients reported with diarrhea symptoms last week',
        priority: 'high',
        status: 'pending',
        dueDate: 'Today',
        type: 'follow-up',
    },
    {
        id: '2',
        title: 'Water quality test - Hand Pump #7',
        description: 'Monthly water quality assessment at community hand pump',
        priority: 'medium',
        status: 'pending',
        dueDate: 'Tomorrow',
        type: 'water-test',
    },
    {
        id: '3',
        title: 'Health awareness session',
        description: 'Conduct hygiene awareness program at Laitkor primary school',
        priority: 'low',
        status: 'pending',
        dueDate: 'This week',
        type: 'education',
    },
    {
        id: '4',
        title: 'Submit weekly report',
        description: 'Complete and submit weekly surveillance summary',
        priority: 'medium',
        status: 'completed',
        dueDate: 'Yesterday',
        type: 'report',
    },
];

export default function WorkerTasksPage() {
    const pendingTasks = MOCK_TASKS.filter(t => t.status === 'pending');
    const completedTasks = MOCK_TASKS.filter(t => t.status === 'completed');

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            default: return 'var(--success)';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg)',
            paddingBottom: 'var(--space-8)',
        }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, #e68a00 0%, #b86e00 100%)',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>My Tasks</h1>
                            <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>
                                {pendingTasks.length} pending • {completedTasks.length} completed
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tasks */}
            <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-4)' }}>
                {/* Pending Tasks */}
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--gray-700)' }}>
                    Pending Tasks
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                    {pendingTasks.map(task => (
                        <div key={task.id} className="card" style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                <div>
                                    <h3 style={{ fontWeight: 600, fontSize: 'var(--text-base)', margin: 0 }}>{task.title}</h3>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
                                        {task.description}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 10px',
                                    background: `${getPriorityColor(task.priority)}15`,
                                    color: getPriorityColor(task.priority),
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                }}>
                                    {task.priority}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                <Clock size={14} />
                                <span>Due: {task.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Completed Tasks */}
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--gray-700)' }}>
                    Completed
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {completedTasks.map(task => (
                        <div key={task.id} className="card" style={{ opacity: 0.7, borderLeft: '4px solid var(--success)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                                <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>{task.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
