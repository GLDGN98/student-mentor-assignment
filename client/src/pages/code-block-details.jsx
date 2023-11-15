import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useError } from "../context/error-context"

import socketIOClient from "socket.io-client"
import Highlight from "highlight.js"
import "highlight.js/styles/default.css"

import { BEcodeBlockService } from "../services/code-block.service"

import UserList from "../cmps/user-list"

import { BiSolidUser } from "react-icons/bi"
import { GrLinkPrevious } from "react-icons/gr"
import Loader from "../cmps/loader"

const ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT

const CodeBlockDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showError, errorMessage } = useError()
  const [codeBlock, setCodeBlock] = useState(null)
  const [editedCode, setEditedCode] = useState("")
  const [role, setRole] = useState("")
  const [usersInRoom, setUsersInRoom] = useState([])
  const [socket, setSocket] = useState(null)
  const [isUserListOpen, setIsUserListOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const currentCodeRef = useRef()

  // Initialize and manage socket connections
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

  // Keep currentCodeRef up-to-date with editedCode
  useEffect(() => {
    currentCodeRef.current = editedCode
  }, [editedCode])

  // Handle before unload event for socket disconnection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      if (socket) {
        socket.emit("leaveCodeBlock", {
          ...codeBlock,
          code: currentCodeRef.current,
        })
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      console.log(editedCode);
      window.removeEventListener("beforeunload", handleBeforeUnload)
      socket &&
        socket.emit("leaveCodeBlock", { ...codeBlock, code: editedCode })
    }
  }, [id, editedCode, socket, currentCodeRef.current])

  // Fetch code block details
  useEffect(() => {
    fetchCodeBlock(id)
  }, [])

  // Apply syntax highlighting
  useEffect(() => {
    if (codeBlock) {
      document.querySelectorAll("code.hljs").forEach((block) => {
        block.removeAttribute("data-highlighted")
      })
      Highlight.highlightAll()
    }
  }, [codeBlock])

  const fetchCodeBlock = async (blockId) => {
    try {
      const codeBlockDetails = await BEcodeBlockService.getById(blockId)
      setCodeBlock(codeBlockDetails)
      setEditedCode(codeBlockDetails.code)
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
    currentCodeRef.current = updatedCode // Update the ref synchronously
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
    return <Loader />
  }

  return (
    <div className="code-block-details">
      <button onClick={handleGoBackToLobby}>
        <GrLinkPrevious />
      </button>
      <h2>{codeBlock.title}</h2>
      {codeBlock && codeBlock.code === codeBlock.solution_code && (
        <span className="emoji">😊</span>
      )}
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
      <div className="user-list-icon" onClick={toggleUserList}>
        <span>{usersInRoom.length}</span>
        <BiSolidUser />
      </div>
      {successMessage && (
        <div style={{ color: "green", padding: "1em" }}>{successMessage}</div>
      )}
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
