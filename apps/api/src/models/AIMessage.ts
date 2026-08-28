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

AIMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const AIMessage = mongoose.model<IAIMessage>('AIMessage', AIMessageSchema);
