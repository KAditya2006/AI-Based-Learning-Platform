import mongoose, { Schema, Document } from 'mongoose';

export interface IAIConversation extends Document {
  learnerId: mongoose.Types.ObjectId;
  learningResourceId?: mongoose.Types.ObjectId;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const AIConversationSchema = new Schema({
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  learningResourceId: { type: Schema.Types.ObjectId, ref: 'LearningResource' },
  title: { type: String, required: true },
  status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' }
}, { timestamps: true });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IAIJob extends Document {
  type: 'MATERIAL_PROCESSING' | 'MCQ_GENERATION' | 'QUIZ_GENERATION' | 'RECOMMENDATION_GENERATION' | 'LEARNING_PATH_GENERATION' | 'COMPETENCY_ANALYSIS';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  requesterId: mongoose.Types.ObjectId;
  metadata: any;
  resultReference?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIJobSchema = new Schema({
  type: {
    type: String,
    enum: ['MATERIAL_PROCESSING', 'MCQ_GENERATION', 'QUIZ_GENERATION', 'RECOMMENDATION_GENERATION', 'LEARNING_PATH_GENERATION', 'COMPETENCY_ANALYSIS'],
    required: true
  },
  status: {
    type: String,
    enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'QUEUED'
  },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: { type: Schema.Types.Mixed },
  resultReference: { type: Schema.Types.Mixed },
  error: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

export const AIJob = mongoose.model<IAIJob>('AIJob', AIJobSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IAIMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sourceReferences?: {
    materialChunkId: mongoose.Types.ObjectId;
    pageNumber?: number;
  }[];
  createdAt: Date;
}

const AIMessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  sourceReferences: [{
    materialChunkId: { type: Schema.Types.ObjectId, ref: 'MaterialChunk' },
    pageNumber: { type: Number }
  }]
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AIMessage = mongoose.model<IAIMessage>('AIMessage', AIMessageSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IAIRequestLog extends Document {
  operation: string;
  requesterId: mongoose.Types.ObjectId;
  provider: string;
  modelName: string;
  status: 'SUCCESS' | 'ERROR';
  durationMs: number;
  jobId?: mongoose.Types.ObjectId;
  resourceReference?: string;
  errorDetails?: string;
  createdAt: Date;
}

const AIRequestLogSchema = new Schema({
  operation: { type: String, required: true },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  modelName: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'ERROR'], required: true },
  durationMs: { type: Number, required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob' },
  resourceReference: { type: String },
  errorDetails: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AIRequestLog = mongoose.model<IAIRequestLog>('AIRequestLog', AIRequestLogSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IQuestion } from './Question';

export enum AttemptPolicy {
  ONE_ATTEMPT = 'ONE_ATTEMPT',
  MULTIPLE_ATTEMPTS = 'MULTIPLE_ATTEMPTS',
  UNLIMITED = 'UNLIMITED'
}

export interface IAssessment extends Document {
  title: string;
  description: string;
  competency: mongoose.Types.ObjectId;
  passingScore: number; // percentage
  durationMinutes?: number;
  attemptPolicy: AttemptPolicy;
  questions: IQuestion['_id'][];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    passingScore: { type: Number, required: true, min: 0, max: 100 },
    durationMinutes: { type: Number },
    attemptPolicy: { type: String, enum: Object.values(AttemptPolicy), default: AttemptPolicy.UNLIMITED },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IAssessment } from './Assessment';

export interface IAssessmentAttempt extends Document {
  learner: IUser['_id'];
  assessment: IAssessment['_id'];
  answers: { questionId: string; selectedOptionId: string }[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
}

const assessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    answers: [{
      questionId: { type: String, required: true },
      selectedOptionId: { type: String, required: true }
    }],
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>('AssessmentAttempt', assessmentAttemptSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IAuditLog extends Document {
  actor: IUser['_id'] | string; // User ID or 'SYSTEM'
  action: string;
  target?: string;
  metadata?: any;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.Mixed, required: true },
    action: { type: String, required: true },
    target: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { ICompetencyFramework } from './CompetencyFramework';

export enum CompetencyDomain {
  STATISTICAL = 'STATISTICAL',
  TECHNICAL = 'TECHNICAL',
  DIGITAL_GOVERNANCE = 'DIGITAL_GOVERNANCE',
  BEHAVIOURAL_MANAGERIAL = 'BEHAVIOURAL_MANAGERIAL'
}

export interface ICompetency extends Document {
  framework: ICompetencyFramework['_id'];
  name: string;
  code: string;
  domain: CompetencyDomain;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const competencySchema = new Schema<ICompetency>(
  {
    framework: { type: Schema.Types.ObjectId, ref: 'CompetencyFramework', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    domain: { type: String, enum: Object.values(CompetencyDomain), required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Competency = mongoose.model<ICompetency>('Competency', competencySchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';

export enum AssessmentType {
  SELF = 'SELF',
  SYSTEM = 'SYSTEM',
  QUIZ = 'QUIZ',
  ADMIN = 'ADMIN',
  AI_ASSISTED = 'AI_ASSISTED'
}

export interface ICompetencyAssessment extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  assessmentType: AssessmentType;
  score?: number;
  level: number; // 1 to 5
  evidence?: string;
  source?: string; // E.g. "Quiz 101", "Admin John"
  assessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const competencyAssessmentSchema = new Schema<ICompetencyAssessment>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    assessmentType: { type: String, enum: Object.values(AssessmentType), required: true },
    score: { type: Number },
    level: { type: Number, required: true, min: 1, max: 5 },
    evidence: { type: String },
    source: { type: String },
    assessedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const CompetencyAssessment = mongoose.model<ICompetencyAssessment>('CompetencyAssessment', competencyAssessmentSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetencyFramework extends Document {
  name: string;
  version: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const competencyFrameworkSchema = new Schema<ICompetencyFramework>(
  {
    name: { type: String, required: true, trim: true },
    version: { type: String, required: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CompetencyFramework = mongoose.model<ICompetencyFramework>('CompetencyFramework', competencyFrameworkSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';
import { ICompetencyAssessment } from './CompetencyAssessment';

export interface ICompetencyHistory extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  previousLevel?: number;
  newLevel: number;
  source: string;
  reason?: string;
  assessmentReference?: ICompetencyAssessment['_id'];
  timestamp: Date;
}

const competencyHistorySchema = new Schema<ICompetencyHistory>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    previousLevel: { type: Number, min: 1, max: 5 },
    newLevel: { type: Number, required: true, min: 1, max: 5 },
    source: { type: String, required: true },
    reason: { type: String },
    assessmentReference: { type: Schema.Types.ObjectId, ref: 'CompetencyAssessment' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
); // explicit timestamp set above, don't need mongoose timestamps for history ledger

export const CompetencyHistory = mongoose.model<ICompetencyHistory>('CompetencyHistory', competencyHistorySchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ILearningResource } from './LearningResource';

export enum EnrollmentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

export interface IEnrollment extends Document {
  learner: IUser['_id'];
  resource: ILearningResource['_id'];
  status: EnrollmentStatus;
  progressPercentage: number;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'LearningResource', required: true },
    status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.IN_PROGRESS },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate active enrollments
enrollmentSchema.index({ learner: 1, resource: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedQuestion extends Document {
  jobId: mongoose.Types.ObjectId;
  materialId?: mongoose.Types.ObjectId;
  competencyId?: mongoose.Types.ObjectId;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  aiConfidenceScore?: number;
  sourceReference?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedQuestionSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob', required: true },
  materialId: { type: Schema.Types.ObjectId, ref: 'Material' },
  competencyId: { type: Schema.Types.ObjectId, ref: 'Competency' },
  text: { type: String, required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctOptionId: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'REVIEW', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  },
  aiConfidenceScore: { type: Number },
  sourceReference: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const GeneratedQuestion = mongoose.model<IGeneratedQuestion>('GeneratedQuestion', GeneratedQuestionSchema);
export * from './User';
export * from './Profile';
export * from './Department';
export * from './Role';
export * from './CompetencyFramework';
export * from './Competency';
export * from './RoleCompetency';
export * from './CompetencyAssessment';
export * from './CompetencyHistory';
export * from './SkillGap';
export * from './AuditLog';
export * from './LearningResource';
export * from './Enrollment';
export * from './Question';
export * from './Assessment';
export * from './AssessmentAttempt';
export * from './AIJob';
export * from './AIRequestLog';
export * from './Material';
export * from './MaterialChunk';
export * from './GeneratedQuestion';
export * from './AIConversation';
export * from './AIMessage';
export * from './Recommendation';
export * from './LearningPath';
export * from './Notification';
import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPath extends Document {
  learnerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  sequence: {
    stepIndex: number;
    resourceId?: mongoose.Types.ObjectId;
    externalId?: string;
    source: 'INTERNAL' | 'IGOT' | 'NSSTA';
    title: string;
    reasoning: string;
  }[];
  jobId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema({
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sequence: [{
    stepIndex: { type: Number, required: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'LearningResource' },
    externalId: { type: String },
    source: { type: String, enum: ['INTERNAL', 'IGOT', 'NSSTA'], default: 'INTERNAL' },
    title: { type: String, required: true },
    reasoning: { type: String, required: true }
  }],
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
import mongoose, { Document, Schema } from 'mongoose';

export enum ResourceSource {
  INTERNAL = 'INTERNAL',
  IGOT = 'IGOT',
  NSSTA = 'NSSTA',
  TPAC = 'TPAC'
}

export interface ILearningResource extends Document {
  title: string;
  description: string;
  provider: string;
  source: ResourceSource;
  type: 'COURSE' | 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE';
  durationMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  competencies: mongoose.Types.ObjectId[];
  externalUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const learningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    provider: { type: String, required: true },
    source: { type: String, enum: Object.values(ResourceSource), default: ResourceSource.INTERNAL },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, required: true },
    competencies: [{ type: Schema.Types.ObjectId, ref: 'Competency' }],
    externalUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const LearningResource = mongoose.model<ILearningResource>('LearningResource', learningResourceSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: mongoose.Types.ObjectId;
  processingStatus: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  failureReason?: string;
  pageCount?: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  processingStatus: {
    type: String,
    enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'],
    default: 'UPLOADED'
  },
  failureReason: { type: String },
  pageCount: { type: Number },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Material = mongoose.model<IMaterial>('Material', MaterialSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterialChunk extends Document {
  materialId: mongoose.Types.ObjectId;
  chunkIndex: number;
  text: string;
  pageNumber?: number;
  tokenEstimate: number;
  metadata?: any;
}

const MaterialChunkSchema = new Schema({
  materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true },
  pageNumber: { type: Number },
  tokenEstimate: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed }
});

// Index for quick retrieval by material
MaterialChunkSchema.index({ materialId: 1, chunkIndex: 1 });

export const MaterialChunk = mongoose.model<IMaterialChunk>('MaterialChunk', MaterialChunkSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  learnerId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    learnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ['ASSESSMENT', 'SKILL_GAP', 'RECOMMENDATION', 'SYSTEM', 'LEARNING']
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    link: {
      type: String
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IDepartment } from './Department';
import { IRole } from './Role';

export enum ProfileStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface IProfile extends Document {
  user: IUser['_id'];
  firstName: string;
  lastName: string;
  department?: IDepartment['_id'];
  designation?: IRole['_id'];
  currentAssignment?: string;
  education?: string;
  workExperience?: string;
  trainingHistory?: string[];
  learningGoals?: string[];
  onboardingStatus: ProfileStatus;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: Schema.Types.ObjectId, ref: 'Role' },
    currentAssignment: { type: String },
    education: { type: String },
    workExperience: { type: String },
    trainingHistory: [{ type: String }],
    learningGoals: [{ type: String }],
    onboardingStatus: { type: String, enum: Object.values(ProfileStatus), default: ProfileStatus.NOT_STARTED }
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
import mongoose, { Document, Schema } from 'mongoose';

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED'
}

export interface IQuestion extends Document {
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  competency: mongoose.Types.ObjectId;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  source: string;
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: [{
      id: { type: String, required: true },
      text: { type: String, required: true }
    }],
    correctOptionId: { type: String, required: true },
    explanation: { type: String, required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    difficulty: { type: String, required: true },
    source: { type: String, default: 'INTERNAL' },
    status: { type: String, enum: Object.values(QuestionStatus), default: QuestionStatus.DRAFT }
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  learnerId: mongoose.Types.ObjectId;
  resourceId?: mongoose.Types.ObjectId; // For INTERNAL
  externalId?: string; // For IGOT or NSSTA
  source: 'INTERNAL' | 'IGOT' | 'NSSTA';
  title: string;
  reason: string;
  targetCompetencyId?: mongoose.Types.ObjectId;
  skillGapAddressed?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedEffortMins?: number;
  jobId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema({
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'LearningResource' },
  externalId: { type: String },
  source: { type: String, enum: ['INTERNAL', 'IGOT', 'NSSTA'], default: 'INTERNAL' },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  targetCompetencyId: { type: Schema.Types.ObjectId, ref: 'Competency' },
  skillGapAddressed: { type: String },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  estimatedEffortMins: { type: Number },
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob' }
}, { timestamps: true });

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  code: string; // e.g., 'STATISTICAL_OFFICER'
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from './Role';
import { ICompetency } from './Competency';

export interface IRoleCompetency extends Document {
  role: IRole['_id'];
  competency: ICompetency['_id'];
  requiredLevel: number; // 1 to 5
  createdAt: Date;
  updatedAt: Date;
}

const roleCompetencySchema = new Schema<IRoleCompetency>(
  {
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    requiredLevel: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

// Prevent duplicate mappings for the same role and competency
roleCompetencySchema.index({ role: 1, competency: 1 }, { unique: true });

export const RoleCompetency = mongoose.model<IRoleCompetency>('RoleCompetency', roleCompetencySchema);
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';

export enum SkillGapLevel {
  NO_GAP = 0,
  LOW = 1,
  MODERATE = 2,
  HIGH = 3,
  CRITICAL = 4
}

export interface ISkillGap extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  currentLevel: number;
  requiredLevel: number;
  gapSize: number;
  gapClassification: SkillGapLevel;
  evidence?: string;
  lastCalculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const skillGapSchema = new Schema<ISkillGap>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    currentLevel: { type: Number, required: true, min: 1, max: 5 },
    requiredLevel: { type: Number, required: true, min: 1, max: 5 },
    gapSize: { type: Number, required: true },
    gapClassification: { type: Number, enum: Object.values(SkillGapLevel), required: true },
    evidence: { type: String },
    lastCalculatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate skill gap records for the same learner and competency
skillGapSchema.index({ learner: 1, competency: 1 }, { unique: true });

export const SkillGap = mongoose.model<ISkillGap>('SkillGap', skillGapSchema);
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  LEARNER = 'LEARNER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.LEARNER },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
