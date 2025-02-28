import express from 'express';
import { commonController } from '../../controllers';
const router = express.Router();

router.route('platform').get(commonController.fetchPlatforms);

export default router;
