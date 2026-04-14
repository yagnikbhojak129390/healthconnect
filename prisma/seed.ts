import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@healthconnect.gov.in' },
        update: {},
        create: {
            name: 'Yagnik',
            email: 'admin@healthconnect.gov.in',
            password: 'admin123', // In production, hash this
            role: 'ADMIN',
            district: 'Kamrup',
            phone: '+91 9876543210',
            isActive: true,
        },
    })

    // Create health workers
    const worker1 = await prisma.user.upsert({
        where: { email: 'yagnik@healthconnect.gov.in' },
        update: {},
        create: {
            name: 'Yagnik',
            email: 'yagnik@healthconnect.gov.in',
            password: 'worker123',
            role: 'HEALTH_WORKER',
            district: 'East Khasi Hills',
            village: 'Shillong',
            phone: '+91 9876543211',
            isActive: true,
        },
    })

    const worker2 = await prisma.user.upsert({
        where: { email: 'lakshmi@healthconnect.gov.in' },
        update: {},
        create: {
            name: 'Lakshmi Devi',
            email: 'lakshmi@healthconnect.gov.in',
            password: 'worker123',
            role: 'HEALTH_WORKER',
            district: 'Ri Bhoi',
            village: 'Nongpoh',
            phone: '+91 9876543212',
            isActive: true,
        },
    })

    // Create sample villages
    const villages = [
        { name: 'Nongpoh', district: 'Ri Bhoi', population: 15000, latitude: 25.9019, longitude: 91.8898, riskLevel: 'MEDIUM' as const },
        { name: 'Shillong', district: 'East Khasi Hills', population: 150000, latitude: 25.5788, longitude: 91.8933, riskLevel: 'LOW' as const },
        { name: 'Tura', district: 'West Garo Hills', population: 80000, latitude: 25.5152, longitude: 90.2244, riskLevel: 'HIGH' as const },
        { name: 'Jowai', district: 'West Jaintia Hills', population: 25000, latitude: 25.4518, longitude: 92.2032, riskLevel: 'LOW' as const },
    ]

    for (const village of villages) {
        await prisma.village.upsert({
            where: { id: village.name.toLowerCase() },
            update: {},
            create: {
                id: village.name.toLowerCase(),
                ...village,
            },
        })
    }

    console.log('Seeding finished.')
    console.log({ admin, worker1, worker2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
