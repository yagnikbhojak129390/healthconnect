// User Roles - Simplified to 2 roles
export type UserRole = 'admin' | 'health_worker';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    district?: string;
    village?: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    lastLogin?: Date;
    isActive: boolean;
}

export interface RolePermissions {
    canManageUsers: boolean;
    canViewAllData: boolean;
    canBroadcast: boolean;
    canResolveAlerts: boolean;
    canSubmitReports: boolean;
    canViewOwnReports: boolean;
    canAccessMap: boolean;
    canExportData: boolean;
    canViewAnalytics: boolean;
    canManageResources: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
    admin: {
        canManageUsers: true,
        canViewAllData: true,
        canBroadcast: true,
        canResolveAlerts: true,
        canSubmitReports: true,
        canViewOwnReports: true,
        canAccessMap: true,
        canExportData: true,
        canViewAnalytics: true,
        canManageResources: true,
    },
    health_worker: {
        canManageUsers: false,
        canViewAllData: false,
        canBroadcast: false,
        canResolveAlerts: false,
        canSubmitReports: true,
        canViewOwnReports: true,
        canAccessMap: true,
        canExportData: false,
        canViewAnalytics: false,
        canManageResources: false,
    },
};

export const ROLE_LABELS: Record<UserRole, string> = {
    admin: 'System Administrator',
    health_worker: 'Health Worker',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    admin: 'Full system access including user management, analytics, and broadcast capabilities',
    health_worker: 'Field operations including symptom reporting, water testing, and task management',
};
