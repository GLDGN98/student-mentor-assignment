import React from "react"
import { Routes, Route } from "react-router"
import Lobby from "./pages/lobby"
import CodeBlockDetails from "./pages/code-block-details"
import { ErrorProvider } from "./context/error-context"
import "./assets/styles/main.scss"

export function RootCmp() {
  return (
    <div>
      <ErrorProvider>
        <main className="main-container">
          <Routes>
            <Route path="/" element={<Lobby />} />
            <Route path="/code-block/:id" element={<CodeBlockDetails />} />
          </Routes>
        </main>
      </ErrorProvider>
    </div>
  )
}
