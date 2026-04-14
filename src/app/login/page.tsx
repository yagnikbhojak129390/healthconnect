'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Activity, ArrowLeft } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const { login, isLoading, isAuthenticated, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/worker');
            }
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        const result = await login(email, password);
        if (result.success && result.role) {
            if (result.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/worker');
            }
        } else {
            setError('Invalid credentials. Please check your email and password.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: '#ffffff',
        }}>
            {/* Left Panel - Branding */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'var(--space-12)',
                color: 'white',
                position: 'relative',
            }}>
                {/* Back to Home */}
                <Link href="/" style={{
                    position: 'absolute',
                    top: 'var(--space-6)',
                    left: 'var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                }}>
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>

                <div style={{ textAlign: 'center', maxWidth: 400 }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        margin: '0 auto var(--space-6)',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <Activity size={40} />
                    </div>
                    <h1 style={{
                        fontSize: 'var(--text-4xl)',
                        fontWeight: 800,
                        marginBottom: 'var(--space-4)',
                    }}>
                        HealthConnect
                    </h1>
                    <p style={{
                        fontSize: 'var(--text-lg)',
                        opacity: 0.9,
                        lineHeight: 1.6,
                    }}>
                        Smart Health Surveillance & Early Warning System for Northeast India
                    </p>
                    <div style={{
                        marginTop: 'var(--space-8)',
                        padding: 'var(--space-4)',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-lg)',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
                            Ministry of Health and Family Welfare
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, marginTop: 'var(--space-1)' }}>
                            Government of India
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-8)',
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        marginBottom: 'var(--space-2)',
                        color: 'var(--gray-900)',
                    }}>
                        Welcome back
                    </h2>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--space-8)',
                    }}>
                        Sign in to access your dashboard
                    </p>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-critical" style={{ marginBottom: 'var(--space-4)' }}>
                                <AlertCircle size={16} />
                                <span style={{ fontSize: 'var(--text-sm)' }}>{error}</span>
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                }} />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: 44 }}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="form-label">Password</label>
                                <a href="#" style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--primary-600)',
                                    textDecoration: 'none',
                                }}>
                                    Forgot password?
                                </a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: 44, paddingRight: 44 }}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 14,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--color-text-muted)',
                                        padding: 0,
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-spinner" style={{ width: 20, height: 20 }} />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div style={{
                        marginTop: 'var(--space-8)',
                        textAlign: 'center',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                    }}>
                        HealthConnect v2.0 • Smart Health Surveillance
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    );
}
