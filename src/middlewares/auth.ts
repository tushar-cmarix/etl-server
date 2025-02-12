import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

const verifyCallback =
    (req: Request, _requiredRights?: string[]): passport.AuthenticateCallback =>
    async (err: Error, user: any, info) => {
        if (err || info || !user) {
            if (info instanceof TokenExpiredError) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Token expired');
            }
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
        }
        req.user = user;
        return true;
    };

const auth =
    (_requiredRights?: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        return await passport.authenticate(
            'jwt',
            { session: false },
            async (err: Error, user: any, info: any) => {
                try {
                    await verifyCallback(req)(err, user, info);
                    next();
                } catch (error) {
                    next(error);
                }
            }
        )(req, res, next);
    };

export default auth;
