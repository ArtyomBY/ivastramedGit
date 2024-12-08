export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ivastrameds',
        port: parseInt(process.env.DB_PORT || '3306', 10)
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    }
};
