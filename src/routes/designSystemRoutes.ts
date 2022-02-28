import express, { Router } from 'express';
import {
  getUserDesignSystems,
  getDesignSystems,
  getDesignSystemById,
  createDesignSystem,
  updateDesignSystem,
  deleteDesignSystem,
} from '../controllers/designSystemController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router
  .route('/:id')
  .get(protect, getDesignSystemById)
  .put(protect, updateDesignSystem)
  .delete(protect, deleteDesignSystem);
router.get('/users/:id', protect, getUserDesignSystems);
router.post('/', protect, createDesignSystem);
router.get('/', protect, getDesignSystems);

export { router as designSystemRoutes };
