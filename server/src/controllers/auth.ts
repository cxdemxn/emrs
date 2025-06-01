import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  Logger.info('Processing user registration request');
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    Logger.debug(`Checking if user with email ${req.body.email} already exists`);
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      Logger.warn(`Registration attempt with existing email: ${req.body.email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    Logger.debug('Creating new user account');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'ADMIN'
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    Logger.info(`User registered successfully: ${user.id}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    Logger.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  Logger.info('Processing login request');
  try {
    const { email, password } = req.body;

    // Find user
    Logger.debug(`Attempting to authenticate user: ${req.body.email}`);
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      Logger.warn(`Login attempt with non-existent email: ${req.body.email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      Logger.warn(`Failed login attempt for user: ${user.email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    Logger.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  Logger.info('Processing get profile request');
  try {
    const userId = req.user?.userId;

    if (!userId) {
      Logger.warn('Profile request without authentication');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      Logger.warn(`User not found for profile request: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    Logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
