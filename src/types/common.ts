// import { Request } from 'express';
import { UserDocument } from '../models/user.model';

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}
export interface AdminNotification {
    name: string;
    email: string;
    phone: string;
    registrationDate: string; // Ensure the date is in a readable format
}
