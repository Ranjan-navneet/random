import { Router } from 'express';
import {
  getLetters,
  getActiveLetter,
  createLetter,
  updateLetter,
  deleteLetter,
} from '../controllers/letterController.js';

const router = Router();

router.get('/', getLetters);
router.get('/active', getActiveLetter);
router.post('/', createLetter);
router.put('/:id', updateLetter);
router.delete('/:id', deleteLetter);

export default router;
