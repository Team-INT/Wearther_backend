const DEFAULT_ACCESS_TIME = 60; // 1시간
const DEFAULT_REFRESH_TIME = 1440; // 24시간

export const JWT_CONFIG = {
  access: {
    expiresIn: (parseInt(process.env.ACCESS_TOKEN_TIME) || DEFAULT_ACCESS_TIME) * 60,
    secret: process.env.JWT_SECRET || 'default-secret-key',
  },
  refresh: {
    expiresIn: (parseInt(process.env.REFRESH_TOKEN_TIME) || DEFAULT_REFRESH_TIME) * 60,
    secret: process.env.JWT_SECRET || 'default-secret-key',
  },
} as const;
