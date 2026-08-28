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

AIConversationSchema.index({ learnerId: 1, status: 1 });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', AIConversationSchema);
