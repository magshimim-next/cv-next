import { useEffect, useState } from "react";

interface windowSize {
    width: number,
    height: number,
  }
export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<windowSize>();

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []); 

    return windowSize;
  }