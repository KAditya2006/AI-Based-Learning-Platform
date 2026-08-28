import { authorize } from '../authorize';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models';

describe('authorize middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should return 401 if user is not attached to request', () => {
    mockReq = {};
    const middleware = authorize([UserRole.ADMIN]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 403 if user role is not in allowed roles', () => {
    mockReq = {
      user: { id: 'test', email: 'test@example.com', role: UserRole.LEARNER } as any
    };
    const middleware = authorize([UserRole.ADMIN]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next if user role is allowed', () => {
    mockReq = {
      user: { id: 'test', email: 'test@example.com', role: UserRole.ADMIN } as any
    };
    const middleware = authorize([UserRole.ADMIN]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(mockRes.status).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});
