import { z } from 'zod';

export const loginSchema = z
    .object({
        email: z.string().trim().toLowerCase().email('Invalid email address format'),
        password: z.string().min(10, 'Password must be at least 10 characters'),
    });

export const registerSchema = z.object({
    fullName: z.string().trim().min(2).max(160),
    email: z.string().trim().toLowerCase().email('Invalid email address format').max(254),
    password: z.string().min(10, 'Password must be at least 10 characters').max(128),
});

export const loginOtpSchema = z.object({
    challengeToken: z.string().min(32).max(128),
    otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code'),
});

export const resendLoginOtpSchema = z.object({
    challengeToken: z.string().min(32).max(128),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(12, 'New password must be at least 12 characters')
        .refine(
            (password) => /[a-z]/.test(password),
            'New password must contain a lowercase letter',
        )
        .refine(
            (password) => /[A-Z]/.test(password),
            'New password must contain an uppercase letter',
        )
        .refine((password) => /\d/.test(password), 'New password must contain a number')
        .refine(
            (password) => /[^A-Za-z0-9]/.test(password),
            'New password must contain a special character',
        ),
});

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address format'),
});

export const resendCodeSchema = forgotPasswordSchema.extend({
    purpose: z.enum(['password_reset', 'email_verification']),
});

export const verifyOtpSchema = forgotPasswordSchema.extend({
    otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code'),
});

export const verifyEmailSchema = forgotPasswordSchema.extend({
    code: z.string().regex(/^\d{6}$/, 'Verification code must be a 6-digit code'),
});

export const resetPasswordSchema = verifyOtpSchema.extend({
    newPassword: changePasswordSchema.shape.newPassword,
});

export const googleLoginSchema = z.object({
    idToken: z.string().min(1),
});

export const updateMyProfileSchema = z.object({
    firstName: z.string().trim().min(1).max(100).optional(),
    middleName: z.string().trim().max(100).optional(),
    lastName: z.string().trim().min(1).max(100).optional(),
    phone: z.string().trim().min(7).max(30),
});
