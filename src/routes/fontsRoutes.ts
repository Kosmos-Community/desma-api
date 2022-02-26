import express, { Router } from 'express';
import {
  getFonts,
  createFonts,
  updateFonts,
} from '../controllers/fontsController';

const router: Router = express.Router();

router.route('/:id').get(getFonts).put(updateFonts);
router.post('/', createFonts);

export { router as fontsRoutes };
