'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { VillageData, RiskLevel } from '@/lib/data/mockData';
import 'leaflet/dist/leaflet.css';

// Risk level colors
const RISK_COLORS: Record<RiskLevel, string> = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#16a34a',
};

// Fix Leaflet default icon path issue in Next.js
const customIcon = (riskLevel: RiskLevel) => new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="${RISK_COLORS[riskLevel]}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `)}`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
});

interface InteractiveMapProps {
    villages: VillageData[];
    center?: LatLngExpression;
    zoom?: number;
    height?: string;
    onVillageClick?: (village: VillageData) => void;
    showHeatmap?: boolean;
}

// Component to handle map events and updates
function MapUpdater({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center, zoom]);

    return null;
}

export default function InteractiveMap({
    villages,
    center = [25.5, 92.5], // Default center for Northeast India
    zoom = 7,
    height = '500px',
    onVillageClick,
    showHeatmap = false,
}: InteractiveMapProps) {
    const [mounted, setMounted] = useState(false);

    // Handle client-side only rendering for Leaflet
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className="map-placeholder"
                style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={center} zoom={zoom} />

                {/* Heatmap circles for risk zones */}
                {showHeatmap && villages.map((village, index) => (
                    <CircleMarker
                        key={`heat-${index}`}
                        center={[village.latitude, village.longitude]}
                        radius={20 + (village.activeCases * 2)}
                        fillColor={RISK_COLORS[village.riskLevel]}
                        fillOpacity={0.3}
                        stroke={false}
                    />
                ))}

                {/* Village markers */}
                {villages.map((village, index) => (
                    <Marker
                        key={index}
                        position={[village.latitude, village.longitude]}
                        icon={customIcon(village.riskLevel)}
                        eventHandlers={{
                            click: () => onVillageClick?.(village),
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: 200 }}>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    marginBottom: '8px',
                                    color: '#111827',
                                }}>
                                    {village.name}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '8px',
                                }}>
                                    <span
                                        style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            background: `${RISK_COLORS[village.riskLevel]}20`,
                                            color: RISK_COLORS[village.riskLevel],
                                        }}
                                    >
                                        {village.riskLevel} Risk
                                    </span>
                                </div>

                                <div style={{ fontSize: '13px', color: '#4b5563' }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong>District:</strong> {village.district}
                                    </div>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong>State:</strong> {village.state}
                                    </div>
                                    <div style={{ marginBottom: '4px' }}>
                                        <strong>Active Cases:</strong> {village.activeCases}
                                    </div>
                                    <div>
                                        <strong>Water Issues:</strong> {village.waterIssues}
                                    </div>
                                </div>

                                {village.lastReportAt && (
                                    <div style={{
                                        marginTop: '8px',
                                        fontSize: '11px',
                                        color: '#9ca3af'
                                    }}>
                                        Last report: {new Date(village.lastReportAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
