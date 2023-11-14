import React from "react"

const UserList = ({ usersInRoom, socket }) => {
  return (
    <div className="users-list">
      <h3>Users in Room</h3>
      <ul>
        {usersInRoom.map((user) => (
          <li key={user.id}>
            {user.name} {user.role}
            {user.id === socket.id ? <b> ( Me )</b> : ""}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
