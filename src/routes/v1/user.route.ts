import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import userValidation from '../../validations/user.validation';
import userController from '../../controllers/user.controller';

const router = express.Router();

router
    .route('/')
    .post(
        auth(),
        validate(userValidation.createUser),
        userController.createUser
    )
    .get(auth(), validate(userValidation.getUsers), userController.getUsers);

router
    .route('/:userId')
    .get(auth(), validate(userValidation.getUser), userController.getUser)
    .patch(
        auth(),
        validate(userValidation.updateUser),
        userController.updateUser
    )
    .delete(
        auth(),
        validate(userValidation.deleteUser),
        userController.deleteUser
    );

export default router;
