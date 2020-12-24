import { Request, Response } from 'express';
import { Role } from '../models/roleModel';
import { User } from '../models/userModel';

const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id: string, role: string) => {
  const payload = {
    id,
    role,
  };

  return jwt.sign(payload, config.get('secretKey'), { expiresIn: '24h' });
};

export class authController {
  static async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }

      const { name, password, email } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'User with this email already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'ADMIN' });
      const user = new User({
        name,
        password: hashedPassword,
        email,
        role: [userRole!.value],
      });
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      console.error(e.message);
      res.status(400).json({ message: 'Registration error', errorData: e });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = generateToken(user._id, user.role);
      res.status(200).json({ token });
    } catch (e) {
      console.error(e.message);
      res.status(400).json({ message: 'Login error', errorData: e });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (e) {
      console.error(e.message);
      res.status(400).json({ message: e.message });
    }
  }
}
