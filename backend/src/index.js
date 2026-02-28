const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function initDB(retries = 10) {
  while (retries) {
    try {
      console.log("Trying to connect to DB...");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS greetings (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL
        );
      `);
      console.log("Database initialized");
      return;
    } catch (err) {
      console.log("DB not ready, retrying in 5 seconds...");
      retries--;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  throw new Error("Database not available");
}

app.get("/hello", async (req, res) => {
  const result = await pool.query("SELECT * FROM greetings");
  res.json(result.rows);
});

app.post("/hello", async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    "INSERT INTO greetings (name) VALUES ($1) RETURNING *",
    [name]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });