import React, { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import "./Login.scss";
import LoginForm from "./LoginForm";

export default function Login() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div className="login">
      <>
        <div className="center-panel">
          <LoginForm />
        </div>
      </>
    </div>
  );
}
