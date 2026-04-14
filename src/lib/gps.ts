export interface GPSCoordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
}

export interface GPSError {
    code: number;
    message: string;
}

/**
 * Get current GPS position with promise-based API
 */
export function getCurrentPosition(
    options?: PositionOptions
): Promise<GPSCoordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({ code: 0, message: 'Geolocation is not supported by this browser' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp,
                });
            },
            (error) => {
                let message = 'Unknown error occurred';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable. Check GPS settings.';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out. Please try again.';
                        break;
                }
                reject({ code: error.code, message });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000,
                ...options,
            }
        );
    });
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: GPSCoordinates): string {
    const lat = coords.latitude.toFixed(6);
    const lng = coords.longitude.toFixed(6);
    const latDir = coords.latitude >= 0 ? 'N' : 'S';
    const lngDir = coords.longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(parseFloat(lat))}° ${latDir}, ${Math.abs(parseFloat(lng))}° ${lngDir}`;
}

/**
 * Calculate distance between two points (Haversine formula)
 */
export function calculateDistance(
    point1: GPSCoordinates,
    point2: GPSCoordinates
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.latitude - point1.latitude);
    const dLon = toRad(point2.longitude - point1.longitude);
    const lat1 = toRad(point1.latitude);
    const lat2 = toRad(point2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Mock village coordinates for Northeast India region
 */
export const NORTHEAST_VILLAGES: Array<GPSCoordinates & {
    name: string;
    district: string;
    state: string;
}> = [
        { name: 'Nongpoh', district: 'Ri Bhoi', state: 'Meghalaya', latitude: 25.8963, longitude: 91.8753 },
        { name: 'Mawsynram', district: 'East Khasi Hills', state: 'Meghalaya', latitude: 25.2975, longitude: 91.5826 },
        { name: 'Cherrapunji', district: 'East Khasi Hills', state: 'Meghalaya', latitude: 25.2700, longitude: 91.7200 },
        { name: 'Jowai', district: 'West Jaintia Hills', state: 'Meghalaya', latitude: 25.4500, longitude: 92.2000 },
        { name: 'Tura', district: 'West Garo Hills', state: 'Meghalaya', latitude: 25.5135, longitude: 90.2131 },
        { name: 'Silchar', district: 'Cachar', state: 'Assam', latitude: 24.8333, longitude: 92.7789 },
        { name: 'Haflong', district: 'Dima Hasao', state: 'Assam', latitude: 25.1656, longitude: 93.0120 },
        { name: 'Diphu', district: 'Karbi Anglong', state: 'Assam', latitude: 25.8433, longitude: 93.4300 },
        { name: 'Kohima', district: 'Kohima', state: 'Nagaland', latitude: 25.6751, longitude: 94.1086 },
        { name: 'Dimapur', district: 'Dimapur', state: 'Nagaland', latitude: 25.9063, longitude: 93.7263 },
        { name: 'Imphal', district: 'Imphal West', state: 'Manipur', latitude: 24.8170, longitude: 93.9368 },
        { name: 'Aizawl', district: 'Aizawl', state: 'Mizoram', latitude: 23.7271, longitude: 92.7176 },
    ];

/**
 * Get nearest village from coordinates
 */
export function getNearestVillage(coords: GPSCoordinates) {
    let nearest = NORTHEAST_VILLAGES[0];
    let minDistance = Infinity;

    for (const village of NORTHEAST_VILLAGES) {
        const distance = calculateDistance(coords, village);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = village;
        }
    }

    return { village: nearest, distance: minDistance };
}
