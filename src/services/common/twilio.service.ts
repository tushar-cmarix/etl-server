import { Twilio } from 'twilio';
import { ChallengeInstance } from 'twilio/lib/rest/verify/v2/service/entity/challenge';
import { FactorInstance } from 'twilio/lib/rest/verify/v2/service/entity/factor';
import { NewFactorInstance } from 'twilio/lib/rest/verify/v2/service/entity/newFactor';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { UserDocument } from '../../models/user.model';

const twilioClient = new Twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID as string;

async function listAllFactor(entity: string): Promise<FactorInstance[]> {
    try {
        return await twilioClient.verify.v2
            .services(TWILIO_SERVICE_SID)
            .entities(entity)
            .factors.list({ limit: 20 });
    } catch (error) {
        return [];
    }
}

async function createFactor(
    entity: string,
    identity: string
): Promise<NewFactorInstance> {
    return await twilioClient.verify.v2
        .services(TWILIO_SERVICE_SID)
        .entities(entity)
        .newFactors.create({
            factorType: 'totp',
            friendlyName: `${identity}_${process.env.NODE_ENV}`,
        });
}

async function verifyFactor(
    entity: string,
    factorSid: string,
    code: string
): Promise<FactorInstance> {
    return await twilioClient.verify.v2
        .services(process.env.TWILIO_SERVICE_SID as string)
        .entities(entity)
        .factors(factorSid)
        .update({ authPayload: code });
}

async function createChallenge(
    entity: string,
    token: string,
    factorSid: string
): Promise<ChallengeInstance> {
    return await twilioClient.verify.v2
        .services(process.env.TWILIO_SERVICE_SID as string)
        .entities(entity)
        .challenges.create({
            authPayload: token,
            factorSid: factorSid,
        });
}

async function deleteFactor(
    entity: string,
    factorSid: string
): Promise<boolean> {
    return await twilioClient.verify.v2
        .services(TWILIO_SERVICE_SID)
        .entities(entity)
        .factors(factorSid)
        .remove();
}

async function sendOTP(user: UserDocument): Promise<void> {
    await twilioClient.verify.v2
        .services(process.env.TWILIO_SERVICE_SID as string)
        .verifications.create({
            to: `+${user.phone.number}`,
            channel: 'sms',
        });
}
async function verifyOTP(
    user: UserDocument,
    otp: string
): Promise<VerificationCheckInstance> {
    return await twilioClient.verify.v2
        .services(process.env.TWILIO_SERVICE_SID as string)
        .verificationChecks.create({
            to: `+${user.phone.number}`,
            code: otp,
        });
}

export default {
    listAllFactor,
    createFactor,
    verifyFactor,
    createChallenge,
    deleteFactor,
    sendOTP,
    verifyOTP,
};
