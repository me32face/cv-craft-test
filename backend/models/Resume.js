import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    index: true  // for faster queries
  },
  
  resumeName: { 
    type: String, 
    default: "Untitled Resume" 
  },
  
  templateId: { 
    type: String, 
    required: true,
    enum: [ 'template01', 'template30', 'template31', 'template32', 'template33', 'template34', 'template35', 'template36', 'template37', 'template38', 'template39', 'template40', 'template41', 'template42', 'template43', 'template44', 'template45', 'template46', 'template47']
  },
  
  templateData: {
    // Personal Info
    name: String,
    title: String,
    phone: String,
    email: String,
    address: String,
    dob: String,
    summary: String,
    profileImage: String,
    imageShape: String,
    imageAlign: String,
    
    // Social Links
    socialLinks: [
  {
    url: { type: String},
    label: { type: String},
    useIcon: { type: Boolean}
  }
]
,
    
    // Visible Sections Control
    visibleSections: {
      summary: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      languages: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      socialLinks: { type: Boolean, default: true },
      references: { type: Boolean, default: true },
      awards: { type: Boolean, default: true }
    },
    
    // Skills (flexible structure)
    skills: [mongoose.Schema.Types.Mixed],
    
    // Languages
    languages: [{
      name: String,
      proficiency: Number
    }],
    
    // Experience
    experiences: [{
      role: String,
      company: String,
      location: String,
      start: String,
      end: String,
      current: Boolean,
      desc: String,
      descFormat: { type: String, enum: ['bullet', 'number', 'paragraph'] },
      reference: String
    }],
    
    // Education
    education: [{
      degree: String,
      school: String,
      field: String,
      start: String,
      end: String,
      current: Boolean,
      description: String,
      descFormat: { type: String, enum: ['bullet', 'number', 'paragraph'] }
    }],
    
    // Certificates
    certificates: [{
      name: String,
      issuer: String,
      year: String,
      description: String
    }],
    
    // Projects
    projects: [{
      name: String,
      desc: String,
      descFormat: { type: String, enum: ['bullet', 'number', 'paragraph','default'] },
      year: String,
      link: String
    }],
    
    // References
    references: [{
      name: String,
      title: String,
      phone: String,
      email: String
    }],
    
    // Awards
    awards: [{
      name: String,
      issuer: String,
      year: String,
      description: String
    }],
    
    maritalStatus: String,
  },
  
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  
  lastModified: { 
    type: Date, 
    default: Date.now 
  }
  
}, { 
  timestamps: true  // adds createdAt and updatedAt automatically
});

// Index for faster user-specific queries
resumeSchema.index({ userId: 1, lastModified: -1 });


// Share URL Schema
const sharedSchema = new mongoose.Schema({
  resumeId: {type: mongoose.Schema.Types.ObjectId},

  shareId: { 
  type: String, 
  unique: true,
  sparse: true,  // allows null values, only enforces uniqueness when present
  index: true    // for fast lookups
},
isShared: {
  type: Boolean,
  default: false
},
shareViewCount: {
  type: Number,
  default: 0
},
shareCreatedAt: {
  type: Date
}

})



export const Resume = mongoose.model('Resume', resumeSchema);
export const ShareUrl = mongoose.model('ShareUrl', sharedSchema); 