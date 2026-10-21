import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import {
    loginOtpEmailTemplate,
    emailVerificationEmailTemplate,
    parentActivationEmailTemplate,
    passwordResetEmailTemplate,
    temporaryCredentialsEmailTemplate,
} from './auth-email-templates.js';

let transporter;
let authenticationTransporter;
const reminderTransporters = new Map();

function getTransporter() {
    assertTemporaryCredentialsEmailConfigured();

    transporter ??= nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    });
    return transporter;
}

export function assertTemporaryCredentialsEmailConfigured() {
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASSWORD) {
        const error = new Error('SMTP configuration is incomplete');
        error.code = 'AUTH_EMAIL_NOT_CONFIGURED';
        throw error;
    }
}

function getAuthenticationEmailConfig() {
    const user = process.env.GMAIL_USER || process.env.SMTP_USER || env.SMTP_USER;
    return {
        host: process.env.GMAIL_HOST || process.env.SMTP_HOST || env.SMTP_HOST,
        port: process.env.SMTP_PORT || env.SMTP_PORT,
        user,
        password: process.env.GMAIL_PASSWORD || process.env.SMTP_PASSWORD || env.SMTP_PASSWORD,
        from:
            process.env.AUTH_EMAIL_FROM ||
            process.env.SMTP_FROM ||
            process.env.GMAIL_FROM ||
            env.SMTP_FROM ||
            env.GMAIL_FROM ||
            user,
    };
}

function getAuthenticationTransporter() {
    const { host, port, user, password } = getAuthenticationEmailConfig();
    if (!authenticationTransporter) {
        authenticationTransporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465,
            auth: { user, pass: password },
        });
    }
    return authenticationTransporter;
}

export function assertAuthenticationEmailConfigured() {
    const { host, port, user, password, from } = getAuthenticationEmailConfig();
    if (!host || !port || !user || !password || !from) {
        const error = new Error(
            'Configure GMAIL_HOST, SMTP_PORT, GMAIL_USER, and GMAIL_PASSWORD (or the equivalent SMTP_* variables) to send authentication email.',
        );
        error.code = 'AUTH_EMAIL_NOT_CONFIGURED';
        throw error;
    }
}

export async function sendAuthenticationCode({ email, fullName, code, purpose }) {
    assertAuthenticationEmailConfigured();
    const passwordReset = purpose === 'password_reset';
    const expiresInMinutes = passwordReset
        ? env.PASSWORD_RESET_OTP_MINUTES
        : env.LOGIN_OTP_MINUTES;
    const template = passwordReset
        ? passwordResetEmailTemplate
        : purpose === 'email_verification'
            ? emailVerificationEmailTemplate
            : loginOtpEmailTemplate;
    const action = passwordReset ? 'reset your password' : 'verify your email address';
    await getAuthenticationTransporter().sendMail({
        from: getAuthenticationEmailConfig().from,
        to: email,
        subject: passwordReset
            ? 'Reset your School SMIS password'
            : purpose === 'email_verification'
                ? 'Verify your School SMIS email'
                : 'Your School SMIS login code',
        text: `Hello ${fullName},\n\nUse this code to ${action}: ${code}\n\nThis code expires in ${expiresInMinutes} minutes. If you did not request this, you can ignore this message.`,
        html: template({ otp: code, expiresInMinutes }),
    });
}

export async function sendPasswordResetOtp({ to, otp }) {
    await getTransporter().sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to,
        subject: 'School SMIS password reset code',
        text: `Your password reset code is ${otp}. It expires in ${env.PASSWORD_RESET_OTP_MINUTES} minutes.`,
        html: passwordResetEmailTemplate({ otp, expiresInMinutes: env.PASSWORD_RESET_OTP_MINUTES }),
    });
}

export async function sendLoginOtp({ to, otp }) {
    await getTransporter().sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to,
        subject: 'Your School SMIS login verification code',
        text: `Your School SMIS login verification code is ${otp}. It expires in ${env.LOGIN_OTP_MINUTES} minutes.`,
        html: loginOtpEmailTemplate({ otp, expiresInMinutes: env.LOGIN_OTP_MINUTES }),
    });
}

export async function sendTemporaryCredentials({ to, firstName, role, temporaryPassword }) {
    assertTemporaryCredentialsEmailConfigured();
    await getTransporter().sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to,
        subject: 'Your School SMIS account credentials',
        text: `Hello ${firstName},\n\nYour ${role.toLowerCase()} School SMIS account has been created.\n\nEmail: ${to}\nTemporary password: ${temporaryPassword}\n\nYou must change this password immediately after your first login.`,
        html: temporaryCredentialsEmailTemplate({ firstName, role, email: to, temporaryPassword }),
    });
}

export async function sendParentActivationInvite({ to, firstName, token }) {
    await getTransporter().sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to,
        subject: 'Activate your School SMIS parent account',
        text: `Hello ${firstName},\n\nUse this activation token to activate your parent account: ${token}\n\nThis token expires in 48 hours.`,
        html: parentActivationEmailTemplate({ firstName, token }),
    });
}

export async function sendPayslipEmail({ to, employeeName, month, downloadUrl }) {
    await getTransporter().sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        to,
        subject: `School SMIS payslip for ${month}`,
        text: `Hello ${employeeName},\n\nYour payslip for ${month} is ready. Download it using this private link, which expires soon:\n${downloadUrl}`,
    });
}

function reminderMailConfig(provider) {
    if (provider === 'GMAIL') {
        const genericIsGmail = /gmail|google/i.test(env.SMTP_HOST || '');
        const user = env.GMAIL_USER || (genericIsGmail ? env.SMTP_USER : undefined);
        const password = env.GMAIL_PASSWORD || (genericIsGmail ? env.SMTP_PASSWORD : undefined);
        return {
            host: env.GMAIL_HOST || (genericIsGmail ? env.SMTP_HOST : 'smtp.gmail.com'),
            port: env.GMAIL_PORT || (genericIsGmail ? env.SMTP_PORT : 465),
            user,
            password,
            from: env.GMAIL_FROM || user,
        };
    }

    if (provider === 'OUTLOOK') {
        return {
            host: env.OUTLOOK_HOST || 'smtp-mail.outlook.com',
            port: env.OUTLOOK_PORT || 587,
            user: env.OUTLOOK_USER,
            password: env.OUTLOOK_PASSWORD,
            from: env.OUTLOOK_FROM || env.OUTLOOK_USER,
        };
    }

    throw new Error('Unsupported reminder email provider');
}

export function getConfiguredReminderProviders() {
    return ['GMAIL', 'OUTLOOK'].map((provider) => {
        const config = reminderMailConfig(provider);
        return { provider, connected: Boolean(config.user && config.password) };
    });
}

export async function sendFeeReminder({ provider, to, subject, text }) {
    const config = reminderMailConfig(provider);
    if (!config.user || !config.password) {
        throw new Error(`${provider} email is not configured for this server`);
    }

    let providerTransporter = reminderTransporters.get(provider);
    if (!providerTransporter) {
        providerTransporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465,
            auth: { user: config.user, pass: config.password },
        });
        reminderTransporters.set(provider, providerTransporter);
    }

    return providerTransporter.sendMail({ from: config.from, to, subject, text });
}
