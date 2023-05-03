import express, { Router } from 'express';
import { authUser, registerUser } from '../controllers/userController';
import { validatePassword } from '../middleware/validateMiddleware';

const router: Router = express.Router();

router.route('/').post(validatePassword, registerUser);
router.post('/login', authUser);

export { router as userRoutes };
