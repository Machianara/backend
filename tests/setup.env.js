// Global test setup for environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.ML_API_URL = process.env.ML_API_URL || "http://localhost:5001/predict";
// Provide DB envs for Sequelize to avoid initialization errors during tests
process.env.DB_NAME = process.env.DB_NAME || "testdb";
process.env.DB_USER = process.env.DB_USER || "user";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "password";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_DIALECT = process.env.DB_DIALECT || "sqlite";
