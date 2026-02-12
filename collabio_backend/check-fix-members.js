require('dotenv/config');
const mongoose = require('mongoose');

async function checkAndFix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const RoleModel = mongoose.model('Role', new mongoose.Schema({
      name: String,
      permissions: [String]
    }));

    const MemberModel = mongoose.model('Member', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      workspaceId: mongoose.Schema.Types.ObjectId,
      role: mongoose.Schema.Types.ObjectId
    }));

    // Check all members
    const allMembers = await MemberModel.find({});
    console.log(`Total members: ${allMembers.length}`);
    
    for (const member of allMembers) {
      console.log(`Member ${member._id}: role = ${member.role}`);
    }

    // Get OWNER role
    const ownerRole = await RoleModel.findOne({ name: 'OWNER' });
    console.log(`\nOWNER role ID: ${ownerRole._id}`);

    // Update ALL members to have OWNER role
    const result = await MemberModel.updateMany(
      {},
      { $set: { role: ownerRole._id } }
    );
    
    console.log(`\nUpdated ${result.modifiedCount} members`);

    // Verify
    const updatedMembers = await MemberModel.find({}).populate('role');
    console.log('\nVerification:');
    for (const member of updatedMembers) {
      console.log(`Member ${member._id}: role = ${member.role?.name || 'NULL'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAndFix();
