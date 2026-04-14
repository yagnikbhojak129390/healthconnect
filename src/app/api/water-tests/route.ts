import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all water tests
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const riskLevel = searchParams.get('riskLevel')

        const where = riskLevel ? { riskLevel: riskLevel.toUpperCase() as any } : {}

        const waterTests = await prisma.waterTest.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                reporter: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json({ waterTests })
    } catch (error) {
        console.error('Error fetching water tests:', error)
        return NextResponse.json(
            { error: 'Failed to fetch water tests' },
            { status: 500 }
        )
    }
}

// POST create new water test
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            sourceName,
            sourceType,
            latitude,
            longitude,
            district,
            villageName,
            phLevel,
            turbidity,
            chlorine,
            coliforms,
            riskLevel,
            notes,
            reporterId
        } = body

        if (!sourceName || !sourceType || !reporterId) {
            return NextResponse.json(
                { error: 'Required fields missing' },
                { status: 400 }
            )
        }

        const waterTest = await prisma.waterTest.create({
            data: {
                sourceName,
                sourceType: sourceType.toUpperCase(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                district,
                villageName,
                phLevel: parseFloat(phLevel),
                turbidity: parseFloat(turbidity),
                chlorine: chlorine ? parseFloat(chlorine) : null,
                coliforms: coliforms || false,
                riskLevel: riskLevel?.toUpperCase() || 'LOW',
                notes,
                reporterId,
            }
        })

        return NextResponse.json({ success: true, waterTest }, { status: 201 })
    } catch (error) {
        console.error('Error creating water test:', error)
        return NextResponse.json(
            { error: 'Failed to create water test' },
            { status: 500 }
        )
    }
}
