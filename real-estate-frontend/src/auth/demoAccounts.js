export const DEMO_ACCOUNTS = {
  admin: {
    id: 'demo-admin',
    name: 'DigiCaptain Admin',
    email: 'admin@digicaptain.com',
    role: 'ADMIN',
    phone: '+91 99999 00001',
    password: 'password123',
    title: 'Platform Administrator'
  },
  owner: {
    id: 'demo-owner',
    name: 'Rajesh Sharma (Owner)',
    email: 'owner@digicaptain.com',
    role: 'OWNER',
    phone: '+91 99999 00002',
    password: 'password123',
    title: 'Direct Property Owner'
  },
  agent: {
    id: 'demo-agent',
    name: 'Amit Patel (Verified Agent)',
    email: 'agent@digicaptain.com',
    role: 'AGENT',
    phone: '+91 99999 00003',
    password: 'password123',
    title: 'Certified Channel Partner'
  }
};

export function findDemoAccount(email, password) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  for (const key of Object.keys(DEMO_ACCOUNTS)) {
    const acc = DEMO_ACCOUNTS[key];
    if (acc.email.toLowerCase() === cleanEmail) {
      if (
        !password ||
        password === acc.password ||
        password === `${key}123` ||
        password === 'admin123' ||
        password === 'owner123' ||
        password === 'agent123'
      ) {
        return acc;
      }
    }
  }
  return null;
}
