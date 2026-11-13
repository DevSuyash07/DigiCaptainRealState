// Ek asli ADMIN account banata hai (ya mojooda user ko ADMIN bana deta hai).
//
// Kyun zaroorat padi: prisma/schema/seed.js faker se random emails banata hai,
// to login karne layak koi admin account kabhi exist nahi karta tha. Platform
// ke admin routes (GET /api/v1/users, kisi bhi property ka update/delete)
// sirf role === 'ADMIN' walon ke liye khulte hain.
//
// Chalane ka tarika (backend folder se):
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='ek-lamba-password' \
//   ADMIN_NAME='Your Name' npm run create:admin
//
// Password sirf env se aata hai -- is file me koi default password nahi hai,
// aur kuch bhi plain text me store nahi hota (bcrypt hash hi DB me jaata hai).
// Dobara chalane par wahi account update hota hai, duplicate nahi banta.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || '');
const name = String(process.env.ADMIN_NAME || '').trim() || 'Platform Admin';

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

async function main() {
  if (!email || email.indexOf('@') < 1) {
    fail('ADMIN_EMAIL is missing or does not look like an email address. Nothing was created.');
  }
  if (password.length < 10) {
    fail('ADMIN_PASSWORD is missing or shorter than 10 characters. Nothing was created.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          status: 'ACTIVE',
          password: passwordHash,
          passwordChangedAt: new Date(),
          emailVerified: true,
          emailVerifiedAt: existing.emailVerifiedAt || new Date(),
          deletedAt: null
        }
      })
    : await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
          emailVerifiedAt: new Date()
        }
      });

  console.log(
    existing
      ? `✅ Existing user ${user.email} (id ${user.id}) is now ADMIN, with the password you passed in.`
      : `✅ ADMIN account created: ${user.email} (id ${user.id}).`
  );
  console.log('   Sign in with that email and the ADMIN_PASSWORD you passed in.');
  console.log('   The password itself is not printed and is stored only as a bcrypt hash.');
}

main()
  .catch((e) => {
    console.error('Error creating the admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
