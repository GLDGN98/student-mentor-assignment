const pool = require("../../db")

const getAll = async () => {
  try {
    const result = await pool.query("SELECT * FROM code_blocks")
    return result.rows
  } catch (error) {
    console.error("Error in getAll:", error)
    throw new Error("Database query failed in getAll")
  }
}

const getById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM code_blocks WHERE id = $1", [
      id,
    ])
    return result.rows.length ? result.rows[0] : null
  } catch (error) {
    console.error("Error in getById:", error)
    throw new Error("Database query failed in getById for ID: " + id)
  }
}

const create = async (newCodeBlock) => {
  const { title, code, solution_code, difficulty } = newCodeBlock
  const insertQuery =
    "INSERT INTO code_blocks (title, code, solution_code, difficulty) VALUES ($1, $2, $3, $4) RETURNING *"
  try {
    const result = await pool.query(insertQuery, [
      title,
      code,
      solution_code,
      difficulty,
    ])
    return result.rows[0]
  } catch (error) {
    console.error("Error in create:", error)
    throw new Error("Database query failed in create")
  }
}

const update = async (id, updatedCodeBlock) => {
  const { title, code, solution_code, difficulty } = updatedCodeBlock
  const updateQuery =
    "UPDATE code_blocks SET title = $1, code = $2, solution_code = $3, difficulty = $4 WHERE id = $5 RETURNING *"
  try {
    const result = await pool.query(updateQuery, [
      title,
      code,
      solution_code,
      difficulty,
      id,
    ])
    return result.rowCount ? result.rows[0] : null
  } catch (error) {
    console.error("Error in update:", error)
    throw new Error("Database query failed in update for ID: " + id)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
}
