import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await hash('demo123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@fieldflow.com' },
    update: {},
    create: {
      email: 'demo@fieldflow.com',
      name: 'Mike Johnson',
      password: hashedPassword,
      businessName: 'MJ HVAC Services',
      tradeType: 'HVAC',
      phone: '(555) 123-4567',
    },
  });

  console.log('Created user:', user.email);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        phone: '(555) 123-4567',
        address: '123 Oak St, Springfield, IL',
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Mike Smith',
        email: 'mike@email.com',
        phone: '(555) 987-6543',
        address: '456 Pine Ave, Springfield, IL',
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'David Wilson',
        email: 'david@email.com',
        phone: '(555) 456-7890',
        address: '789 Elm Dr, Springfield, IL',
        userId: user.id,
      },
    }),
  ]);

  console.log('Created', customers.length, 'customers');

  // Create jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'HVAC Repair - Johnson Residence',
        description: 'AC unit not cooling properly. Customer mentioned strange noise from compressor.',
        status: 'IN_PROGRESS',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 120,
        price: 347.50,
        customerId: customers[0].id,
        userId: user.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Furnace Maintenance - Smith Home',
        description: 'Annual furnace check and filter replacement.',
        status: 'COMPLETED',
        scheduledAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        duration: 60,
        price: 149.00,
        customerId: customers[1].id,
        userId: user.id,
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    }),
    prisma.job.create({
      data: {
        title: 'AC Installation Quote - Wilson Property',
        description: 'Quote for new AC unit installation.',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        customerId: customers[2].id,
        userId: user.id,
      },
    }),
  ]);

  console.log('Created', jobs.length, 'jobs');

  // Create invoice for completed job
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-001',
      status: 'PAID',
      total: 149.00,
      notes: 'Thank you for your business!',
      paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      customerId: customers[1].id,
      userId: user.id,
      jobId: jobs[1].id,
    },
  });

  // Create invoice items
  await prisma.invoiceItem.create({
    data: {
      description: 'Furnace Maintenance',
      quantity: 1,
      unitPrice: 149.00,
      total: 149.00,
      invoiceId: invoice.id,
    },
  });

  console.log('Created invoice:', invoice.invoiceNumber);
  console.log('\n✅ Seed complete!');
  console.log('Login with: demo@fieldflow.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
