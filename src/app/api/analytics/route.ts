import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        // Get total counts
        const [totalReports, totalWaterTests, totalAlerts, totalUsers] = await Promise.all([
            prisma.symptomReport.count(),
            prisma.waterTest.count(),
            prisma.alert.count(),
            prisma.user.count(),
        ])

        // Get reports by severity
        const [severeReports, moderateReports, mildReports] = await Promise.all([
            prisma.symptomReport.count({ where: { severity: 'SEVERE' } }),
            prisma.symptomReport.count({ where: { severity: 'MODERATE' } }),
            prisma.symptomReport.count({ where: { severity: 'MILD' } }),
        ])

        // Get water tests by risk level
        const [criticalWater, highWater, mediumWater, lowWater] = await Promise.all([
            prisma.waterTest.count({ where: { riskLevel: 'CRITICAL' } }),
            prisma.waterTest.count({ where: { riskLevel: 'HIGH' } }),
            prisma.waterTest.count({ where: { riskLevel: 'MEDIUM' } }),
            prisma.waterTest.count({ where: { riskLevel: 'LOW' } }),
        ])

        // Get alerts by status
        const [activeAlerts, acknowledgedAlerts, resolvedAlerts] = await Promise.all([
            prisma.alert.count({ where: { status: 'ACTIVE' } }),
            prisma.alert.count({ where: { status: 'ACKNOWLEDGED' } }),
            prisma.alert.count({ where: { status: 'RESOLVED' } }),
        ])

        // Get reports from last 24 hours
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const reportsLast24h = await prisma.symptomReport.count({
            where: { createdAt: { gte: last24h } }
        })

        // Get weekly trend data (last 7 days)
        const weeklyData = []
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)
            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)

            const [cases, waterIssues, resolved] = await Promise.all([
                prisma.symptomReport.count({
                    where: {
                        createdAt: { gte: date, lt: nextDate }
                    }
                }),
                prisma.waterTest.count({
                    where: {
                        createdAt: { gte: date, lt: nextDate },
                        riskLevel: { in: ['HIGH', 'CRITICAL'] }
                    }
                }),
                prisma.symptomReport.count({
                    where: {
                        status: 'RESOLVED',
                        updatedAt: { gte: date, lt: nextDate }
                    }
                }),
            ])

            weeklyData.push({
                name: days[date.getDay()],
                cases,
                waterIssues,
                resolved,
            })
        }

        // Get disease distribution from symptoms/notes
        const symptomReports = await prisma.symptomReport.findMany({
            select: { symptoms: true, notes: true }
        })

        const diseaseDistribution: Record<string, number> = {
            cholera: 0,
            typhoid: 0,
            hepatitis_a: 0,
            diarrhea: 0,
            dysentery: 0,
            other: 0,
        }

        symptomReports.forEach(report => {
            const symptomsStr = (report.symptoms?.join(' ') + ' ' + (report.notes || '')).toLowerCase()
            if (symptomsStr.includes('cholera')) diseaseDistribution.cholera++
            else if (symptomsStr.includes('typhoid')) diseaseDistribution.typhoid++
            else if (symptomsStr.includes('hepatitis')) diseaseDistribution.hepatitis_a++
            else if (symptomsStr.includes('dysentery')) diseaseDistribution.dysentery++
            else if (symptomsStr.includes('diarrhea')) diseaseDistribution.diarrhea++
            else diseaseDistribution.other++
        })

        // Get unique districts/villages with case counts (risk zones)
        const villageStats = await prisma.symptomReport.groupBy({
            by: ['villageName', 'district'],
            _count: { id: true },
        })

        const riskDistribution = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        }

        villageStats.forEach(v => {
            const count = v._count.id
            if (count >= 10) riskDistribution.critical++
            else if (count >= 5) riskDistribution.high++
            else if (count >= 2) riskDistribution.medium++
            else riskDistribution.low++
        })

        return NextResponse.json({
            summary: {
                totalReports,
                totalWaterTests,
                totalAlerts,
                totalUsers,
                reportsLast24h,
                severeReports,
                moderateReports,
                mildReports,
                activeAlerts,
                waterIssues: criticalWater + highWater,
            },
            waterTestsByRisk: {
                critical: criticalWater,
                high: highWater,
                medium: mediumWater,
                low: lowWater,
            },
            alertsByStatus: {
                active: activeAlerts,
                acknowledged: acknowledgedAlerts,
                resolved: resolvedAlerts,
            },
            weeklyTrend: weeklyData,
            diseaseDistribution: Object.entries(diseaseDistribution).map(([name, value]) => ({ name, value })),
            riskDistribution: Object.entries(riskDistribution).map(([name, value]) => ({ name, value })),
            criticalZones: riskDistribution.critical,
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        )
    }
}
