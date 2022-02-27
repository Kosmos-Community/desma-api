import express, { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import { 
    updateColor
 } from '../controllers/colorController';

const router: Router = express.Router();

router
    .route('/:id')
    .patch(protect, updateColor);

export { router as colorRoutes };
