import Link from 'next/link';

export default function LearnPage() {
    const modules = [
        {
            id: 1,
            title: 'Cholera Prevention',
            description: 'Learn how to prevent Cholera spread during monsoon.',
            color: '#e0f7fa',
            icon: '🦠'
        },
        {
            id: 2,
            title: 'Safe Water Practices',
            description: 'How to test and purify water from village pumps.',
            color: '#e8f5e9',
            icon: '💧'
        },
        {
            id: 3,
            title: 'Hygiene for Children',
            description: 'Handwashing guides and sanitation basics.',
            color: '#fff3e0',
            icon: '🧼'
        }
    ];

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-primary)', display: 'inline-block', marginBottom: '1rem' }}>
                ← Back to Home
            </Link>

            <h1 className="title">Community Education</h1>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
                Resources to share with villagers.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {modules.map((mod) => (
                    <div key={mod.id} className="card" style={{ background: mod.color, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>{mod.icon}</div>
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>{mod.title}</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{mod.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
