import { AuditLog } from '../models';

export class AuditService {
  static async log(actor: string, action: string, target?: string, metadata?: any) {
    try {
      await AuditLog.create({ actor, action, target, metadata });
    } catch (error) {
      console.error('AuditLog failed:', error);
    }
  }
}
