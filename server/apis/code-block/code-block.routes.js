const express = require("express")
const router = express.Router()
const codeBlockController = require("../code-block/code-block.controller")

router.get("/api/code-block", codeBlockController.getAllCodeBlocks)
router.get("/api/code-block/:id", codeBlockController.getCodeBlockById)
router.put("/api/code-block/:id", codeBlockController.updateCodeBlock)

module.exports = router
