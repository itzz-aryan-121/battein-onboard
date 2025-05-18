import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Define sub-schemas for better organization
const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
  isNative: { type: Boolean, default: false }
});

const kycSchema = new mongoose.Schema({
  idType: { type: String, enum: ['Aadhar', 'PAN', 'Driving License', 'Voter ID'], required: true },
  idNumber: { type: String, required: true },
  idFrontImage: { type: String, required: true }, // URL to stored image
  idBackImage: { type: String, required: true }, // URL to stored image
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: String,
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  proofDocument: { type: String, required: true }, // URL to stored image
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: String,
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

const partnerSchema = new mongoose.Schema({
  // partner-details
  spokenLanguage: { type: String },
  hobbies: [{ type: String }],
  bio: { type: String },
  audioIntro: { type: String },
  
  // avatar-upload
  avatarUrl: { type: String },

  // kyc-upload
  kyc: {
    panNumber: { type: String },
    panCardFile: { type: String }
  },

  // bank-details
  bankDetails: {
    bankAccountNumber: { type: String },
    accountHolderName: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    upiId: { type: String },
    cancelCheque: { type: String }
  },

  // camera-verification
  capturedPhoto: { type: String },

  // approval status
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },

  createdAt: { type: Date, default: Date.now }
});

export const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

export type PartnerType = mongoose.InferSchemaType<typeof partnerSchema> & { _id: string }; 