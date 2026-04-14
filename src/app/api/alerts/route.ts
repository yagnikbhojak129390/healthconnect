import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all alerts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '50')

        const where = status ? { status: status.toUpperCase() as any } : {}

        const alerts = await prisma.alert.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json({ alerts })
    } catch (error) {
        console.error('Error fetching alerts:', error)
        return NextResponse.json(
            { error: 'Failed to fetch alerts' },
            { status: 500 }
        )
    }
}

// POST create new alert
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, description, severity, location, district, createdById } = body

        if (!title || !severity || !location || !createdById) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            )
        }

        const alert = await prisma.alert.create({
            data: {
                title,
                description: description || '',
                severity: severity.toUpperCase(),
                location,
                district: district || '',
                createdById,
            }
        })

        return NextResponse.json({ success: true, alert }, { status: 201 })
    } catch (error) {
        console.error('Error creating alert:', error)
        return NextResponse.json(
            { error: 'Failed to create alert' },
            { status: 500 }
        )
    }
}
