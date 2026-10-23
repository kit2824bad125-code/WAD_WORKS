import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seed...');
  const passwordHash = await bcrypt.hash('FixNear@123', 10);

  // 1. Categories
  const categories = [
    { name: 'Electrical', slug: 'electrical', description: 'Expert electricians for wiring, switches, lighting, and power fixes', iconName: 'Zap', displayOrder: 1 },
    { name: 'Plumbing', slug: 'plumbing', description: 'Pipes, leak repairs, taps, bathroom fittings, and motor installation', iconName: 'Wrench', displayOrder: 2 },
    { name: 'AC & Cooling', slug: 'ac-cooling', description: 'AC servicing, gas charging, filter cleanup, installation, and PCB repair', iconName: 'Wind', displayOrder: 3 },
    { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Washing machine, refrigerator, microwave, and TV diagnostics & repair', iconName: 'Tv', displayOrder: 4 },
    { name: 'Laptop & Mobile Repair', slug: 'laptop-mobile', description: 'Screen replacement, battery, software, motherboard, and OS servicing', iconName: 'Laptop', displayOrder: 5 },
    { name: 'Car Services', slug: 'car-services', description: 'Car breakdown, battery jumpstart, periodic maintenance, and denting', iconName: 'Car', displayOrder: 6 },
    { name: 'Bike Services', slug: 'bike-services', description: 'Two-wheeler doorstep servicing, puncture repair, and engine tuning', iconName: 'Bike', displayOrder: 7 },
    { name: 'Carpentry', slug: 'carpentry', description: 'Furniture repair, door locks, modular kitchen woodwork, and drilling', iconName: 'Hammer', displayOrder: 8 },
    { name: 'Painting', slug: 'painting', description: 'Interior/exterior wall painting, waterproof coating, and touch-up work', iconName: 'Paintbrush', displayOrder: 9 },
    { name: 'Cleaning', slug: 'cleaning', description: 'Full home deep cleaning, bathroom sanitization, and sofa shampooing', iconName: 'Sparkles', displayOrder: 10 },
    { name: 'Pest Control', slug: 'pest-control', description: 'Cockroach, termite, bed bug, and mosquito management treatment', iconName: 'Bug', displayOrder: 11 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600',
        isActive: true,
      },
    });
  }

  // 2. Demo Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fixnear.dev' },
    update: {},
    create: {
      email: 'admin@fixnear.dev',
      passwordHash,
      name: 'FixNear Super Admin',
      phone: '9876543210',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@fixnear.dev' },
    update: {},
    create: {
      email: 'customer@fixnear.dev',
      passwordHash,
      name: 'Rohan Sharma',
      phone: '9840123456',
      role: 'CUSTOMER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      isEmailVerified: true,
      isPhoneVerified: true,
      customerProfile: {
        create: {
          preferredLanguage: 'English',
        },
      },
    },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@fixnear.dev' },
    update: {},
    create: {
      email: 'provider@fixnear.dev',
      passwordHash,
      name: 'Arun Kumar',
      phone: '9841234567',
      role: 'SERVICE_PROVIDER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      isEmailVerified: true,
      isPhoneVerified: true,
      providerProfile: {
        create: {
          businessName: 'Arun Electricals & Cooling',
          description: 'Licensed electrical master and certified AC technician with over 11 years of experience in domestic and commercial repairs.',
          status: 'VERIFIED',
          isAvailable: true,
          isEmergencyAvailable: true,
          experienceYears: 11,
          serviceRadiusKm: 20,
          rating: 4.9,
          reviewCount: 142,
          completedJobsCount: 218,
          responseRatePercent: 99,
          cancellationRatePercent: 1.2,
          address: {
            create: {
              street: '14, 2nd Avenue, Anna Nagar',
              city: 'Chennai',
              state: 'Tamil Nadu',
              postalCode: '600040',
              country: 'India',
              latitude: 13.0850,
              longitude: 80.2100,
            },
          },
        },
      },
    },
  });

  console.log('✅ Seed completed successfully: Created categories, demo admin, customer, and provider profiles.');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
