import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import { accountController } from '../../controllers';
import accountValidation from '../../validations/account.validation';

const router = express.Router();
const { createAccount, updateAccount, byId } = accountValidation;
router
    .route('/')
    .post(auth(), validate(createAccount), accountController.createAccount)
    .get(auth(), accountController.getAccounts);

router
    .route('/:accountId')
    .get(auth(), validate(byId), accountController.getAccount)
    .put(auth(), validate(updateAccount), accountController.updateAccount)
    .delete(auth(), validate(byId), accountController.deleteAccount);
export default router;
