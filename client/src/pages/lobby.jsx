import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { BEcodeBlockService } from "../services/code-block.service"
import { IoMdDoneAll } from "react-icons/io"
import { BiSmile } from "react-icons/bi"
import { useError } from "../context/error-context"

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([])
  const navigate = useNavigate()
  const { showError, errorMessage } = useError()

  useEffect(() => {
    loadCodeBlocks()
  }, [])


  async function loadCodeBlocks() {
    try {
      const codeBlocksData = await BEcodeBlockService.query()
      setCodeBlocks(codeBlocksData)
    } catch (err) {
      showError("Failed to load code blocks. Please try again later.")
    }
  }

  const handleCodeBlockClick = (id) => {
    navigate(`/code-block/${id}`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#5cb85c" // Green color
      case "Medium":
        return "#f0ad4e" // Yellow color
      case "Hard":
        return "#d9534f" // Red color
      default:
        return "grey" // Default color
    }
  }

  const isCompleted = (codeBlock) => {
    return codeBlock.code === codeBlock.solution_code
  }

  return (
    <div className="lobby">
      <h1>Choose a Code Block</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="code-blocks-container">
        {codeBlocks?.map((block) => (
          <div
            key={block.id}
            className="code-block-card"
            onClick={() => handleCodeBlockClick(block.id)}
          >
            <div className="block-info">
              <span style={{ color: getDifficultyColor(block.difficulty) }}>
                {block.difficulty}
              </span>
              {isCompleted(block) && (
                <div className="completed-sign">
                  <BiSmile />
                </div>
              )}
            </div>
            <h2>{block.title}</h2>
            <pre>
              <code>{block?.code || "..."}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lobby
