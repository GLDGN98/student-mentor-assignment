import React from "react"

const ErrorDisplay = ({ message }) => {
  if (!message) return null

  return (
    <div style={{ color: "red" }}>
      <p>{message}</p>
    </div>
  )
}

export default ErrorDisplay
