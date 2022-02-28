import express, { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
    createColors,
    deleteColors
 } from '../controllers/colorController';

const router: Router = express.Router();

router
    .route('/')
    .post(protect, createColors)
router
    .route('/:id')
    .delete(protect, deleteColors);

export { router as colorRoutes };
