import { Router } from 'express';
import { authController as controller } from '../controllers/authController';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const { check } = require('express-validator');

export const router = Router();

router.post(
  '/registration',
  [
    check(
      'password',
      'password must include at least six characters'
    ).isLength({ min: 6 }),
    check('email', 'please provide a valid email').isEmail(),
  ],
  controller.registration
);

router.post(
  '/login',
  [check('email', 'please provide a valid email').isEmail()],
  controller.login
);

router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.getUser
);
