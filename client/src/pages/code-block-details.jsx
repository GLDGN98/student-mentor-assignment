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
  const [codeBlock, setCodeBlock] = useState(null)
  const [editedCode, setEditedCode] = useState("")
  const [role, setRole] = useState("")
  const [usersInRoom, setUsersInRoom] = useState([])
  const [socket, setSocket] = useState(null)
  const [isUserListOpen, setIsUserListOpen] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const { showError, errorMessage } = useError()
  const currentCodeRef = useRef()
  const debounceTimerRef = useRef()

  // Initialize and manage socket connections for real-time collaboration
  useEffect(() => {
    // Establish a socket connection
    const newSocket = socketIOClient(ENDPOINT)
    setSocket(newSocket)

    // Register event handlers for socket events
    newSocket.on("connect", () => {
      // Join a room for the specific code block
      newSocket.emit("joinCodeBlock", id)
    })

    // Handle user role assignment from server
    newSocket.on("assignRole", (data) => {
      if (data.socketId === newSocket.id) {
        setRole(data.role)
      }
    })

    // Update the list of users in the room
    newSocket.on("updateUserList", (updatedUsersList) => {
      setUsersInRoom(updatedUsersList)
    })

    // Handle real-time updates to the code block
    newSocket.on("codeBlockUpdated", (updatedCodeBlock) => {
      if (updatedCodeBlock.id === id) {
        setCodeBlock((prevCodeBlock) => ({
          ...prevCodeBlock,
          code: updatedCodeBlock.code,
        }))
        setEditedCode(updatedCodeBlock.code)
      }
    })

    // Cleanup: disconnect socket when component unmounts
    return () => newSocket.disconnect()
  }, [id])

  // Sync editedCode with the current code reference
  useEffect(() => {
    currentCodeRef.current = editedCode

    // Auto-save code changes when component unmounts
    return () => {
      BEcodeBlockService.save({ ...codeBlock, code: editedCode })
    }
  }, [editedCode])

  // Fetch code block details on component mount
  useEffect(() => {
    fetchCodeBlock(id)
  }, [])

  // Apply syntax highlighting once code block is loaded
  useEffect(() => {
    // after the codeblock have been fetched
    if (codeBlock) {
      document.querySelectorAll("code.hljs").forEach((block) => {
        block.removeAttribute("data-highlighted")
      })
      Highlight.highlightAll()
    }
  }, [codeBlock])

  // Function to fetch code block details from backend
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

  // Debounce function to limit the rate of function execution
  const debounce = (func, delay) => {
    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(func, delay)
  }

  // Handles changes to the code in the editor
  const handleCodeChange = (e) => {
    const updatedCode = e.target.value
    setEditedCode(updatedCode)
    debounce(() => {
      socket.emit("editCodeBlock", { id, code: updatedCode })
    }, 500)
  }

  const handleGoBackToLobby = () => {
    navigate("/")
  }

  if (!codeBlock) return <Loader />

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
