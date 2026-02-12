const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ===============================
// SCHEMAS (Simplified)
// ===============================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  currentWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true, unique: true },
  refreshToken: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  joinedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  emoji: { type: String, default: "📊" },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  taskCode: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  status: { type: String, enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'], default: 'BACKLOG' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);
const Workspace = mongoose.model('Workspace', workspaceSchema);
const Role = mongoose.model('Role', roleSchema);
const Member = mongoose.model('Member', memberSchema);
const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// ===============================
// SEED DATA
// ===============================

const roleData = [
  {
    name: 'OWNER',
    permissions: [
      'CREATE_WORKSPACE', 'DELETE_WORKSPACE', 'EDIT_WORKSPACE', 'MANAGE_WORKSPACE_SETTINGS',
      'ADD_MEMBER', 'CHANGE_MEMBER_ROLE', 'REMOVE_MEMBER',
      'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT',
      'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK'
    ]
  },
  {
    name: 'ADMIN',
    permissions: [
      'EDIT_WORKSPACE', 'ADD_MEMBER', 'CHANGE_MEMBER_ROLE', 'REMOVE_MEMBER',
      'CREATE_PROJECT', 'EDIT_PROJECT', 'DELETE_PROJECT',
      'CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK'
    ]
  },
  {
    name: 'MEMBER',
    permissions: ['CREATE_TASK', 'EDIT_TASK', 'VIEW_ONLY']
  }
];

const userData = [
  // Business Owners
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    password: 'owner123',
    profilePicture: 'https://i.pravatar.cc/300?img=1',
    role: 'OWNER'
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael@startupco.com',
    password: 'startup2024',
    profilePicture: 'https://i.pravatar.cc/300?img=3',
    role: 'OWNER'
  },
  
  // Project Managers / Admins
  {
    name: 'Emily Johnson',
    email: 'emily.johnson@techcorp.com',
    password: 'projectman123',
    profilePicture: 'https://i.pravatar.cc/300?img=5',
    role: 'ADMIN'
  },
  {
    name: 'David Kim',
    email: 'david.kim@startupco.com',
    password: 'admin2024',
    profilePicture: 'https://i.pravatar.cc/300?img=7',
    role: 'ADMIN'
  },
  
  // Team Members / Developers
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@techcorp.com',
    password: 'developer123',
    profilePicture: 'https://i.pravatar.cc/300?img=9',
    role: 'MEMBER'
  },
  {
    name: 'Jessica Wu',
    email: 'jessica.wu@techcorp.com',
    password: 'frontend2024',
    profilePicture: 'https://i.pravatar.cc/300?img=11',
    role: 'MEMBER'
  },
  {
    name: 'Ryan Miller',
    email: 'ryan.miller@startupco.com',
    password: 'backend123',
    profilePicture: 'https://i.pravatar.cc/300?img=13',
    role: 'MEMBER'
  },
  {
    name: 'Lisa Zhang',
    email: 'lisa.zhang@freelance.com',
    password: 'designer123',
    profilePicture: 'https://i.pravatar.cc/300?img=15',
    role: 'MEMBER'
  },
  
  // Additional team members
  {
    name: 'Thomas Anderson',
    email: 'tom.anderson@techcorp.com',
    password: 'qa123',
    profilePicture: 'https://i.pravatar.cc/300?img=17',
    role: 'MEMBER'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@startupco.com',
    password: 'marketing123',
    profilePicture: 'https://i.pravatar.cc/300?img=19',
    role: 'MEMBER'
  }
];

const workspaceData = [
  {
    name: 'TechCorp Solutions',
    description: 'Enterprise software development and IT solutions',
    inviteCode: 'TECH2024'
  },
  {
    name: 'StartupCo Innovation Lab',
    description: 'Agile startup focused on mobile applications and AI',
    inviteCode: 'START2024'
  },
  {
    name: 'Freelance Hub',
    description: 'Collaborative workspace for freelance projects',
    inviteCode: 'FREELANCE24'
  }
];

const projectData = [
  // TechCorp Projects
  {
    name: 'CRM System Revamp',
    description: 'Complete overhaul of the existing CRM system with modern UI/UX',
    emoji: '🔄',
    workspaceIndex: 0
  },
  {
    name: 'Mobile App Integration',
    description: 'Integrate mobile capabilities with existing web platform',
    emoji: '📱',
    workspaceIndex: 0
  },
  {
    name: 'Security Audit & Implementation',
    description: 'Comprehensive security review and implementation of best practices',
    emoji: '🔐',
    workspaceIndex: 0
  },
  
  // StartupCo Projects
  {
    name: 'AI-Powered Task Manager',
    description: 'Smart task management app with AI recommendations',
    emoji: '🤖',
    workspaceIndex: 1
  },
  {
    name: 'Social Media Dashboard',
    description: 'Unified dashboard for managing multiple social media accounts',
    emoji: '📊',
    workspaceIndex: 1
  },
  
  // Freelance Projects
  {
    name: 'E-commerce Platform',
    description: 'Custom e-commerce solution for small businesses',
    emoji: '🛒',
    workspaceIndex: 2
  },
  {
    name: 'Portfolio Website',
    description: 'Modern portfolio website for creative professionals',
    emoji: '🎨',
    workspaceIndex: 2
  }
];

