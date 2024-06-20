"use client"
import { ImCheckmark } from "react-icons/im"
import { IconContext } from "react-icons"
import { ImCross } from "react-icons/im"
import React from "react"

export default function Alert({
  message,
  color,
  display,
  //children = null,
  onClick,
}: {
  message: string
  color: string
  display: string
  //children: React.ReactNode
  onClick: (type: boolean) => void
}) {
  const alertClassProvider = (color: string) => {
    switch (color) {
      case "red":
        return "relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      case "green":
        return "relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
    }
  }
  return (
    <div
      className={alertClassProvider(color)}
      role="alert"
      style={{
        display: display,
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: "30px",
      }}
    >
      <span style={{ fontWeight: "bold" }} className="block sm:inline">
        {message}
      </span>
      <IconContext.Provider value={{ size: "1.8rem", color: "#34eb86" }}>
        <div style={{ margin: "0.5rem" }}>
          <ImCheckmark onClick={() => onClick(true)}></ImCheckmark>
        </div>
      </IconContext.Provider>
      <IconContext.Provider value={{ size: "1.5rem", color: "red" }}>
        <div style={{ margin: "0.5rem" }}>
          <ImCross onClick={() => onClick(false)}></ImCross>
        </div>
      </IconContext.Provider>
    </div>
  )
}
