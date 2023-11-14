import React from "react"
import ClipLoader from "react-spinners/ClipLoader"

const Loader = () => {
  return (
    <div className="loader">
      <ClipLoader size={100} />
    </div>
  )
}

export default Loader
