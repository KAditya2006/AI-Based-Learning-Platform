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
