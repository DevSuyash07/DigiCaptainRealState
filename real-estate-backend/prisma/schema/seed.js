import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 🇮🇳 Real Indian Cities & Localities Data
const cityData = {
  'Mumbai': ['Bandra West', 'Andheri East', 'Powai', 'Malad West', 'Goregaon'],
  'Delhi': ['Dwarka', 'Vasant Kunj', 'Greater Kailash', 'Rohini', 'Lajpat Nagar'],
  'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City'],
  'Noida': ['Sector 15', 'Sector 62', 'Sector 137', 'Sector 44', 'Sector 75'],
  'Gurgaon': ['DLF Phase 1', 'Sector 56', 'Sohna Road', 'Golf Course Road', 'Sector 82'],
  'Pune': ['Hinjewadi', 'Koregaon Park', 'Viman Nagar', 'Kothrud', 'Wakad'],
  'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Gachibowli', 'Kondapur']
};

async function main() {
  console.log('🌱 Sensible Seeding started... Please wait.');

  // 1. Clean existing data
  console.log('Cleaning old data...');
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // 2. Generate Users
  console.log('Generating users...');
  const roles = ['USER', 'OWNER', 'AGENT', 'BUILDER', 'ADMIN'];
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Deterministic demo accounts for Admin, Owner, and Agent
  const demoUsers = [
    {
      name: 'DigiCaptain Admin',
      email: 'admin@digicaptain.com',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
    {
      name: 'Rajesh Sharma (Owner)',
      email: 'owner@digicaptain.com',
      password: hashedPassword,
      role: 'OWNER',
      emailVerified: true,
    },
    {
      name: 'Amit Patel (Verified Agent)',
      email: 'agent@digicaptain.com',
      password: hashedPassword,
      role: 'AGENT',
      emailVerified: true,
    }
  ];
  await prisma.user.createMany({ data: demoUsers, skipDuplicates: true });

  const fakeUsers = [];
  for (let i = 0; i < 50; i++) {
    fakeUsers.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: faker.helpers.arrayElement(roles),
      emailVerified: true,
    });
  }

  await prisma.user.createMany({ data: fakeUsers, skipDuplicates: true });

  const eligibleListers = await prisma.user.findMany({
    where: { role: { in: ['OWNER', 'AGENT', 'BUILDER'] } },
  });

  // 3. Generate Realistic Properties
  console.log('Generating realistic properties...');
  const fakeProperties = [];

  for (const user of eligibleListers) {
    const numProperties = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < numProperties; i++) {
      // Choose City and a real Locality within that city
      const cityNames = Object.keys(cityData);
      const city = faker.helpers.arrayElement(cityNames);
      const locality = faker.helpers.arrayElement(cityData[city]);

      const propFor = faker.helpers.arrayElement(['SALE', 'RENT']);
      
      // Determine logical property type and BHK
      let type, bhkCount, isPlot = false;
      const randomChoice = Math.random();
      
      if (randomChoice < 0.1) {
        type = 'PLOT';
        isPlot = true;
        bhkCount = null;
      } else if (randomChoice < 0.3) {
        type = 'VILLA';
        bhkCount = faker.number.int({ min: 3, max: 6 });
      } else if (randomChoice < 0.5) {
        type = 'INDEPENDENT_HOUSE';
        bhkCount = faker.number.int({ min: 2, max: 4 });
      } else {
        type = faker.helpers.arrayElement(['APARTMENT', 'BUILDER_FLOOR']);
        bhkCount = faker.number.int({ min: 1, max: 4 });
      }

      // Logical Bathrooms (equal to BHK or +1)
      const bathCount = isPlot ? null : bhkCount + faker.number.int({ min: 0, max: 1 }); 

      // Logical Area based on BHK
      let builtUpArea = isPlot 
        ? faker.number.int({ min: 1000, max: 10000 }) 
        : (bhkCount * faker.number.int({ min: 450, max: 700 }));

      // Logical Pricing
      let price = 0;
      if (propFor === 'RENT') {
        const ratePerSqFt = faker.number.int({ min: 20, max: 40 });
        price = builtUpArea * ratePerSqFt;
        price = Math.round(price / 1000) * 1000;
      } else {
        const ratePerSqFt = faker.number.int({ min: 5000, max: 15000 });
        price = builtUpArea * ratePerSqFt;
        price = Math.round(price / 100000) * 100000;
      }

      const title = isPlot 
        ? `Premium ${builtUpArea} sq.ft Plot in ${locality}, ${city}` 
        : `Beautiful ${bhkCount} BHK ${type.replace('_', ' ')} in ${locality}`;

      const desc = isPlot 
        ? `Excellent investment opportunity! A prime plot of ${builtUpArea} sq.ft is available for ${propFor.toLowerCase()} in the highly sought-after area of ${locality}, ${city}. Close to all major amenities.`
        : `Spacious and well-ventilated ${bhkCount} BHK ${type.toLowerCase()} available for ${propFor.toLowerCase()} in ${locality}, ${city}. This property features ${bathCount} modern bathrooms, premium fittings, and a total built-up area of ${builtUpArea} sq.ft. Perfect for families looking for a comfortable lifestyle.`;

      fakeProperties.push({
        ownerId: user.id,
        title: title,
        description: desc,
        propertyFor: propFor,
        propertyType: type,
        propertyStatus: faker.helpers.arrayElement(['READY_TO_MOVE', 'UNDER_CONSTRUCTION']),
        price: price,
        builtUpArea: builtUpArea,
        bedrooms: bhkCount,
        bathrooms: bathCount,
        furnishingStatus: isPlot ? null : faker.helpers.arrayElement(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']),
        address: `${faker.number.int({min: 1, max: 500})}, ${locality}`,
        locality: locality,
        city: city,
        state: 'State',
      });
    }
  }

  await prisma.property.createMany({ data: fakeProperties });

  // 4. Generate Images
  console.log('Generating images...');
  const allProperties = await prisma.property.findMany({ select: { id: true, propertyType: true } });
  const fakeImages = [];

  for (const prop of allProperties) {
    const numImages = faker.number.int({ min: 2, max: 4 });

    for (let i = 0; i < numImages; i++) {
      fakeImages.push({
        propertyId: prop.id,
        // ✨ FIX: Picsum ki reliable API lagayi gayi hai. Unsplash hata diya gaya.
        url: `https://picsum.photos/seed/${prop.id}-${i}/800/600`, 
        isCover: i === 0,
      });
    }
  }

  await prisma.propertyImage.createMany({ data: fakeImages });

  console.log(`✅ Sensible Seeding Complete!`);
  console.log(`- Properties Created: ${fakeProperties.length}`);
  console.log(`🔑 Login email from DB with password: password123`);
}

main()
  .catch((e) => {
    console.error('Error in seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });