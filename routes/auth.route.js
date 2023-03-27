import { Router } from 'express';
import {
    getSignup,
    getLogin,
    signup,
    login,
    logout
} from '../controllers/auth.controller.js'
import { 
    signUpValidator, 
    loginValidator 
} from '../middleware/auth-validator.js';

const router = Router();

router.get('/signup', getSignup);
router.post('/signup', signUpValidator, signup);
router.get('/login', getLogin);
router.post('/login', loginValidator, login);
router.get('/logout', logout)

export default router;