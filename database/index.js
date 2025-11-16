// database/index.js
// PostgreSQL connection pool for Render deployment

const { Pool } = require("pg")

// Render 会提供 DATABASE_URL 环境变量
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL environment variable is missing.")
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Render 要求这一句允许 SSL
  },
})

// 简单测试连接（可选）
// pool.connect()
//   .then(() => console.log("✅ Database connected successfully"))
//   .catch(err => console.error("❌ Database connection error:", err))

module.exports = pool
