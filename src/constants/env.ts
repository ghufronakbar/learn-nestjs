import 'dotenv/config';

export const ENV = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwtRefreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  appName: process.env.APP_NAME,
};
