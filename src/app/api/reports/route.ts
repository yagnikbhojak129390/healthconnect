import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all symptom reports
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const status = searchParams.get('status')

        const where = status ? { status: status.toUpperCase() as any } : {}

        const reports = await prisma.symptomReport.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                reporter: {
                    select: { name: true, email: true }
                }
            }
        })

        return NextResponse.json({ reports })
    } catch (error) {
        console.error('Error fetching reports:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        )
    }
}

// POST create new symptom report
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            patientName,
            patientAge,
            patientGender,
            symptoms,
            severity,
            villageId,
            villageName,
            district,
            latitude,
            longitude,
            notes,
            reporterId
        } = body

        if (!patientName || !symptoms || !severity || !reporterId) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            )
        }

        const report = await prisma.symptomReport.create({
            data: {
                patientName,
                patientAge: parseInt(patientAge),
                patientGender,
                symptoms,
                severity: severity.toUpperCase(),
                villageId,
                villageName,
                district,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                notes,
                reporterId,
            }
        })

        return NextResponse.json({ success: true, report }, { status: 201 })
    } catch (error) {
        console.error('Error creating report:', error)
        return NextResponse.json(
            { error: 'Failed to create report' },
            { status: 500 }
        )
    }
}
