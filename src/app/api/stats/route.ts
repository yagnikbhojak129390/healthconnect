import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET dashboard stats from database
export async function GET(request: NextRequest) {
    try {
        // Get counts from database
        const [
            newCases24h,
            waterIssues,
            criticalZones,
            totalReports,
            activeAlerts,
            totalUsers,
            activeWorkers
        ] = await Promise.all([
            // New symptom reports in last 24 hours
            prisma.symptomReport.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            }),
            // Water tests with HIGH or CRITICAL risk
            prisma.waterTest.count({
                where: {
                    riskLevel: { in: ['HIGH', 'CRITICAL'] }
                }
            }),
            // Villages with HIGH or CRITICAL risk
            prisma.village.count({
                where: {
                    riskLevel: { in: ['HIGH', 'CRITICAL'] }
                }
            }),
            // Total reports
            prisma.symptomReport.count(),
            // Active alerts
            prisma.alert.count({
                where: {
                    status: { in: ['ACTIVE', 'ACKNOWLEDGED'] }
                }
            }),
            // Total users
            prisma.user.count(),
            // Active health workers
            prisma.user.count({
                where: {
                    role: 'HEALTH_WORKER',
                    isActive: true
                }
            })
        ])

        return NextResponse.json({
            newCases24h,
            waterIssues,
            criticalZones,
            syncRate: 98, // This would be calculated from actual sync data
            totalReports,
            activeAlerts,
            totalUsers,
            activeWorkers
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