const taskData = [
  // CRM System Tasks
  {
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the new CRM dashboard',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectIndex: 0,
    assignedToIndex: 5 // Jessica Wu
  },
  {
    title: 'Implement user authentication',
    description: 'Set up secure login system with 2FA support',
    status: 'DONE',
    priority: 'HIGH',
    projectIndex: 0,
    assignedToIndex: 4 // Alex Thompson
  },
  {
    title: 'Database schema optimization',
    description: 'Optimize database queries for better performance',
    status: 'TODO',
    priority: 'MEDIUM',
    projectIndex: 0,
    assignedToIndex: 4 // Alex Thompson
  },
  
  // Mobile App Tasks
  {
    title: 'React Native setup',
    description: 'Initialize React Native project structure',
    status: 'DONE',
    priority: 'HIGH',
    projectIndex: 1,
    assignedToIndex: 6 // Ryan Miller
  },
  {
    title: 'API integration layer',
    description: 'Create service layer for API communications',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectIndex: 1,
    assignedToIndex: 6 // Ryan Miller
  },
  
  // Security Tasks
  {
    title: 'Vulnerability assessment',
    description: 'Complete security audit of all endpoints',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    projectIndex: 2,
    assignedToIndex: 8 // Thomas Anderson
  },
  
  // AI Task Manager Tasks
  {
    title: 'Machine learning model training',
    description: 'Train AI model for task priority recommendations',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    projectIndex: 3,
    assignedToIndex: 3 // David Kim
  },
  {
    title: 'UI/UX design system',
    description: 'Create comprehensive design system for the app',
    status: 'TODO',
    priority: 'MEDIUM',
    projectIndex: 3,
    assignedToIndex: 7 // Lisa Zhang
  },
  
  // Social Media Dashboard Tasks
  {
    title: 'Instagram API integration',
    description: 'Connect and display Instagram analytics',
    status: 'BACKLOG',
    priority: 'MEDIUM',
    projectIndex: 4,
    assignedToIndex: 9 // Maria Garcia
  },
  
  // E-commerce Tasks
  {
    title: 'Payment gateway integration',
    description: 'Implement Stripe and PayPal payment processing',
    status: 'TODO',
    priority: 'HIGH',
    projectIndex: 5,
    assignedToIndex: 7 // Lisa Zhang
  }
];

