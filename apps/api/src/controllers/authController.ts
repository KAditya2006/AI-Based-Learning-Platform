import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await AuthService.register(email, password, firstName, lastName);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    error.statusCode = 400;
    error.code = 'REGISTRATION_FAILED';
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    error.statusCode = 401;
    error.code = 'LOGIN_FAILED';
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, data: { user: req.user } });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  // In a real stateless JWT implementation, the client throws away the token.
  // We can just return success here.
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    res.status(200).json({ success: true, data: { message: 'If that email exists, a reset link has been sent.' } });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, data: { message: 'Password has been successfully reset.' } });
  } catch (error: any) {
    error.statusCode = 400;
    error.code = 'RESET_FAILED';
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    await AuthService.verifyEmail(token);
    res.status(200).json({ success: true, data: { message: 'Email has been successfully verified.' } });
  } catch (error: any) {
    error.statusCode = 400;
    error.code = 'VERIFICATION_FAILED';
    next(error);
  }
};
