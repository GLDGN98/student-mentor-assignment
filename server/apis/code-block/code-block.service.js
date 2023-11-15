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

const update = async (id, updatedCodeBlock) => {
  console.log(updatedCodeBlock.code)
  const { code } = updatedCodeBlock
  const updateQuery = "UPDATE code_blocks SET code = $1 WHERE id = $2"
  try {
    const result = await pool.query(updateQuery, [code, id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error in update:", error)
    throw new Error("Database query failed in update for ID: " + id)
  }
}

module.exports = {
  getAll,
  getById,
  update,
}
