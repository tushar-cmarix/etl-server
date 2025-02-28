import { User } from '../models/user.model';
import TwilioService from './common/twilio.service';
import Logger from '../config/logger';
import { UserDocument } from '../models/user.model';
import tokenService from './token.service';
import { Role } from '../types/user';
import emailService from './common/email.service';
import qrcode from 'qrcode';

async function sendSMS(userId: string) {
    const user = await User.findOne({
        id: userId,
    });
    if (!user) {
        throw { success: false, message: 'User not found' };
    }

    await TwilioService.sendOTP(user);
    return { success: true, message: 'SMS sent successfully' };
}

async function verifySMS(user: UserDocument, otp: string) {
    if (!otp) {
        return { success: false, message: 'SMS is required.' };
    }
    try {
        const verified = await TwilioService.verifyOTP(user, otp);
        if (verified.status === 'approved') {
            const tokens = await tokenService.generateAuthTokens(user);
            return {
                success: true,
                message: 'SMS verified successfully',
                user,
                tokens,
            };
        } else {
            return {
                success: false,
                message: 'Invalid SMS Provided',
            };
        }
    } catch (error: any) {
        Logger.error(`Error while verify SMS > ${error}`);
        if (error && error?.status === 429) {
            return {
                success: false,
                message:
                    'Maximum number of verification attempts has been reached.',
            };
        }
        return { success: false, message: 'Internal server error' };
    }
}

const updateMFAStatus = async (user: UserDocument) => {
    const isNewUser = !user.is2FAEnabled;
    user.is2FAEnabled = true;

    if (isNewUser) {
        const adminEmails = await User.aggregate([
            {
                $match: {
                    role: {
                        $in: [Role.ADMIN, Role.RND],
                    },
                },
            },
        ]);
        const adminEmailAddresses = adminEmails.map(
            (admin: UserDocument) => admin.email
        );
        if (adminEmailAddresses.length) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            emailService.sendNewUserNotificationEmail(adminEmailAddresses, {
                name: user.firstname,
                email: user.email,
                phone: `+${user.phone.number}`,
                registrationDate: new Date().toLocaleString(),
            });
        }
    }
    await user.save();
};

async function generateQRCode(user: UserDocument) {
    if (user.is2FAEnabled) {
        return { success: true, qr_code: null };
    }
    if (user.twilioFactor) {
        const dataURL = await qrcode.toDataURL(user.twilioFactor?.binding?.uri);
        return { success: true, qr_code: dataURL };
    }
    const newFactor = await TwilioService.createFactor(user.id, user.email);
    const UserDoc = await User.findById(user.id);
    if (UserDoc) {
        UserDoc.twilioFactor = newFactor.toJSON();
        await UserDoc.save();
    }
    const qr_url = newFactor.binding.uri;
    const dataURL = await qrcode.toDataURL(qr_url);
    return { success: true, qr_code: dataURL };
}

async function verifyQRCode(user: UserDocument, token: string) {
    try {
        if (!token) {
            throw { success: false, message: 'Token is required.' };
        }

        const userFactor = user.twilioFactor;
        if (userFactor?.status !== 'verified') {
            const factor = await TwilioService.verifyFactor(
                user.id,
                userFactor?.sid,
                token
            );
            if (factor.status !== 'verified') {
                return { success: false, message: 'Invalid Token' };
            }
        }

        const challenge = await TwilioService.createChallenge(
            user.id,
            token,
            userFactor?.sid as string
        );
        if (challenge.status === 'approved') {
            await updateMFAStatus(user);
            const tokens = await tokenService.generateAuthTokens(user);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { twilioFactor, ...rest } = user;
            return {
                success: true,
                user: rest,
                tokens,
                message: '2FA verified successfully',
            };
        } else {
            return { success: false, message: 'Invalid Token' };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error && error?.status === 429 && error?.code === 60310) {
            return {
                success: false,
                message:
                    'Maximum number of verification attempts has been reached.',
            };
        }
        Logger.error(`Verify QR Error: ${JSON.stringify(error)}`);
        return { success: false, message: 'Internal server error' };
    }
}

export default {
    sendSMS,
    verifySMS,
    generateQRCode,
    verifyQRCode,
};
