import { Document } from 'mongoose';

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
