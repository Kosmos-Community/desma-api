import express, { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import { 
    createPalette,
    getPalette,
    updatePalette,
    deletePalette
 } from '../controllers/paletteController';

const router: Router = express.Router();

router
    .route('/')
    .post(protect, validateRequest([
        { param_key: 'primaryColor', required: true, type: 'object' },
        { param_key: 'secondaryColor', required: true, type: 'object' },
        { param_key: 'textColor', required: true, type: 'object' },
        { param_key: 'backgroundColors', required: true, type: 'object' },
        { param_key: 'extraColors', required: true, type: 'object' },
    ]), createPalette);
router
    .route('/:id')
    .get(protect, getPalette)
    .patch(protect, validateRequest([
        { param_key: 'primaryColor', required: false, type: 'object' },
        { param_key: 'secondaryColor', required: false, type: 'object' },
        { param_key: 'textColor', required: false, type: 'object' },
        { param_key: 'backgroundColors', required: false, type: 'object' },
        { param_key: 'extraColors', required: false, type: 'object' },
    ]), updatePalette)
    .delete(protect, deletePalette);

export { router as paletteRoutes };
