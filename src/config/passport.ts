import {
    Strategy as JwtStrategy,
    ExtractJwt,
    VerifyCallback,
    VerifiedCallback,
    StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import config from './config';
import { TokenTypes } from './tokens';
import { User } from '../models/user.model';
import { JWTPayload } from '../types/user';

const jwtOptions: StrategyOptionsWithoutRequest = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (
    payload: JWTPayload,
    done: VerifiedCallback
) => {
    try {
        if (
            payload.type === TokenTypes.ACCESS ||
            payload.type === TokenTypes.VERIFY_2FA
        ) {
            const user = await User.findById(payload.sub);
            if (!user) {
                return done(new Error('User not found'), false);
            }
            return done(null, user);
        }
        throw new Error('Invalid token type');
    } catch (error) {
        done(error, false);
    }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
