const codeBlockService = require("../apis/code-block/code-block.service") // Code block service for database operations

let codeBlockMentors = {} // Tracks mentors for each code block
let usersInRooms = {} // Tracks users (and their roles) in each room

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id)

    // Handle user joining a code block
    socket.on("joinCodeBlock", (codeBlockId) =>
      handleJoinCodeBlock(socket, codeBlockId)
    )

    // Handle code block edits
    socket.on("editCodeBlock", (codeBlockData) =>
      handleEditCodeBlock(codeBlockData)
    )

    // Handle socket disconnection
    socket.on("disconnect", () => handleUserDisconnect(socket))

    // Handle user explicitly leaving a code block
    socket.on("leaveCodeBlock", (codeBlock) => {
      saveCodeBlock(codeBlock)
    })
  })

  // Adds user to room and updates role
  function handleJoinCodeBlock(socket, codeBlockId) {
    socket.join(codeBlockId)
    console.log(`Socket ${socket.id} joined room ${codeBlockId}`)

    addUserToRoom(socket.id, codeBlockId)
    assignRole(socket, codeBlockId)
    broadcastUserList(codeBlockId)
  }

  // Saves the code block's current state
  async function saveCodeBlock(codeBlock) {
    try {
      await codeBlockService.update(codeBlock.id, {
        ...codeBlock,
        code: codeBlock.code,
      })
      console.log(`Auto-saved code block for room ${codeBlock.id}`)
    } catch (error) {
      console.error(
        `Error auto-saving code block for room ${codeBlock.id}:`,
        error
      )
    }
  }

  // Broadcasts updated code block to all users in the room
  function handleEditCodeBlock(updatedCodeBlock) {
    io.to(updatedCodeBlock.id).emit("codeBlockUpdated", updatedCodeBlock)
  }

  // Removes user from all rooms on disconnect
  function handleUserDisconnect(socket) {
    console.log("Client disconnected", socket.id)
    removeUserFromAllRooms(socket.id)
  }

  // Adds a user to a room and assigns a role
  function addUserToRoom(socketId, codeBlockId) {
    if (!usersInRooms[codeBlockId]) {
      usersInRooms[codeBlockId] = new Map() // Initialize as a Map for efficient lookups
    }
    let assignedRole = codeBlockMentors[codeBlockId] ? "Student" : "Mentor"
    usersInRooms[codeBlockId].set(socketId, {
      id: socketId,
      role: assignedRole,
    })
  }

  // Assigns a mentor or student role to the user
  function assignRole(socket, codeBlockId) {
    if (!codeBlockMentors[codeBlockId]) {
      codeBlockMentors[codeBlockId] = socket.id
      io.to(codeBlockId).emit("assignRole", {
        socketId: socket.id,
        role: "Mentor",
      })
    } else {
      socket.emit("assignRole", { socketId: socket.id, role: "Student" })
    }
  }

  // Sends updated user list to all users in the room
  function broadcastUserList(codeBlockId) {
    let usersList = Array.from(usersInRooms[codeBlockId].values())
    io.to(codeBlockId).emit("updateUserList", usersList)
  }

  // Removes a user from all rooms they are part of
  function removeUserFromAllRooms(socketId) {
    for (let codeBlockId in usersInRooms) {
      if (usersInRooms[codeBlockId].has(socketId)) {
        usersInRooms[codeBlockId].delete(socketId) // Remove user directly

        if (codeBlockMentors[codeBlockId] === socketId) {
          delete codeBlockMentors[codeBlockId] // Update mentor if necessary
        }

        broadcastUserList(codeBlockId) // Update users list
      }
    }
  }
}

module.exports = socketHandlers
