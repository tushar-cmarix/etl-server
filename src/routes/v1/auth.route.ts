import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import authController from '../../controllers/auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/register',
    validate(authValidation.register),
    authController.register
);
router.post('/signin', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post(
    '/refresh-tokens',
    validate(authValidation.refreshTokens),
    authController.refreshTokens
);
router.post(
    '/forgot-password',
    validate(authValidation.forgotPassword),
    authController.forgotPassword
);

router.post(
    '/reset-password',
    validate(authValidation.resetPassword),
    authController.resetPassword
);

router.post(
    '/verify-email',
    validate(authValidation.verifyEmail),
    authController.verifyEmail
);

const routes2FA = router
    .post('/send-sms', auth(), authController.sendSMS)
    .post('/verify-sms', auth(), authController.verifySMS)
    .get('/get-qr', auth(), authController.generateQRCode)
    .post('/verify-qr', auth(), authController.verifyQRCode);

router.use('/2fa', routes2FA);

export default router;
