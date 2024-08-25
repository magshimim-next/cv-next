"use client";
import { useState, useEffect } from "react";
import { BiArrowFromBottom } from "react-icons/bi";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const iconStyle = {
    width: "24px",
    height: "24px",
    transition: "transform 0.2s ease-in-out",
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 50,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <BiArrowFromBottom style={iconStyle} aria-hidden="true" />
      </button>
    </div>
  );
};
