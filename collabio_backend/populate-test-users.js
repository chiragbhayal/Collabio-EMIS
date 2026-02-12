const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Account Schema (simplified)
const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  refreshToken: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);

// Workspace Schema (simplified)
const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

// Member Schema (simplified)
const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'MEMBER'], default: 'MEMBER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

const testUsers = [
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'testpassword123'
  },
  {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com', 
    password: 'demopassword123'
  },
  {
    firstName: 'Sample',
    lastName: 'User',
    email: 'sample@example.com',
    password: 'samplepassword123'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'johnpassword123'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'janepassword123'
  }
];

async function populateTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing test users and their accounts
    const testEmails = testUsers.map(user => user.email);
    await User.deleteMany({ email: { $in: testEmails } });
    await Account.deleteMany({ providerId: { $in: testEmails } });
    console.log('Cleared existing test users and accounts');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(testUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword
      };
    }));

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} test users:`);
    
    createdUsers.forEach((user, index) => {
      console.log(`✅ ${user.email} (password: ${testUsers[index].password})`);
    });

    // Create corresponding Account records for each user
    const accountPromises = createdUsers.map(async (user, index) => {
      const account = new Account({
        userId: user._id,
        provider: 'EMAIL',
        providerId: user.email
      });
      return account.save();
    });

    const createdAccounts = await Promise.all(accountPromises);
    console.log(`✅ Created ${createdAccounts.length} email account records`);

    // Create a test workspace for the first user (skip workspace creation to avoid duplicate key error)
    console.log('\nSkipping workspace creation to avoid duplicate key error...');
    console.log('✅ Users and accounts are ready for login!');

    console.log('\n🎉 Test users populated successfully!');
    console.log('\n📝 You can now login with any of these accounts:');
    testUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error('Error populating test users:', error);
  } finally {
    mongoose.connection.close();
  }
}

populateTestUsers();