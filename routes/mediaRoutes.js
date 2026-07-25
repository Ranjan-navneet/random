import { Router } from 'express';
import { getMediaList, streamMediaFile } from '../controllers/mediaController.js';

const router = Router();

router.get('/', getMediaList);
router.get('/file/:fileId', streamMediaFile);

export default router;
