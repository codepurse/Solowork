import { motion } from "framer-motion";
import { useState } from "react";

interface StarButtonProps {
  isStarred: boolean;
  onToggle: () => void;
  size?: number;
}

export const StarButton: React.FC<StarButtonProps> = ({
  isStarred,
  onToggle,
  size = 24,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    setIsAnimating(true);
    onToggle();
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Burst particles */}
      {isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                scale: 0,
                opacity: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
                x: Math.cos(i * (Math.PI / 4)) * 20,
                y: Math.sin(i * (Math.PI / 4)) * 20,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "#FFD700",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </>
      )}

      {/* Star icon */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={isStarred ? "#FFD700" : "none"}
        stroke={isStarred ? "#FFD700" : "#EEEEEE"}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        animate={
          isAnimating
            ? {
                scale: [1, 1.3, 0.9, 1],
                rotate: [0, 15, -15, 0],
              }
            : {}
        }
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        style={{ cursor: "pointer" }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </motion.svg>
    </div>
  );
};
