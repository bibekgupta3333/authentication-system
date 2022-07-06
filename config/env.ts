import { config } from 'dotenv';

config();

export const ENV = {
  APPLICATION_PORT: process.env.APPLICATION_PORT ?? 3000,
  APP_VERSION: 'api/v2',
  APP_SECRET:
    process.env.APP_SECRET ??
    'XMViKBFv5Mv-BoginpMTMA4MVWiqFnQgRc5Vu-YrpIGIdVN0L4y8jFWVx_hSpDYjB-A',
  APP_SECRET_SALT: process.env.APP_SECRET_SALT ?? 'uJ5fwE9vlBWb0A',
  APP_SALT_ROUNDS: 10,

  // JWT
  JWT: {
    RESET_PASSWORD_EXPIRATION: '1h',
    ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES ?? 7, // days
    REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? 30, // days
  },

  // Authentication System
  APP_SESSION_COOKIE: '__session__',
  APP_ACCESS_TOKEN: 'access_token',
  APP_REFRESH_TOKEN: 'refresh_token',
  APP_HEADER_ACCESS: 'x-access-token',
  APP_HEADER_REFRESH: 'x-refresh-token',

  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_NAME ?? '',
    KEY: process.env.CLOUDINARY_KEY ?? '',
    SECRET: process.env.CLOUDINARY_SECRET ?? '',
  },

  // Frontend Metadata
  FRONTEND: {
    URI: process.env.FRONTEND_URI ?? '',
    // [NOTE]: Must add token when generating email template.
    RESET_ENDPOINT: `${process.env.FRONTEND_URI}/auth?page=reset-password`,
    VERIFY_EMAIL_ENDPOINT: `${process.env.FRONTEND_URI}/auth?page=verify-email`,
  },

  // Email Options
  EMAIL: {
    HOST: process.env.EMAIL_HOST ?? '',
    PORT: +process.env.EMAIL_PASSWORD ?? 9999,
    HOST_USER: process.env.EMAIL_HOST_USER ?? '',
    HOST_PASSWORD: process.env.EMAIL_HOST_PASSWORD ?? '',
  },

  // Third Party Configuration
  THIRD_PARTY: {
    APP_FACEBOOK: {
      ENDPOINT: 'https://graph.facebook.com/me',
      CLIENT_ID: process.env.FB_CLIENT_ID,
      CLIENT_SECRET: process.env.FB_CLIENT_SECRET,
      SCOPES: ['id', 'email', 'picture'],
    },
    APP_GOOGLE: {
      ENDPOINT: 'https://oauth2.googleapis.com/tokeninfo',
      CLIENT_ID: process.env.GOGL_CLIENT_ID,
      CLIENT_SECRET: process.env.GOGL_CLIENT_SECRET,
    },
  },
  //
};

export default () => ENV;
