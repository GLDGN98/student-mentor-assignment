import { httpService } from "./http.service.js"

export const BEcodeBlockService = {
  query,
  getById,
  save,
}
window.cs = BEcodeBlockService

// Fetches a list of code blocks and sorts them alphabetically by title
async function query() {
  try {
    const codeBlocks = await httpService.get("code-block")
    const sortedCodeBlocks = codeBlocks.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    return sortedCodeBlocks
  } catch (error) {
    console.error("Error fetching code block:", error)
    throw error.response.data
  }
}

// Retrieves a specific code block by its ID
async function getById(codeBlockId) {
  try {
    const response = await httpService.get(`code-block/${codeBlockId}`)
    return response
  } catch (error) {
    console.error("Error getting code block:", error)
    throw error.response.data
  }
}

// Saves a code block
async function save(codeBlock) {
  try {
    var savedBlockCode
    if (codeBlock.id) {
      savedBlockCode = await httpService.put(
        `code-block/${codeBlock.id}`,
        codeBlock
      )
    }
    return savedBlockCode
  } catch (error) {
    console.error("Error saveing code block:", error)
    throw error.response.data
  }
}
