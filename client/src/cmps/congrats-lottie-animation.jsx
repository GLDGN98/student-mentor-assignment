import React from "react"
import Lottie from "react-lottie"
import animationData from "../assets/animations/smily-animation.json"

const CongratsLottieAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  return (
    <div className="lottie-animation">
      <Lottie options={defaultOptions} height={300} width={300} />
    </div>
  )
}

export default CongratsLottieAnimation
