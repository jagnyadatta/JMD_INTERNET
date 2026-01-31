import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

// Import models
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional)
    await Admin.deleteMany({});
    await Service.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create super admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', salt);

    const admin = await Admin.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@jmdinternet.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });

    console.log('✅ Super admin created:', {
      email: admin.email,
      password: process.env.ADMIN_PASSWORD || 'Admin@12345'
    });

    // Create sample services
    const sampleServices = [
      {
        title: 'Caste Certificate',
        icon: 'certificate',
        description: 'Apply for caste certificate with verified documents',
        fullDescription: 'Get your caste certificate issued by the competent authority. We help with application filing, document verification, and fast track processing.',
        processingTime: '3-7 Working Days',
        documents: [
          'Aadhar Card',
          'Ration Card',
          'School Leaving Certificate',
          'Affidavit for caste declaration',
          'Passport Size Photographs',
          'Residence Proof'
        ],
        isActive: true,
        order: 1
      },
      {
        title: 'PAN Card in 3 Hours',
        icon: 'credit-card',
        description: 'Instant PAN card application and processing',
        fullDescription: 'Apply for new PAN card or update existing PAN details with express processing.',
        processingTime: '3-24 Hours',
        documents: [
          'Aadhar Card',
          'Passport Size Photograph',
          'Date of Birth Proof',
          'Address Proof',
          'Signature',
          'Mobile Number linked with Aadhar'
        ],
        isActive: true,
        order: 2
      },
      {
        title: 'Income Certificate',
        icon: 'money',
        description: 'Certified income proof for scholarships and schemes',
        fullDescription: 'Get income certificate for educational scholarships, government schemes, and financial assistance programs.',
        processingTime: '5-10 Working Days',
        documents: [
          'Aadhar Card',
          'PAN Card',
          'Salary Slips (last 3 months)',
          'Bank Statement (last 6 months)',
          'Form 16/ITR',
          'Employer Certificate'
        ],
        isActive: true,
        order: 3
      }
    ];

    const services = await Service.insertMany(sampleServices);
    console.log(`✅ Created ${services.length} sample services`);

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the server: npm run dev');
    console.log('2. Access admin panel: http://localhost:5000/api/admin/login');
    console.log('3. Use credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();