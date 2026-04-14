'use client';

import Link from 'next/link';
import { Activity, Droplets, BookOpen, Settings, ChevronRight, Shield } from 'lucide-react';

export default function MobileHome() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
        padding: 'var(--space-8) var(--space-4)',
        textAlign: 'center',
        color: 'white',
        borderBottomLeftRadius: 'var(--radius-xl)',
        borderBottomRightRadius: 'var(--radius-xl)',
      }}>
        <div style={{
          width: 72,
          height: 72,
          margin: '0 auto var(--space-4)',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Activity size={36} />
        </div>
        <h1 style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 800,
          marginBottom: 'var(--space-1)',
        }}>
          HealthConnect
        </h1>
        <p style={{ opacity: 0.8, fontSize: 'var(--text-sm)' }}>
          Early Warning System for Northeast India
        </p>
      </header>

      {/* Welcome Card */}
      <div style={{
        maxWidth: 500,
        margin: '-40px auto 0',
        padding: '0 var(--space-4)',
      }}>
        <div className="card" style={{
          textAlign: 'center',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--success-light)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
          }}>
            <span style={{
              width: 8,
              height: 8,
              background: 'var(--success)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }} />
            System Online
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>
            Welcome, Health Worker
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Select an action below to get started
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Link
            href="/report"
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              border: '2px solid var(--primary-200)',
              background: 'var(--primary-50)',
              transition: 'all var(--transition-fast)',
            }}>
              <div style={{
                width: 48,
                height: 48,
                background: 'var(--primary-500)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <Activity size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                  Report Symptoms
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Submit health observations
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--primary-400)' }} />
            </div>
          </Link>

          <Link
            href="/water-test"
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              border: '2px solid var(--warning-light)',
              transition: 'all var(--transition-fast)',
            }}>
              <div style={{
                width: 48,
                height: 48,
                background: 'var(--warning)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <Droplets size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                  Test Water Quality
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Record water source readings
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--gray-400)' }} />
            </div>
          </Link>

          <Link
            href="/learn"
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              border: '2px solid var(--success-light)',
              transition: 'all var(--transition-fast)',
            }}>
              <div style={{
                width: 48,
                height: 48,
                background: 'var(--success)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <BookOpen size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                  Education Modules
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Learn hygiene & prevention
                </div>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--gray-400)' }} />
            </div>
          </Link>
        </div>

        {/* Admin Access */}
        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <Link
            href="/login"
            className="btn btn-ghost"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: 'var(--gray-100)',
            }}
          >
            <Shield size={18} />
            Admin / Officer Login
          </Link>
        </div>

        {/* Version */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-8)',
          padding: 'var(--space-4)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
        }}>
          HealthConnect v2.0
          <br />
          Smart Health Surveillance System
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
