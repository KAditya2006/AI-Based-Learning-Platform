import { Material, MaterialChunk } from '../models';
import { JobService } from './JobService';
import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');

export class MaterialService {
  /**
   * Simulates processing an uploaded file, extracting text, and chunking it.
   */
  static async processMaterial(materialId: string, requesterId: string) {
    const material = await Material.findById(materialId);
    if (!material) throw new Error('Material not found');

    const job = await JobService.createJob(requesterId, 'MATERIAL_PROCESSING', { materialId });

    // Execute in background
    JobService.executeAsync(job._id.toString(), async () => {
      material.processingStatus = 'PROCESSING';
      await material.save();

      try {
        const filePath = path.join(__dirname, '../../uploads', material.filename);
        
        let extractedText = '';
        if (material.mimeType === 'application/pdf') {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          extractedText = data.text;
        } else if (material.mimeType === 'text/plain') {
          extractedText = fs.readFileSync(filePath, 'utf-8');
        } else {
          // Fallback or throw
          throw new Error('Unsupported file type for extraction.');
        }

        const chunks = extractedText.split('\n\n').map(t => t.trim()).filter(t => t.length > 0);
        
        if (chunks.length === 0) {
          throw new Error('No text could be extracted from the file.');
        }

        for (let i = 0; i < chunks.length; i++) {
          await MaterialChunk.create({
            materialId: material._id,
            chunkIndex: i,
            text: chunks[i],
            tokenEstimate: chunks[i].split(/\s+/).length * 1.5,
            pageNumber: 1 // PDF parse doesn't easily give page-by-page chunks without more complex logic, default to 1
          });
        }

        material.processingStatus = 'READY';
        material.pageCount = 1;
        await material.save();

        return { chunksExtracted: chunks.length };
      } catch (err: any) {
        material.processingStatus = 'FAILED';
        material.failureReason = err.message;
        await material.save();
        throw err;
      }
    });

    return job;
  }
}
