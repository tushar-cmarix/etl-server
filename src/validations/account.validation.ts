import Joi from 'joi';
import { objectId } from './custom.validation';

const createAccount = {
    body: Joi.object()
        .keys({
            alias: Joi.string().required(),
            platform: Joi.string().required().custom(objectId),
            credential: {
                accountId: Joi.string().required(),
                accountPass: Joi.string().required(),
            },
        })
        .unknown(true),
};
const updateAccount = {
    params: Joi.object().keys({
        accountId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            alias: Joi.string().required,
            platform: Joi.string().required().custom(objectId),
            credential: {
                accountId: Joi.string().required(),
                accountPass: Joi.string().required(),
            },
        })
        .unknown(true),
};

const byId = {
    params: Joi.object().keys({
        accountId: Joi.string().required().custom(objectId),
    }),
};
export default { createAccount, updateAccount, byId };
