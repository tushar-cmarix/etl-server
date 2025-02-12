import sgMail from '@sendgrid/mail';
import Logger from '../../config/logger';
import { AdminNotification } from '../../types/common';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
const HOST =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NODE_ENV === 'stagging'
          ? 'https://yourstagging.com'
          : 'https://yourproduction.com';

async function SendActivationMail(toMail: string) {
    try {
        const appLink = `${HOST}`;
        const msg = {
            to: toMail,
            from: 'noreplay@drknoww.com',
            subject: 'Your Registration is Approved!',
            html: `
        <html>
          <body>
            <p>Hello,</p>
            <p>Congratulations! Your registration has been approved.</p>
            <p>You can now log in to your account:</p>
            <p>
              <a href="${appLink}" style="color: #1a73e8; text-decoration: none;">
                Log in to ETL-Tool
              </a>
            </p>
            <p>Thank you,<br>ETL-Tool Team</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #666;">
              <p>If you have any questions, please contact us at <a href="mailto:support@etltool.com" style="color: #1a73e8; text-decoration: none;">support@etltool.com</a>.</p>
            </footer>
          </body>
        </html>
      `,
        };

        return await sgMail.send(msg);
    } catch (error) {
        Logger.error(
            `Error while sending activation mail :${JSON.stringify(error)}`
        );
        return;
    }
}

async function SendRejectionMail(toMail: string) {
    try {
        const appLink = `${HOST}/support`;
        const msg = {
            to: toMail,
            from: 'noreplay@drknoww.com',
            subject: 'Your Registration has been Rejected.',
            html: `
        <html>
          <body>
            <p>Hello,</p>
            <p>We're sorry, but your registration has been rejected.</p>
            <p>If you believe this is a mistake, please contact our support team:</p>
            <p>
              <a href="${appLink}" style="color: #1a73e8; text-decoration: none;">
                Contact Support
              </a>
            </p>
            <p>Thank you,<br>ETL-Tool Team</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #666;">
              <p>If you have any questions, please contact us at <a href="mailto:support@etltool.com" style="color: #1a73e8; text-decoration: none;">support@etltool.com</a>.</p>
            </footer>
          </body>
        </html>
      `,
        };

        return await sgMail.send(msg);
    } catch (error) {
        Logger.error(
            `Error while sending rejection mail :${JSON.stringify(error)}`
        );
        return;
    }
}

async function SendVerificationMail(toMail: string, token: string) {
    try {
        const verificationLink = `${HOST}/auth/verify?token=${token}`;
        const unsubscribeLink = `${HOST}/unsubscribe?email=${encodeURIComponent(toMail)}`;

        const msg = {
            to: toMail,
            from: 'noreplay@drknoww.com',
            subject: 'Action Required: Verify Your Email Address',
            text: `Hello,\n\nThank you for signing up with ETL-Tool! Please verify your email address by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email. If you have any questions, feel free to contact us at support@etltool.com.\n\nThank you,\nETL-Tool Team`,
            html: `
        <html>
          <body>
            <p>Hi there,</p>
            <p>Thank you for signing up with <strong>ETL-Tool</strong>! Please verify your email address by clicking the link below:</p>
            <p>
              <a href="${verificationLink}" style="color: #1a73e8; text-decoration: none;">
                Verify Email Address
              </a>
            </p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p>If you have any questions, please contact us at <a href="mailto:support@etltool.com" style="color: #1a73e8; text-decoration: none;">support@etltool.com</a>.</p>
            <p>Best regards,<br>ETL-Tool Team</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #666;">
              <p>You are receiving this email because you signed up for an account at ETL-Tool.</p>
              <p>If you no longer wish to receive emails from us, <a href="${HOST}/unsubscribe" style="color: #1a73e8;">unsubscribe here</a>.</p>
            </footer>
          </body>
        </html>
      `,
            headers: {
                'List-Unsubscribe': `<${unsubscribeLink}>`,
            },
        };

        return await sgMail.send(msg);
    } catch (error) {
        Logger.error(
            `Error while sending verification mail :${JSON.stringify(error)}`
        );
        return;
    }
}

async function SendResetPasswordEmail(toMail: string, token: string) {
    try {
        const resetPasswordLink = `${HOST}/auth/reset-password?token=${token}`;
        const msg = {
            to: toMail,
            from: 'noreplay@drknoww.com',
            subject: 'Reset Password link for ETL-Tool',
            html: `
        <html>
          <body>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p>
              <a href="${resetPasswordLink}" style="color: #1a73e8; text-decoration: none;">
                Reset Password
              </a>
            </p>
            <p>If you didn’t ask to reset your password, you can safely ignore this email.</p>
            <p>Thank you,<br>ETL-Tool Team</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #666;">
              <p>If you have any questions, please contact us at <a href="mailto:support@etltool.com" style="color: #1a73e8; text-decoration: none;">support@etltool.com</a>.</p>
            </footer>
          </body>
        </html>
      `,
        };
        return await sgMail.send(msg);
    } catch (error) {
        Logger.error(
            `Error while sending reset password mail :${JSON.stringify(error)}`
        );
        return;
    }
}

async function sendNewUserNotificationEmail(
    recipients: string[],
    userDetails: AdminNotification
) {
    try {
        const userManagementLink = `${HOST}/admin_users`;
        const subject = `ETL-Tool-New User Registration: ${userDetails.name}`;

        const htmlContent = `
      <html>
        <body>
          <p>Hello, Admin!</p>
          <p>A new user has registered on the platform. Below are the details:</p>
          <ul>
            <li><strong>Username:</strong> ${userDetails.name}</li>
            <li><strong>Email:</strong> ${userDetails.email}</li>
            <li><strong>Phone Number:</strong> ${userDetails.phone}</li>
            <li><strong>Registration Date/Time:</strong> ${userDetails.registrationDate}</li>
          </ul>
          <p>
            You can view and manage this user by visiting the 
            <a href="${userManagementLink}" style="color: #1a73e8; text-decoration: none;">
              User Management Page
            </a>.
          </p>
          <p>Thank you,</p>
          <footer style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>If you have any questions, please contact us at 
              <a href="mailto:support@etltool.com" style="color: #1a73e8; text-decoration: none;">support@etltool.com</a>.
            </p>
          </footer>
        </body>
      </html>
    `;

        const msg = {
            to: recipients, // Multiple recipients
            from: 'noreply@etltool.com', // Replace with your verified sender
            subject,
            html: htmlContent,
        };

        await sgMail.sendMultiple(msg);
    } catch (error) {
        Logger.error('Error while sending notification emails:' + error);
    }
}

export default {
    SendVerificationMail,
    SendActivationMail,
    SendRejectionMail,
    SendResetPasswordEmail,
    sendNewUserNotificationEmail,
};
