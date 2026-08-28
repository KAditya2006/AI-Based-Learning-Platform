import { Request, Response, NextFunction } from 'express';
import { Material } from '../models';
import { MaterialService } from '../services/MaterialService';

export const uploadMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      const err: any = new Error('No file uploaded');
      err.statusCode = 400;
      err.code = 'BAD_REQUEST';
      throw err;
    }
    
    // We can still take title from body, but filename/mime/size comes from multer
    const title = req.body.title || req.file.originalname;
    const userId = req.user!.userId;

    const material = await Material.create({
      title,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedBy: userId,
      processingStatus: 'UPLOADED',
      metadata: { originalName: req.file.originalname }
    });

    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

export const processMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const job = await MaterialService.processMaterial(id, req.user!.userId);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const getMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

export const getMaterialStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      const err: any = new Error('Material not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    res.json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};
