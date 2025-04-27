//import { Sequelize } from 'sequelize';

// Log the environment variables being used for debugging
//console.log('Database configuration:');
//console.log('DB_HOST:', process.env.DB_HOST);
//console.log('DB_PORT:', process.env.DB_PORT);
//console.log('DB_USER:', process.env.DB_USER);
//console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
//console.log('DB_NAME:', process.env.DB_NAME);

//const sequelize = new Sequelize(
  //process.env.DB_NAME || 'bookswap_db',
 // process.env.DB_USER || 'bookswap_user',
 // process.env.DB_PASSWORD || 'admin',
  //{
   // host: process.env.DB_HOST || 'localhost',
    //port: parseInt(process.env.DB_PORT || '3306', 10),
    //dialect: 'mysql',
    //logging: false, // Set to true if you want to see SQL queries
 // }
//);

//export default sequelize;
import { Sequelize } from 'sequelize';

// Log the environment variables being used for debugging
console.log('Database configuration:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Temporarily hardcode credentials to test
const sequelize = new Sequelize(
  'bookswap_db', // Database name
  'bookswap_user', // Username
  'admin', // Password
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false, // Set to true to see SQL queries
  }
);

// Test the connection immediately
sequelize.authenticate()
  .then(() => console.log('Database connection successful'))
  .catch((err: Error) => console.error('Database connection failed:', err.message));

export default sequelize;
