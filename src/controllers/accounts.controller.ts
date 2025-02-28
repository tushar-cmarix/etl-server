import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { accountService } from '../services';
import { Request, Response } from 'express';

const createAccount = catchAsync(async (req: Request, res: Response) => {
    const account = await accountService.createAccount(req.body);
    res.status(httpStatus.CREATED).send(account);
});

const getAccounts = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await accountService.queryAccounts(filter, options);
    res.send(result);
});

const getAccount = catchAsync(async (req: Request, res: Response) => {
    const account = await accountService.getAccountById(req.params.accountId);
    if (!account) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }
    res.send(account);
});

const updateAccount = catchAsync(async (req: Request, res: Response) => {
    const account = await accountService.updateAccountById(
        req.params.accountId,
        req.body
    );
    res.send(account);
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    await accountService.deleteAccountById(req.params.accountId);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createAccount,
    getAccounts,
    getAccount,
    updateAccount,
    deleteAccount,
};
