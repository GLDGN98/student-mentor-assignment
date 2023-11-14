import { httpService } from "./http.service.js"

export const BEcodeBlockService = {
  query,
  getById,
  save,
  remove,
}
window.cs = BEcodeBlockService

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

async function getById(codeBlockId) {
  try {
    const response = await httpService.get(`code-block/${codeBlockId}`)
    return response
  } catch (error) {
    console.error("Error getting code block:", error)
    throw error.response.data
  }
}

async function remove(codeBlockId) {
  try {
    return httpService.delete(`code-block/${codeBlockId}`)
  } catch (error) {
    console.error("Error removing code block:", error)
    throw error.response.data
  }
}

async function save(codeBlock) {
  try {
    var savedBlockCode
    if (codeBlock.id) {
      savedBlockCode = await httpService.put(
        `code-block/${codeBlock.id}`,
        codeBlock
      )
    } else {
      savedBlockCode = await httpService.post("code-block", codeBlock)
    }
    return savedBlockCode
  } catch (error) {
    console.error("Error saveing code block:", error)
    throw error.response.data
  }
}
