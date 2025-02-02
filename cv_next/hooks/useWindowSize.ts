import { useEffect, useState, useCallback } from "react";

interface WindowSize {
  width: number;
  height: number;
  scrollHeight: number;
}

export default function useWindowSize() {
  const getInitialSize = useCallback(
    (): WindowSize => ({
      width: typeof window !== "undefined" ? window.innerWidth : 0,
      height: typeof window !== "undefined" ? window.innerHeight : 0,
      scrollHeight:
        typeof document !== "undefined"
          ? document.documentElement.scrollHeight
          : 0,
    }),
    []
  );

  const [windowSize, setWindowSize] = useState<WindowSize>(getInitialSize);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scrollHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          height
        );

        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const actualHeight = isPortrait
          ? Math.max(height, scrollHeight)
          : height;

        setWindowSize({
          width,
          height: actualHeight,
          scrollHeight: actualHeight,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(document.body);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return windowSize;
}
