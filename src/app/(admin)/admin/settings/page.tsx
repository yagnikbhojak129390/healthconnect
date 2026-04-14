'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Bell, Shield, Globe, Database, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        notifications: {
            emailAlerts: true,
            smsAlerts: true,
            pushNotifications: true,
            criticalOnly: false,
        },
        system: {
            autoSync: true,
            syncInterval: '15',
            dataRetention: '90',
            language: 'en',
        },
        security: {
            twoFactor: false,
            sessionTimeout: '60',
            ipWhitelist: false,
        },
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <header className="page-header">
                <div>
                    <Link href="/admin" style={{
                        color: 'var(--primary-600)',
                        textDecoration: 'none',
                        fontSize: 'var(--text-sm)',
                        display: 'block',
                        marginBottom: 'var(--space-2)',
                    }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 className="page-title">System Settings</h1>
                    <p className="page-subtitle">
                        Configure system preferences and notifications
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={16} />
                    Save Changes
                </button>
            </header>

            {saved && (
                <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
                    <CheckCircle size={18} />
                    Settings saved successfully!
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {/* Notification Settings */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Bell size={20} style={{ color: 'var(--primary-600)' }} />
                            <h2 className="card-title" style={{ margin: 0 }}>Notification Settings</h2>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <label className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 500 }}>Email Alerts</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    Receive alerts via email
                                </div>
                            </div>
                            <input type="checkbox" checked={settings.notifications.emailAlerts}
                                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, emailAlerts: e.target.checked } })} />
                        </label>
                        <label className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 500 }}>SMS Alerts</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    Receive critical alerts via SMS
                                </div>
                            </div>
                            <input type="checkbox" checked={settings.notifications.smsAlerts}
                                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smsAlerts: e.target.checked } })} />
                        </label>
                        <label className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 500 }}>Push Notifications</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    Browser push notifications
                                </div>
                            </div>
                            <input type="checkbox" checked={settings.notifications.pushNotifications}
                                onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, pushNotifications: e.target.checked } })} />
                        </label>
                    </div>
                </div>

                {/* System Settings */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Database size={20} style={{ color: 'var(--primary-600)' }} />
                            <h2 className="card-title" style={{ margin: 0 }}>System Configuration</h2>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Sync Interval (minutes)</label>
                            <select className="form-select" value={settings.system.syncInterval}
                                onChange={(e) => setSettings({ ...settings, system: { ...settings.system, syncInterval: e.target.value } })}>
                                <option value="5">Every 5 minutes</option>
                                <option value="15">Every 15 minutes</option>
                                <option value="30">Every 30 minutes</option>
                                <option value="60">Every hour</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Data Retention (days)</label>
                            <select className="form-select" value={settings.system.dataRetention}
                                onChange={(e) => setSettings({ ...settings, system: { ...settings.system, dataRetention: e.target.value } })}>
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="365">1 year</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">System Language</label>
                            <select className="form-select" value={settings.system.language}
                                onChange={(e) => setSettings({ ...settings, system: { ...settings.system, language: e.target.value } })}>
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="as">Assamese</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Shield size={20} style={{ color: 'var(--primary-600)' }} />
                            <h2 className="card-title" style={{ margin: 0 }}>Security</h2>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <label className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 500 }}>Two-Factor Authentication</div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                                    Require 2FA for admin accounts
                                </div>
                            </div>
                            <input type="checkbox" checked={settings.security.twoFactor}
                                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactor: e.target.checked } })} />
                        </label>
                        <div className="form-group" style={{ maxWidth: 300 }}>
                            <label className="form-label">Session Timeout (minutes)</label>
                            <select className="form-select" value={settings.security.sessionTimeout}
                                onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: e.target.value } })}>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                                <option value="480">8 hours</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .toggle-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-3);
                    background: var(--gray-50);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                }
                .toggle-row input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
