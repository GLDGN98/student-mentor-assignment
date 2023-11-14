const { Pool } = require("pg")

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // connectionString: process.env.POSTGRES_URL + "?sslmode=require",

})

module.exports = pool
