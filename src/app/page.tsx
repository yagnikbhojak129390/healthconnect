'use client';

import Link from 'next/link';
import {
    Activity,
    Shield,
    Droplets,
    Bell,
    Map,
    Users,
    FileText,
    CheckCircle,
    ArrowRight,
    BarChart3,
    Smartphone,
    Globe
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            {/* Header */}
            <header style={{
                borderBottom: '1px solid var(--gray-200)',
                background: '#ffffff',
            }}>
                {/* Government Bar */}
                <div style={{
                    background: 'var(--gray-900)',
                    color: 'white',
                    padding: 'var(--space-2) var(--space-6)',
                    fontSize: 'var(--text-xs)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <span>🇮🇳 Government of India</span>
                        <span style={{ opacity: 0.6 }}>|</span>
                        <span>Ministry of Health and Family Welfare</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Skip to Content</a>
                    </div>
                </div>

                {/* Main Header */}
                <div style={{
                    padding: 'var(--space-4) var(--space-8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: 1400,
                    margin: '0 auto',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Activity size={28} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h1 style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 800,
                                color: 'var(--gray-900)',
                            }}>
                                HealthConnect
                            </h1>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                                Smart Health Surveillance System
                            </div>
                        </div>
                    </div>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                        <a href="#features" style={{
                            color: 'var(--gray-600)',
                            textDecoration: 'none',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                        }}>Features</a>
                        <a href="#about" style={{
                            color: 'var(--gray-600)',
                            textDecoration: 'none',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                        }}>About</a>
                        <Link href="/login" className="btn btn-primary">
                            Sign In
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                padding: 'var(--space-16) var(--space-8)',
                maxWidth: 1400,
                margin: '0 auto',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-12)',
                    alignItems: 'center',
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            background: 'var(--success-light)',
                            color: 'var(--success)',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            marginBottom: 'var(--space-4)',
                        }}>
                            <CheckCircle size={16} />
                            Live System
                        </div>
                        <h2 style={{
                            fontSize: 'var(--text-4xl)',
                            fontWeight: 800,
                            lineHeight: 1.2,
                            marginBottom: 'var(--space-4)',
                            color: 'var(--gray-900)',
                        }}>
                            Smart Health Surveillance & Early Warning System
                        </h2>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--gray-600)',
                            marginBottom: 'var(--space-8)',
                            lineHeight: 1.7,
                        }}>
                            A comprehensive digital platform for proactive health monitoring, disease surveillance, and outbreak prevention across Northeast India. Designed for rural connectivity and budget mobile devices.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <Link href="/login" className="btn btn-primary btn-lg">
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <a href="#features" className="btn btn-ghost btn-lg">
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'var(--space-4)',
                    }}>
                        {[
                            { value: '2,847', label: 'Villages Covered', icon: Globe, color: 'var(--primary-600)' },
                            { value: '1,250+', label: 'Health Workers', icon: Users, color: 'var(--success)' },
                            { value: '45,000+', label: 'Reports Submitted', icon: FileText, color: 'var(--info)' },
                            { value: '8', label: 'Districts Active', icon: Map, color: 'var(--warning)' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'var(--gray-50)',
                                border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                                textAlign: 'center',
                            }}>
                                <stat.icon size={28} style={{ color: stat.color, marginBottom: 'var(--space-3)' }} />
                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--gray-900)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{
                padding: 'var(--space-16) var(--space-8)',
                background: 'var(--gray-50)',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                            Comprehensive Health Monitoring
                        </h3>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--gray-600)', maxWidth: 600, margin: '0 auto' }}>
                            Integrated tools for surveillance, reporting, and outbreak prevention
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-6)',
                    }}>
                        {[
                            {
                                icon: Activity,
                                title: 'Symptom Tracking',
                                description: 'GPS-tagged real-time symptom reporting with offline capability for rural areas.',
                                color: 'var(--primary-600)',
                                bg: 'var(--primary-50)',
                            },
                            {
                                icon: Droplets,
                                title: 'Water Quality',
                                description: 'Continuous monitoring of water sources with contamination alerts.',
                                color: 'var(--info)',
                                bg: 'var(--info-light)',
                            },
                            {
                                icon: Bell,
                                title: 'Alert System',
                                description: 'Multi-channel emergency broadcast via SMS, push, and voice calls.',
                                color: 'var(--warning)',
                                bg: 'var(--warning-light)',
                            },
                            {
                                icon: Map,
                                title: 'GIS Mapping',
                                description: 'Interactive spatial analytics for disease hotspot identification.',
                                color: 'var(--success)',
                                bg: 'var(--success-light)',
                            },
                            {
                                icon: BarChart3,
                                title: 'AI Predictions',
                                description: 'Machine learning models for outbreak probability forecasting.',
                                color: 'var(--danger)',
                                bg: 'var(--danger-light)',
                            },
                            {
                                icon: Smartphone,
                                title: 'Mobile First',
                                description: 'Optimized for budget devices and low-bandwidth rural connectivity.',
                                color: 'var(--gray-700)',
                                bg: 'var(--gray-100)',
                            },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: '#ffffff',
                                border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-6)',
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: feature.bg,
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    <feature.icon size={24} style={{ color: feature.color }} />
                                </div>
                                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                    {feature.title}
                                </h4>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{
                padding: 'var(--space-16) var(--space-8)',
                background: '#ffffff',
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--space-12)',
                        alignItems: 'center',
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: 'var(--text-3xl)',
                                fontWeight: 800,
                                marginBottom: 'var(--space-4)',
                                color: 'var(--gray-900)',
                            }}>
                                About HealthConnect
                            </h3>
                            <p style={{
                                fontSize: 'var(--text-lg)',
                                color: 'var(--gray-600)',
                                marginBottom: 'var(--space-4)',
                                lineHeight: 1.7,
                            }}>
                                HealthConnect is a comprehensive digital health surveillance platform designed
                                specifically for the unique challenges of Northeast India. Our mission is to
                                enable proactive disease prevention through real-time monitoring, early warning
                                systems, and seamless communication between field workers and health authorities.
                            </p>
                            <p style={{
                                fontSize: 'var(--text-base)',
                                color: 'var(--gray-600)',
                                marginBottom: 'var(--space-6)',
                                lineHeight: 1.7,
                            }}>
                                Built with offline-first capabilities and optimized for low-bandwidth rural
                                connectivity, the platform empowers ASHA workers to report symptoms, test water
                                quality, and receive critical health alerts even in remote areas.
                            </p>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-3)',
                            }}>
                                {[
                                    { icon: '🎯', text: 'Real-time disease outbreak detection and prediction' },
                                    { icon: '📱', text: 'Mobile-first design for field workers' },
                                    { icon: '🌐', text: 'Offline capability with automatic sync' },
                                    { icon: '🗺️', text: 'GPS-tagged reports with GIS mapping' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--gray-700)',
                                    }}>
                                        <span style={{ fontSize: 'var(--text-lg)' }}>{item.icon}</span>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-8)',
                            border: '1px solid var(--gray-200)',
                        }}>
                            <h4 style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 700,
                                marginBottom: 'var(--space-6)',
                                color: 'var(--gray-900)',
                            }}>
                                Key Objectives
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {[
                                    {
                                        title: 'Early Detection',
                                        desc: 'Identify potential outbreaks before they spread through symptom pattern analysis',
                                    },
                                    {
                                        title: 'Water Safety',
                                        desc: 'Monitor water sources and alert communities to contamination risks',
                                    },
                                    {
                                        title: 'Rapid Response',
                                        desc: 'Enable quick coordination between field workers and health authorities',
                                    },
                                    {
                                        title: 'Community Education',
                                        desc: 'Provide training materials for hygiene and disease prevention',
                                    },
                                ].map((obj, i) => (
                                    <div key={i} style={{
                                        padding: 'var(--space-4)',
                                        background: '#ffffff',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: '3px solid var(--primary-500)',
                                    }}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: 'var(--text-sm)',
                                            marginBottom: 'var(--space-1)',
                                            color: 'var(--gray-800)',
                                        }}>
                                            {obj.title}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--gray-600)',
                                        }}>
                                            {obj.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: 'var(--space-16) var(--space-8)',
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
                color: 'white',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                        Ready to Get Started?
                    </h3>
                    <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-8)' }}>
                        Access your dashboard to monitor health surveillance data and manage reports.
                    </p>
                    <Link href="/login" className="btn btn-lg" style={{
                        background: 'white',
                        color: 'var(--primary-700)',
                        fontWeight: 700,
                    }}>
                        Sign In to Dashboard <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: 'var(--space-8)',
                borderTop: '1px solid var(--gray-200)',
                background: '#ffffff',
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <Activity size={20} style={{ color: 'var(--primary-600)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>HealthConnect</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                        © 2026 Ministry of Health and Family Welfare, Government of India
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                        <a href="#" style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>Terms of Service</a>
                        <a href="#" style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>Help</a>
                    </div>
                </div>
            </footer>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    section > div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    section > div > div[style*="grid-template-columns: repeat(3, 1fr)"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 768px) {
                    nav {
                        display: none !important;
                    }
                    section > div > div[style*="repeat(2, 1fr)"] {
                        grid-template-columns: 1fr !important;
                    }
                    footer > div {
                        flex-direction: column !important;
                        gap: var(--space-4) !important;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}
