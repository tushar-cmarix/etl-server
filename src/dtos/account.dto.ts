import { ObjectId } from 'mongoose';

export interface CreateAccountDTO {
    alias: string;
    platform: ObjectId;
    credential: {
        accountId: string;
        accountPass: string;
    };
}
export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {
    active?: boolean;
}
