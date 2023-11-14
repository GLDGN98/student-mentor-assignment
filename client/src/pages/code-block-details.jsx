import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useError } from "../context/error-context"

import socketIOClient from "socket.io-client"
import Highlight from "highlight.js"
import "highlight.js/styles/default.css"

import { BEcodeBlockService } from "../services/code-block.service"

import UserList from "../cmps/user-list"
// import CongratsLottieAnimation from "../cmps/congrats-lottie-animation"

import { BiSolidUser } from "react-icons/bi"
import { GrLinkPrevious } from "react-icons/gr"


const ENDPOINT = import.meta.env.SERVER_ENDPOINT


const CodeBlockDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showError, errorMessage } = useError()
  const [codeBlock, setCodeBlock] = useState(null)
  const [editedCode, setEditedCode] = useState("")
  const [role, setRole] = useState("")
  const [usersInRoom, setUsersInRoom] = useState([])
  const [socket, setSocket] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isUserListOpen, setIsUserListOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  
  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT)
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      newSocket.emit("joinCodeBlock", id)
    })

    newSocket.on("assignRole", (data) => {
      if (data.socketId === newSocket.id) {
        setRole(data.role)
      }
    })

    newSocket.on("updateUserList", (updatedUsersList) => {
      setUsersInRoom(updatedUsersList)
    })

    newSocket.on("codeBlockUpdated", (updatedCodeBlock) => {
      console.log(updatedCodeBlock)
      if (updatedCodeBlock.id === id) {
        setCodeBlock((prevCodeBlock) => ({
          ...prevCodeBlock,
          code: updatedCodeBlock.code,
        }))
        setEditedCode(updatedCodeBlock.code)
      }
    })

    return () => newSocket.disconnect()
  }, [id])

  useEffect(() => {
    fetchCodeBlock(id)
  }, [id])

  useEffect(() => {
    if (codeBlock) {
      Highlight.highlightAll()
    }
  }, [codeBlock])

  useEffect(() => {
    if (codeBlock && codeBlock.code === codeBlock.solution_code) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [codeBlock])

  const fetchCodeBlock = async (blockId) => {
    try {
      const codeBlockDetails = await BEcodeBlockService.getById(blockId)
      setCodeBlock(codeBlockDetails)
      setEditedCode(codeBlockDetails.code) // Initialize editedCode with the fetched code
    } catch (err) {
      console.error("Error fetching code block:", err)
      showError("Failed to load the code block. Please try again later.")
    }
  }

  const toggleUserList = () => {
    setIsUserListOpen(!isUserListOpen)
  }

  const handleCodeChange = (e) => {
    const updatedCode = e.target.value
    setEditedCode(updatedCode)
    socket.emit("editCodeBlock", { id, code: updatedCode })
  }

  const handleSave = async () => {
    try {
      const updatedCodeBlock = { ...codeBlock, code: editedCode }
      await BEcodeBlockService.save(updatedCodeBlock)
      setCodeBlock(updatedCodeBlock)
      setSuccessMessage("Changes saved successfully!")
    } catch (err) {
      console.error("Error saving code block:", err)
      showError("Failed to save the code block. Please try again later.")
    }

    setTimeout(() => {
      setSuccessMessage("")
    }, 2000)
  }

  const handleGoBackToLobby = () => {
    navigate("/")
  }

  if (!codeBlock) {
    return <div>Loading...</div>
  }

  return (
    <div className="code-block-details">
      <button onClick={handleGoBackToLobby}>
        <GrLinkPrevious />
      </button>
      <h2>{codeBlock.title}</h2>

      {role === "Student" ? (
        <>
          <textarea
            className="editor-textarea"
            value={editedCode}
            onChange={handleCodeChange}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <pre className="pre-code-block">
          <code className="hljs">{codeBlock.code || "..."}</code>
        </pre>
      )}
      {/* {showAnimation && <CongratsLottieAnimation />} */}
      <div className="user-list-icon" onClick={toggleUserList}>
        <span>{usersInRoom.length}</span>
        <BiSolidUser />
      </div>
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isUserListOpen && (
        <div className="user-list-modal">
          <UserList usersInRoom={usersInRoom} socket={socket} />
          <button onClick={toggleUserList}>Close</button>
        </div>
      )}
    </div>
  )
}

export default CodeBlockDetails
