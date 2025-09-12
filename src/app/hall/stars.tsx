import { useState, useEffect, useMemo } from "react";
import styles from "./stars.module.css";

const FloatingStars = ({ starCount = 15 }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 90}%`,
      size: Math.floor(Math.random() * 70) + 30,
      delay: 2 + Math.random() * 12,
      duration: Math.random() * 10 + 15,
    }));
  }, [starCount]);

  return (
    <div className={styles.starsContainer}>
      {isLoaded &&
        stars.map((star) => (
          <div
            key={star.id}
            className={styles.star}
            style={{
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
    </div>
  );
};

export default FloatingStars;
