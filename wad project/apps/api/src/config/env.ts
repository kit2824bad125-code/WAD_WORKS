import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or current directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fixnear_db?schema=public',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'fixnear_super_secure_jwt_access_secret_2026_x89f',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fixnear_super_secure_jwt_refresh_secret_2026_z12k',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_FixNearMockKeyId123',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'FixNearMockSecretKey456',
  MAPS_API_KEY: process.env.MAPS_API_KEY || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'fixnear-demo',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '1234567890',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'abcdef1234567890',
  EMAIL_API_KEY: process.env.EMAIL_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'notifications@fixnear.dev',
};
