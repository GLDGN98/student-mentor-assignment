let codeBlockMentors = {}
let usersInRooms = {} // New object to track users in each room

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id)

    socket.on("joinCodeBlock", (codeBlockId) =>
      handleJoinCodeBlock(socket, codeBlockId)
    )
    socket.on("editCodeBlock", (data) => handleEditCodeBlock(socket, data))
    socket.on("disconnect", () => handleDisconnect(socket))
  })

  function handleJoinCodeBlock(socket, codeBlockId) {
    socket.join(codeBlockId)
    console.log(`Socket ${socket.id} joined room ${codeBlockId}`)

    addUserToRoom(socket.id, codeBlockId)
    assignRole(socket, codeBlockId)
    broadcastUserList(codeBlockId)
  }

  function handleEditCodeBlock(socket, data) {
    console.log(data)
    io.to(data.id).emit("codeBlockUpdated", data)
  }

  function handleDisconnect(socket) {
    console.log("Client disconnected", socket.id)
    removeUserFromAllRooms(socket.id)
  }

  function addUserToRoom(socketId, codeBlockId) {
    if (!usersInRooms[codeBlockId]) {
      usersInRooms[codeBlockId] = []
    }
    let assignedRole = codeBlockMentors[codeBlockId] ? "Student" : "Mentor"
    usersInRooms[codeBlockId].push({ id: socketId, role: assignedRole })
  }

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

  function broadcastUserList(codeBlockId) {
    let usersList = usersInRooms[codeBlockId].map((user) => ({
      id: user.id,
      role: user.role,
    }))
    io.to(codeBlockId).emit("updateUserList", usersList)
  }

  function removeUserFromAllRooms(socketId) {
  // Loop through each codeBlockId, which is a key in the codeBlockMentors object
  for (let codeBlockId in codeBlockMentors) {
    // Check if the current codeBlockId's mentor is the one to be removed
    if (codeBlockMentors[codeBlockId] === socketId) {
      delete codeBlockMentors[codeBlockId]; // Remove the mentor from the code block
      io.to(codeBlockId).emit("mentorDisconnected"); // Notify users in the room about the mentor's disconnection
    }

    // Now, check and handle the usersInRooms object
    // Ensure the codeBlockId exists in usersInRooms to avoid undefined errors
    if (usersInRooms[codeBlockId]) {
      // Find if the user (socketId) exists in the current room's users list
      let wasInRoom = usersInRooms[codeBlockId].find(user => user.id === socketId);
      if (wasInRoom) {
        // Filter out the user from the room's user list
        usersInRooms[codeBlockId] = usersInRooms[codeBlockId].filter(user => user.id !== socketId);
        broadcastUserList(codeBlockId); // Broadcast the updated user list to the room
      }
    }
  }
}

}

module.exports = socketHandlers
