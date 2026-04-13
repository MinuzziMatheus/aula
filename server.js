require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const port = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