// Helper function to generate unique invite codes
function generateInviteCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Helper function to generate task codes
function generateTaskCode() {
  return 'TSK-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// ===============================
// POPULATION FUNCTION
// ===============================

async function populateComprehensiveData() {
  try {
    console.log('🚀 Starting comprehensive database population...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Account.deleteMany({});
    await Workspace.deleteMany({});
    await Role.deleteMany({});
    await Member.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // 1. Create Roles
    console.log('👥 Creating roles...');
    const createdRoles = await Role.insertMany(roleData);
    const roleMap = {};
    createdRoles.forEach(role => {
      roleMap[role.name] = role._id;
    });
    console.log('✅ Created roles:', Object.keys(roleMap).join(', '));

    // 2. Create Users
    console.log('\n👤 Creating users...');
    const hashedUsers = await Promise.all(userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword
      };
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    console.log('✅ Created users:');
    createdUsers.forEach((user, index) => {
      console.log(`   ${user.name} (${user.email}) - Role: ${userData[index].role}`);
    });

    // 3. Create Account records
    console.log('\n🔐 Creating account records...');
    const accountPromises = createdUsers.map((user) => {
      return new Account({
        userId: user._id,
        provider: 'EMAIL',
        providerId: user.email
      }).save();
    });
    await Promise.all(accountPromises);
    console.log('✅ Created account records for all users');

    // 4. Create Workspaces
    console.log('\n🏢 Creating workspaces...');
    const createdWorkspaces = [];
    
    // TechCorp - owned by Sarah Chen (index 0)
    const techCorpWorkspace = new Workspace({
      name: workspaceData[0].name,
      description: workspaceData[0].description,
      owner: createdUsers[0]._id,
      inviteCode: workspaceData[0].inviteCode
    });
    
    // StartupCo - owned by Michael Rodriguez (index 1)
    const startupWorkspace = new Workspace({
      name: workspaceData[1].name,
      description: workspaceData[1].description,
      owner: createdUsers[1]._id,
      inviteCode: workspaceData[1].inviteCode
    });
    
    // Freelance Hub - owned by Lisa Zhang (index 7)
    const freelanceWorkspace = new Workspace({
      name: workspaceData[2].name,
      description: workspaceData[2].description,
      owner: createdUsers[7]._id,
      inviteCode: workspaceData[2].inviteCode
    });

    createdWorkspaces.push(
      await techCorpWorkspace.save(),
      await startupWorkspace.save(),
      await freelanceWorkspace.save()
    );

    console.log('✅ Created workspaces:');
    createdWorkspaces.forEach(workspace => {
      console.log(`   ${workspace.name} (${workspace.inviteCode})`);
    });

    // 5. Create Members
    console.log('\n👥 Creating workspace members...');
    const memberMappings = [
      // TechCorp members
      { userIndex: 0, workspaceIndex: 0, roleIndex: 0 }, // Sarah Chen - OWNER
      { userIndex: 2, workspaceIndex: 0, roleIndex: 1 }, // Emily Johnson - ADMIN
      { userIndex: 4, workspaceIndex: 0, roleIndex: 2 }, // Alex Thompson - MEMBER
      { userIndex: 5, workspaceIndex: 0, roleIndex: 2 }, // Jessica Wu - MEMBER
      { userIndex: 8, workspaceIndex: 0, roleIndex: 2 }, // Thomas Anderson - MEMBER
      
      // StartupCo members
      { userIndex: 1, workspaceIndex: 1, roleIndex: 0 }, // Michael Rodriguez - OWNER
      { userIndex: 3, workspaceIndex: 1, roleIndex: 1 }, // David Kim - ADMIN
      { userIndex: 6, workspaceIndex: 1, roleIndex: 2 }, // Ryan Miller - MEMBER
      { userIndex: 9, workspaceIndex: 1, roleIndex: 2 }, // Maria Garcia - MEMBER
      
      // Freelance Hub members
      { userIndex: 7, workspaceIndex: 2, roleIndex: 0 }, // Lisa Zhang - OWNER
    ];

    const memberPromises = memberMappings.map(mapping => {
      return new Member({
        userId: createdUsers[mapping.userIndex]._id,
        workspaceId: createdWorkspaces[mapping.workspaceIndex]._id,
        role: createdRoles[mapping.roleIndex]._id
      }).save();
    });

    await Promise.all(memberPromises);
    console.log('✅ Created workspace memberships');

    // 6. Update user currentWorkspace
    console.log('\n🔄 Updating user current workspaces...');
    await User.findByIdAndUpdate(createdUsers[0]._id, { currentWorkspace: createdWorkspaces[0]._id });
    await User.findByIdAndUpdate(createdUsers[1]._id, { currentWorkspace: createdWorkspaces[1]._id });
    await User.findByIdAndUpdate(createdUsers[7]._id, { currentWorkspace: createdWorkspaces[2]._id });
    console.log('✅ Updated user current workspaces');

    // 7. Create Projects
    console.log('\n📊 Creating projects...');
    const createdProjects = [];
    for (const projectInfo of projectData) {
      const project = new Project({
        name: projectInfo.name,
        description: projectInfo.description,
        emoji: projectInfo.emoji,
        workspace: createdWorkspaces[projectInfo.workspaceIndex]._id,
        createdBy: createdWorkspaces[projectInfo.workspaceIndex].owner
      });
      createdProjects.push(await project.save());
    }

    console.log('✅ Created projects:');
    createdProjects.forEach(project => {
      console.log(`   ${project.emoji} ${project.name}`);
    });

    // 8. Create Tasks
    console.log('\n✅ Creating tasks...');
    const taskPromises = taskData.map(taskInfo => {
      const task = new Task({
        taskCode: generateTaskCode(),
        title: taskInfo.title,
        description: taskInfo.description,
        project: createdProjects[taskInfo.projectIndex]._id,
        workspace: createdProjects[taskInfo.projectIndex].workspace,
        status: taskInfo.status,
        priority: taskInfo.priority,
        assignedTo: taskInfo.assignedToIndex !== undefined ? createdUsers[taskInfo.assignedToIndex]._id : null,
        createdBy: createdProjects[taskInfo.projectIndex].createdBy,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within 30 days
      });
      return task.save();
    });

    const createdTasks = await Promise.all(taskPromises);
    console.log('✅ Created tasks:');
    createdTasks.forEach(task => {
      console.log(`   [${task.taskCode}] ${task.title} - ${task.status} (${task.priority})`);
    });

    // Summary
    console.log('\n📈 DATABASE POPULATION SUMMARY:');
    console.log('=====================================');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🏢 Workspaces: ${createdWorkspaces.length}`);
    console.log(`📊 Projects: ${createdProjects.length}`);
    console.log(`✅ Tasks: ${createdTasks.length}`);
    console.log(`👤 Roles: ${createdRoles.length}`);
    
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('=====================================');
    userData.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role}`);
    });

    console.log('\n🎉 COMPREHENSIVE DATABASE POPULATION COMPLETED!');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    mongoose.connection.close();
  }
}

populateComprehensiveData();