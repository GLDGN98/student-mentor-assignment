const codeBlockService = require("./code-block.service")

const getAllCodeBlocks = async (req, res) => {
  try {
    const codeBlocks = await codeBlockService.getAll()
    res.json(codeBlocks)
  } catch (error) {
    console.error("Error in getAllCodeBlocks:", error)
    res.status(500).send("Error fetching code blocks from database")
  }
}

const getCodeBlockById = async (req, res) => {
  const { id } = req.params
  try {
    const codeBlock = await codeBlockService.getById(id)
    if (!codeBlock) {
      return res.status(404).send("Code block not found with ID: " + id)
    }
    res.json(codeBlock)
  } catch (error) {
    console.error("Error in getCodeBlockById:", error)
    res.status(500).send("Error fetching code block by ID from database")
  }
}

const createCodeBlock = async (req, res) => {
  try {
    const newCodeBlock = await codeBlockService.create(req.body)
    res.status(201).json(newCodeBlock)
  } catch (error) {
    console.error("Error in createCodeBlock:", error)
    res.status(500).send("Error creating new code block in database")
  }
}

const updateCodeBlock = async (req, res) => {
  const { id } = req.params
  try {
    const updatedCodeBlock = await codeBlockService.update(id, req.body)
    if (!updatedCodeBlock) {
      return res
        .status(404)
        .send("No code block found for update with ID: " + id)
    }
    res.json(updatedCodeBlock)
  } catch (error) {
    console.error("Error in updateCodeBlock:", error)
    res.status(500).send("Error updating code block in database")
  }
}

module.exports = {
  getAllCodeBlocks,
  getCodeBlockById,
  createCodeBlock,
  updateCodeBlock,
}
