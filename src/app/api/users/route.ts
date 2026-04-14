import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all users (admin only)
export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                district: true,
                village: true,
                phone: true,
                isActive: true,
                createdAt: true,
                lastLogin: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        // Transform role to lowercase to match frontend expectations
        const transformedUsers = users.map(user => ({
            ...user,
            role: user.role.toLowerCase(),
        }))

        return NextResponse.json({ users: transformedUsers })
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

// POST create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, role, district, village, phone } = body

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email and password are required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            )
        }

        // Create user (in production, hash password with bcrypt)
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password, // TODO: Hash this in production
                role: role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'HEALTH_WORKER',
                district,
                village,
                phone,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                district: true,
                village: true,
                isActive: true,
                createdAt: true,
            }
        })

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                role: user.role.toLowerCase(),
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )
    }
}
