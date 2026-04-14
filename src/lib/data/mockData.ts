import { NORTHEAST_VILLAGES, GPSCoordinates } from '../gps';

// Risk levels
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// Disease types
export type DiseaseType = 'cholera' | 'typhoid' | 'hepatitis_a' | 'diarrhea' | 'dysentery' | 'other';

// Report status
export type ReportStatus = 'pending' | 'verified' | 'investigating' | 'resolved';

// Alert severity
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface SymptomReport {
    id: string;
    patientId: string;
    age: number;
    symptoms: string[];
    severity: 'mild' | 'moderate' | 'severe';
    caseCount: number;
    location: GPSCoordinates;
    villageName: string;
    district: string;
    reportedBy: string;
    reportedAt: Date;
    status: ReportStatus;
    diseaseType?: DiseaseType;
}

export interface WaterTestReport {
    id: string;
    sourceName: string;
    sourceType: 'pump' | 'well' | 'river' | 'tank' | 'other';
    location: GPSCoordinates;
    villageName: string;
    district: string;
    phLevel: number;
    turbidity: 'clear' | 'cloudy' | 'muddy';
    chlorineLevel?: number;
    coliformPresent?: boolean;
    riskLevel: RiskLevel;
    photoUrl?: string;
    reportedBy: string;
    reportedAt: Date;
}

export interface Alert {
    id: string;
    severity: AlertSeverity;
    title: string;
    description: string;
    location: string;
    district: string;
    coordinates?: GPSCoordinates;
    createdAt: Date;
    updatedAt?: Date;
    status: 'active' | 'acknowledged' | 'investigating' | 'resolved';
    caseCount?: number;
    resolvedBy?: string;
    resolvedAt?: Date;
}

export interface VillageData {
    name: string;
    district: string;
    state: string;
    latitude: number;
    longitude: number;
    riskLevel: RiskLevel;
    activeCases: number;
    waterIssues: number;
    lastReportAt?: Date;
}

// Generate mock data for villages with risk levels
function generateVillageData(): VillageData[] {
    const riskLevels: RiskLevel[] = ['critical', 'high', 'medium', 'low'];

    return NORTHEAST_VILLAGES.map((village, index) => ({
        ...village,
        riskLevel: riskLevels[index % 4],
        activeCases: Math.floor(Math.random() * 20),
        waterIssues: Math.floor(Math.random() * 5),
        lastReportAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
}

// Generate mock symptom reports
function generateSymptomReports(): SymptomReport[] {
    const symptoms = ['fever', 'diarrhea', 'vomiting', 'rash', 'dehydration', 'abdominal_pain'];
    const severities: Array<'mild' | 'moderate' | 'severe'> = ['mild', 'moderate', 'severe'];
    const statuses: ReportStatus[] = ['pending', 'verified', 'investigating', 'resolved'];
    const diseases: DiseaseType[] = ['cholera', 'typhoid', 'hepatitis_a', 'diarrhea', 'dysentery'];

    return Array.from({ length: 25 }, (_, i) => {
        const village = NORTHEAST_VILLAGES[i % NORTHEAST_VILLAGES.length];
        return {
            id: `RPT-${String(1000 + i).padStart(4, '0')}`,
            patientId: `PAT-${village.name.substring(0, 3).toUpperCase()}-${100 + i}`,
            age: 5 + Math.floor(Math.random() * 70),
            symptoms: symptoms.slice(0, 2 + Math.floor(Math.random() * 3)),
            severity: severities[Math.floor(Math.random() * 3)],
            caseCount: 1 + Math.floor(Math.random() * 5),
            location: { latitude: village.latitude, longitude: village.longitude },
            villageName: village.name,
            district: village.district,
            reportedBy: 'Lakshmi Devi',
            reportedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            status: statuses[Math.floor(Math.random() * 4)],
            diseaseType: diseases[Math.floor(Math.random() * 5)],
        };
    });
}

// Generate mock water test reports
function generateWaterReports(): WaterTestReport[] {
    const sourceTypes: Array<'pump' | 'well' | 'river' | 'tank'> = ['pump', 'well', 'river', 'tank'];
    const turbidities: Array<'clear' | 'cloudy' | 'muddy'> = ['clear', 'cloudy', 'muddy'];

    return Array.from({ length: 15 }, (_, i) => {
        const village = NORTHEAST_VILLAGES[i % NORTHEAST_VILLAGES.length];
        const phLevel = 5 + Math.random() * 4; // pH between 5-9
        const turbidity = turbidities[Math.floor(Math.random() * 3)];

        // Calculate risk based on readings
        let riskLevel: RiskLevel = 'low';
        if (phLevel < 6 || phLevel > 8.5 || turbidity === 'muddy') {
            riskLevel = 'critical';
        } else if (phLevel < 6.5 || phLevel > 8 || turbidity === 'cloudy') {
            riskLevel = 'medium';
        }

        return {
            id: `WTR-${String(500 + i).padStart(4, '0')}`,
            sourceName: `${village.name} ${sourceTypes[i % 4].charAt(0).toUpperCase() + sourceTypes[i % 4].slice(1)} #${1 + (i % 3)}`,
            sourceType: sourceTypes[i % 4],
            location: { latitude: village.latitude, longitude: village.longitude },
            villageName: village.name,
            district: village.district,
            phLevel: parseFloat(phLevel.toFixed(1)),
            turbidity,
            chlorineLevel: Math.random() * 2,
            coliformPresent: Math.random() > 0.7,
            riskLevel,
            reportedBy: 'Priya Sharma',
            reportedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        };
    });
}

// Generate mock alerts
function generateAlerts(): Alert[] {
    const alertData = [
        { severity: 'critical' as AlertSeverity, title: 'Cholera Outbreak', desc: '5 confirmed cases in last 48 hours', village: 0 },
        { severity: 'critical' as AlertSeverity, title: 'Water Contamination', desc: 'E. coli detected in village well', village: 2 },
        { severity: 'warning' as AlertSeverity, title: 'High Turbidity', desc: 'Water source needs treatment', village: 3 },
        { severity: 'warning' as AlertSeverity, title: 'Symptom Cluster', desc: 'Multiple diarrhea cases reported', village: 5 },
        { severity: 'info' as AlertSeverity, title: 'Monsoon Advisory', desc: 'Increased disease risk expected', village: 7 },
    ];

    return alertData.map((alert, i) => {
        const village = NORTHEAST_VILLAGES[alert.village];
        return {
            id: `ALT-${String(100 + i).padStart(4, '0')}`,
            severity: alert.severity,
            title: alert.title,
            description: alert.desc,
            location: village.name,
            district: village.district,
            coordinates: { latitude: village.latitude, longitude: village.longitude },
            createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
            status: i < 2 ? 'active' : i < 4 ? 'investigating' : 'acknowledged',
            caseCount: alert.severity === 'critical' ? 3 + Math.floor(Math.random() * 5) : undefined,
        };
    });
}

// Export mock data
export const mockVillages = generateVillageData();
export const mockSymptomReports = generateSymptomReports();
export const mockWaterReports = generateWaterReports();
export const mockAlerts = generateAlerts();

// Dashboard statistics
export const mockDashboardStats = {
    newCases24h: mockSymptomReports.filter(r =>
        r.reportedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    waterIssues: mockWaterReports.filter(r => r.riskLevel !== 'low').length,
    syncRate: 98,
    activeAlerts: mockAlerts.filter(a => a.status === 'active').length,
    totalReports: mockSymptomReports.length + mockWaterReports.length,
    criticalZones: mockVillages.filter(v => v.riskLevel === 'critical').length,
};
