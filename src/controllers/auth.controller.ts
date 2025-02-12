import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import {
    userService,
    tokenService,
    authService,
    emailService,
} from '../services';
import { Role } from '../types/user';
import mfaService from '../services/mfa.service';

const register = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser({ ...req.body, role: Role.USER });
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.SendVerificationMail(user.email, verifyEmailToken);
    res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(
        email,
        password
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(
        req.body.email
    );
    await emailService.SendResetPasswordEmail(
        req.body.email,
        resetPasswordToken
    );
    res.status(httpStatus.OK).send({
        body: req.body.email,
        resetPasswordToken,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    await authService.resetPassword(
        req.query.token as string,
        req.body.password
    );
    res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const response = await authService.verifyEmail(req.body.token as string);
    res.status(httpStatus.OK).send({
        ...response,
        message: 'Email verified successfully',
    });
});

const sendSMS = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await mfaService.sendSMS(userId);
    res.status(httpStatus.OK).send(result);
});

const verifySMS = catchAsync(async (req: Request, res: Response) => {
    if (req.user) {
        const response = await mfaService.verifySMS(req.user, req.body.otp);
        res.status(httpStatus.OK).send(response);
    }
});

const generateQRCode = catchAsync(async (req: Request, res: Response) => {
    if (req.user) {
        const response = await mfaService.generateQRCode(req.user.toJSON());
        res.status(httpStatus.OK).send(response);
    }
});

const verifyQRCode = catchAsync(async (req: Request, res: Response) => {
    if (req.user) {
        const response = await mfaService.verifyQRCode(
            req.user,
            req.body.token
        );
        res.status(httpStatus.OK).send(response);
    }
});

export default {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendSMS,
    verifySMS,
    generateQRCode,
    verifyQRCode,
};
