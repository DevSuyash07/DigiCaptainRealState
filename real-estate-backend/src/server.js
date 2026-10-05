import 'dotenv/config';
import app from './app.js';
import prisma from './utils/prisma.js'; // ⬅️ IMPORT PRISMA

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
});

// ==========================================
// 🛡️ PRODUCTION-READY GRACEFUL SHUTDOWN
// ==========================================

const gracefulShutdown = (signal) => {
  console.log(`\n🛑 [${signal}] signal received. Starting graceful shutdown...`);

  // Fallback Timeout: अगर 10 सेकंड में सब बंद नहीं हुआ, तो forcefully kill कर दो
  const timeoutId = setTimeout(() => {
    console.error('⚠️ Could not close connections in time. Forcefully shutting down.');
    process.exit(1);
  }, 10000);

  // 1. सर्वर को नए HTTP requests लेना बंद करने को कहें
  server.close(async () => {
    console.log('✅ HTTP server closed. No new requests will be accepted.');

    try {
      // 2. Database (Prisma) के कनेक्शन्स को safely क्लोज करें
      await prisma.$disconnect();
      console.log('✅ Prisma database connection closed.');

      clearTimeout(timeoutId); // Timeout को कैंसल करें क्योंकि काम हो गया
      console.log('👋 Goodbye!');
      process.exit(0); // 0 means clean/successful exit
    } catch (error) {
      console.error('❌ Error during database disconnection:', error);
      process.exit(1); // 1 means exit with error
    }
  });
};

// 1. SIGTERM (Sent by Cloud providers like AWS/Render/Docker when scaling down)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 2. SIGINT (Sent when you press Ctrl+C in terminal)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 3. Uncaught Exception (अगर कोई ऐसा error आ जाए जिसे try/catch ने नहीं पकड़ा)
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  
  // यहाँ सीधे exit करना ज़रूरी है क्योंकि ऐप unstable state में है
  process.exit(1); 
});