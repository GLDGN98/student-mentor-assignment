import React, { createContext, useState, useContext } from "react"

const ErrorContext = createContext()

export const useError = () => useContext(ErrorContext)

export const ErrorProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState("")

  const showError = (message) => {
    setErrorMessage(message)
  }

  const hideError = () => {
    setErrorMessage("")
  }

  return (
    <ErrorContext.Provider value={{ errorMessage, showError, hideError }}>
      {children}
    </ErrorContext.Provider>
  )
}
