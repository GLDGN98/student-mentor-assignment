require("dotenv").config()
const express = require("express")
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const codeBlockRoutes = require("./apis/code-block/code-block.routes")
const socketHandlers = require("./sockets/socket-handler")

const app = express()

const server = http.createServer(app)

app.use(
  cors({
    origin: "*", // Allow all origins
  })
)

app.use(express.json())
app.use(codeBlockRoutes)

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

socketHandlers(io)

// Start the server
const PORT = process.env.PORT || 3030
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
