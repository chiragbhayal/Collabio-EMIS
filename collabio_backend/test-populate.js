require('dotenv/config');
const mongoose = require('mongoose');

async function testPopulate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const RoleSchema = new mongoose.Schema({
      name: String,
      permissions: [String]
    }, { timestamps: true });

    const MemberSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
      role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
    }, { timestamps: true });

    const RoleModel = mongoose.model('Role', RoleSchema);
    const MemberModel = mongoose.model('Member', MemberSchema);

    // Test populate
    const member = await MemberModel.findOne({}).populate('role');
    console.log('\nMember with populated role:');
    console.log(JSON.stringify(member, null, 2));

    if (member && member.role) {
      console.log(`\nRole name: ${member.role.name}`);
      console.log(`Role permissions: ${member.role.permissions}`);
    } else {
      console.log('\nRole is NULL or not populated!');
      
      // Check if role exists
      const roleId = member.role || member.toObject().role;
      console.log(`\nRole ID in member: ${roleId}`);
      
      const role = await RoleModel.findById(roleId);
      console.log(`\nDirect role lookup: ${role ? role.name : 'NOT FOUND'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPopulate();
