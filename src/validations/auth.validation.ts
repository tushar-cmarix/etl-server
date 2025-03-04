import Joi from 'joi';
import { password } from './custom.validation';

const register = {
    body: Joi.object()
        .keys({
            email: Joi.string().required().email(),
            password: Joi.string().required().custom(password),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            phone: Joi.object({
                code: Joi.string().required(),
                number: Joi.string().required(),
            }).required(),
        })
        .unknown(true),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};

const verifyEmail = {
    body: Joi.object().keys({
        token: Joi.string().required(),
    }),
};

export default {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
};
