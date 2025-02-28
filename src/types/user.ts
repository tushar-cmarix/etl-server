import { Document } from 'mongoose';
import {
    NewFactorFactorStatuses,
    NewFactorFactorTypes,
} from 'twilio/lib/rest/verify/v2/service/entity/newFactor';

export interface JWTPayload extends Document {
    sub: any;
    email: string;
    role: string;
    type: string;
}

export enum Role {
    ADMIN = 'admin',
    RND = 'rnd',
    USER = 'user',
}

export interface NewFactorResource {
    sid: string;
    accountSid: string;
    serviceSid: string;
    entitySid: string;
    identity: string;
    binding: any;
    dateCreated: Date;
    dateUpdated: Date;
    friendlyName: string;
    status: NewFactorFactorStatuses;
    factorType: NewFactorFactorTypes;
    config: any;
    metadata: any;
    url: string;
}
