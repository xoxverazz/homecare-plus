// Database Configuration
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'homecare_plus',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Check if tables exist
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (tables.length === 0) {
      console.log('📊 Initializing database tables...');
      // Tables will be created by running schema.sql manually
      console.log('⚠️  Please run database/schema.sql to create tables');
    } else {
      console.log('✅ Database tables already exist');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
