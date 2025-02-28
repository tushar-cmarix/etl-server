import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { CreateAccountDTO, UpdateAccountDTO } from '../dtos/account.dto';
import { ObjectId } from 'mongoose';
import { AccountDocument, Account } from '../models/accounts.model';

const createAccount = async (accountBody: CreateAccountDTO) => {
    return Account.create(accountBody);
};

const queryAccounts = async (
    filter: { [key: string]: any },
    options: { [key: string]: any }
) => {
    const accounts = await Account.paginate(filter, options);
    return accounts;
};

const getAccountById = async (
    id: string | ObjectId
): Promise<AccountDocument | null> => {
    return await Account.findById(id);
};

const getAccountByEmail = async (
    email: string
): Promise<AccountDocument | null> => {
    return await Account.findOne({ email });
};

const updateAccountById = async (
    accountId: string | ObjectId,
    updateBody: UpdateAccountDTO
) => {
    const account = await getAccountById(accountId);
    if (!account) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }

    Object.assign(account, updateBody);
    await account.save();
    return account;
};

const deleteAccountById = async (accountId: string | ObjectId) => {
    const account = await getAccountById(accountId);
    if (!account) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    await account.deleteOne();
    return account;
};

export default {
    createAccount,
    queryAccounts,
    getAccountById,
    getAccountByEmail,
    updateAccountById,
    deleteAccountById,
};
