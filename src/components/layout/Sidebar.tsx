'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLE_LABELS } from '@/lib/auth/types';
import {
    LayoutDashboard,
    AlertTriangle,
    BarChart3,
    Map,
    FileText,
    Users,
    Settings,
    LogOut,
    Bell,
    Droplets,
    Menu,
    X,
    Home,
    Activity
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    permission?: string;
}

const mainNavItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, permission: 'canViewAnalytics' },
    { href: '/admin/map', label: 'GIS Map', icon: Map, permission: 'canAccessMap' },
];

const reportingItems: NavItem[] = [
    { href: '/admin/reports', label: 'All Reports', icon: FileText },
    { href: '/admin/water', label: 'Water Quality', icon: Droplets },
];

const adminItems: NavItem[] = [
    { href: '/admin/users', label: 'User Management', icon: Users, permission: 'canManageUsers' },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout, hasPermission } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const filterByPermission = (items: NavItem[]) =>
        items.filter(item => !item.permission || hasPermission(item.permission as never));

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                className="btn btn-icon btn-ghost"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: 'var(--space-4)',
                    left: 'var(--space-4)',
                    zIndex: 301,
                    display: 'none',
                }}
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar - Light Theme */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Activity size={20} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <div className="sidebar-brand">HealthConnect</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                                Admin Portal
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {/* Main Navigation */}
                    <div className="sidebar-section">Main</div>
                    {filterByPermission(mainNavItems).map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                            {item.href === '/admin/alerts' && (
                                <span style={{
                                    marginLeft: 'auto',
                                    background: 'var(--danger)',
                                    color: 'white',
                                    fontSize: 'var(--text-xs)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 600,
                                }}>
                                    2
                                </span>
                            )}
                        </Link>
                    ))}

                    {/* Reporting */}
                    <div className="sidebar-section">Reporting</div>
                    {filterByPermission(reportingItems).map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {/* Admin - only show if user has manage users permission */}
                    {hasPermission('canManageUsers') && (
                        <>
                            <div className="sidebar-section">Administration</div>
                            {filterByPermission(adminItems).map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </>
                    )}
                </nav>

                {/* Back to Main Site */}
                <div style={{
                    padding: 'var(--space-4)',
                    borderTop: '1px solid var(--color-border)',
                }}>
                    <Link href="/" className="sidebar-link">
                        <Home size={18} />
                        <span>Main Website</span>
                    </Link>
                </div>

                {/* User Section */}
                {user && (
                    <div style={{
                        padding: 'var(--space-4)',
                        borderTop: '1px solid var(--color-border)',
                        background: 'var(--gray-50)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-3)',
                        }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: 'var(--text-sm)',
                            }}>
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: 'var(--text-sm)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--gray-800)',
                                }}>
                                    {user.name}
                                </div>
                                <div style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {ROLE_LABELS[user.role]}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="sidebar-link"
                            style={{
                                width: '100%',
                                border: 'none',
                                background: 'var(--gray-100)',
                                cursor: 'pointer',
                                justifyContent: 'center',
                            }}
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 199,
                    }}
                />
            )}

            <style jsx>{`
                @media (max-width: 1024px) {
                    button[aria-label="Toggle menu"] {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
}
