export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  hashIdsSalt: process.env.HASHIDS_SALT,
});
