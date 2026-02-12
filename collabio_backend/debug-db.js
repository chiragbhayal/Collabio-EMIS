require('dotenv/config');
const mongoose = require('mongoose');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    collections.forEach(c => console.log(`- ${c.name}`));

    // Check roles collection
    const rolesCollection = mongoose.connection.db.collection('roles');
    const roles = await rolesCollection.find({}).toArray();
    console.log(`\nRoles in database: ${roles.length}`);
    roles.forEach(r => console.log(`- ${r._id}: ${r.name}`));

    // Check members collection
    const membersCollection = mongoose.connection.db.collection('members');
    const members = await membersCollection.find({}).toArray();
    console.log(`\nMembers in database: ${members.length}`);
    members.forEach(m => console.log(`- ${m._id}: role=${m.role}`));

    // Now fix with correct collection name
    const ownerRole = roles.find(r => r.name === 'OWNER');
    if (ownerRole) {
      console.log(`\nUpdating members to use OWNER role: ${ownerRole._id}`);
      const result = await membersCollection.updateMany(
        {},
        { $set: { role: ownerRole._id } }
      );
      console.log(`Updated ${result.modifiedCount} members`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debug();
