require('dotenv/config');
const mongoose = require('mongoose');

const RolePermissions = {
  OWNER: [
    'CREATE_WORKSPACE', 'EDIT_WORKSPACE', 'DELETE_WORKSPACE', 'MANAGE_WORKSPACE_SETTINGS',
    'ADD_MEMBER', 'CHANGE_MEMBER_ROLE', 'REMOVE_MEMBER',
    'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT',
    'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_ONLY'
  ],
  ADMIN: [
    'ADD_MEMBER', 'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT',
    'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'MANAGE_WORKSPACE_SETTINGS', 'VIEW_ONLY'
  ],
  MEMBER: ['VIEW_ONLY', 'CREATE_TASK', 'EDIT_TASK']
};

async function fixRoles() {
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

    // Seed roles
    console.log('Seeding roles...');
    await RoleModel.deleteMany({});
    
    for (const [roleName, permissions] of Object.entries(RolePermissions)) {
      await RoleModel.create({ name: roleName, permissions });
      console.log(`Created role: ${roleName}`);
    }

    // Fix existing members with null roles
    const ownerRole = await RoleModel.findOne({ name: 'OWNER' });
    const membersWithNullRole = await MemberModel.find({ role: null });
    
    console.log(`Found ${membersWithNullRole.length} members with null roles`);
    
    for (const member of membersWithNullRole) {
      member.role = ownerRole._id;
      await member.save();
      console.log(`Fixed member: ${member._id}`);
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixRoles();
