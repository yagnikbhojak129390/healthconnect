'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, MOCK_USERS } from '@/lib/auth/AuthContext';
import { ROLE_LABELS, UserRole, User } from '@/lib/auth/types';
import {
    Users,
    UserPlus,
    Shield,
    Search,
    Check,
    X,
    Edit,
    Trash2,
    Mail,
    MapPin
} from 'lucide-react';

export default function UsersPage() {
    const { user: currentUser, hasPermission } = useAuth();
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

    // Check permission
    if (!hasPermission('canManageUsers')) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                <Shield size={48} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }} />
                <h2 style={{ marginBottom: 'var(--space-2)' }}>Access Denied</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    You don&apos;t have permission to manage users.
                </p>
                <Link href="/admin" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleToggleActive = (userId: string) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, isActive: !u.isActive } : u
        ));
    };

    const handleChangeRole = (userId: string, newRole: UserRole) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">
                        Manage system users and their permissions
                    </p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={16} />
                    Add New User
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card" style={{ '--stat-color': 'var(--primary-600)' } as React.CSSProperties}>
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--success)' } as React.CSSProperties}>
                    <div className="stat-value">{users.filter(u => u.isActive).length}</div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--warning)' } as React.CSSProperties}>
                    <div className="stat-value">{users.filter(u => u.role === 'health_worker').length}</div>
                    <div className="stat-label">Health Workers</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': 'var(--info)' } as React.CSSProperties}>
                    <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="stat-label">Administrators</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
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
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: 42 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        {(['all', 'admin', 'health_worker'] as const).map(filter => (
                            <button
                                key={filter}
                                onClick={() => setRoleFilter(filter)}
                                className={`btn btn-sm ${roleFilter === filter ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                {filter === 'all' ? 'All Roles' : ROLE_LABELS[filter as UserRole]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 'var(--radius-full)',
                                                background: user.role === 'admin' ? 'var(--primary-100)' : '#fff3e6',
                                                color: user.role === 'admin' ? 'var(--primary-700)' : '#e68a00',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 600,
                                                fontSize: 'var(--text-sm)',
                                            }}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                <div style={{
                                                    fontSize: 'var(--text-xs)',
                                                    color: 'var(--color-text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-1)',
                                                }}>
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                                            className="form-input form-select"
                                            style={{
                                                padding: '4px 32px 4px 8px',
                                                fontSize: 'var(--text-xs)',
                                                width: 'auto',
                                            }}
                                            disabled={user.id === currentUser?.id}
                                        >
                                            <option value="admin">Administrator</option>
                                            <option value="health_worker">Health Worker</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                                            <span style={{ fontSize: 'var(--text-sm)' }}>
                                                {user.village ? `${user.village}, ${user.district}` : user.district || '—'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${user.isActive ? 'badge-success' : 'badge-critical'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => user.id !== currentUser?.id && handleToggleActive(user.id)}
                                        >
                                            {user.isActive ? <Check size={12} /> : <X size={12} />}
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button className="btn btn-sm btn-ghost" title="Edit">
                                                <Edit size={14} />
                                            </button>
                                            {user.id !== currentUser?.id && (
                                                <button className="btn btn-sm btn-ghost" title="Delete" style={{ color: 'var(--danger)' }}>
                                                    <Trash2 size={14} />
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
