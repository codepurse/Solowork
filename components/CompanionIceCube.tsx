import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useState } from "react";

export default function CompanionIceCube() {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState("");

  // Add motion values for smooth dragging
  const x = useMotionValue(20);
  const y = useMotionValue(20);
  
  // Create smooth springs for x and y movement
  const springX = useSpring(x, {
    stiffness: 400,
    damping: 30
  });
  const springY = useSpring(y, {
    stiffness: 400,
    damping: 30
  });

  // Add array of random messages
  const dragMessages = [
    "Wheee! I'm flying! ✨",
    "Taking me for a walk? 🚶‍♂️",
    "Adventure time! 🌟",
    "Where are we going? 🤔",
    "I can see my house from here! 🏠",
    "Zoom zoom! 💨",
    "This is fun! 🎈",
    "I'm getting dizzy! 😵‍💫",
    "Look at me go! 🌈",
    "New spot, new adventures! 🎯",
    "I believe I can fly! 🦋",
    "Weeeeeeee! 🎢"
  ];

  // Function to get random message
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * dragMessages.length);
    return dragMessages[randomIndex];
  };

  // Trigger blink every few seconds
  React.useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Handle click and double click
  const handleClick = () => {
    setIsSquished(true);
    setTimeout(() => setIsSquished(false), 300);
  };

  const handleDoubleClick = () => {
    setIsExcited(true);
    setTimeout(() => setIsExcited(false), 1000);
  };

  const excitedAnimation = {
    scale: [1, 1.2, 1],
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  };

  // Add drag start handler
  const handleDragStart = () => {
    setCurrentTooltip(getRandomMessage());
  };

  // Add drag end handler
  const handleDragEnd = () => {
    setCurrentTooltip("");
  };

  return (
    <motion.div
      className="flex items-center justify-center cursor-move relative"
      style={{ 
        position: "fixed",
        x: springX,
        y: springY,
        zIndex: 1000 
      }}
      drag
      dragMomentum={false}
      onDrag={(_, info) => {
        x.set(info.point.x);
        y.set(info.point.y);
      }}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 150,
        bottom: window.innerHeight - 150
      }}
      whileDrag={{ scale: 0.95 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={{
        y: [-3, 3],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
    >
      {/* Add tooltip */}
      {currentTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
          style={{
            backgroundColor: "rgba(230, 230, 250, 0.95)",
            border: "2px solid #D8D8F6",
            color: "#666",
            fontSize: "14px",
            fontWeight: "500",
            zIndex: 1001,
          }}
        >
          {currentTooltip}
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 1 }}
        animate={
          isExcited
            ? excitedAnimation
            : {
                scale: [0.95, 1.05],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }
        }
      >
        <svg
          width="105"
          height="105"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow for excited state */}
          <motion.circle
            cx="100"
            cy="100"
            r="70"
            fill="#FFE6FA"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExcited ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Main pillow body */}
          <motion.path
            d="M40 100C40 60 60 40 100 40C140 40 160 60 160 100C160 140 140 160 100 160C60 160 40 140 40 100Z"
            fill="#E6E6FA"
            stroke="#D8D8F6"
            strokeWidth="4"
            animate={
              isSquished
                ? {
                    scale: 0.9,
                    scaleX: 1.1,
                  }
                : {
                    scale: 1,
                    scaleX: 1,
                  }
            }
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          />

          {/* Puffy cheeks */}
          <motion.circle
            cx="65"
            cy="105"
            r="12"
            fill="#FFD6E5"
            opacity="0.5"
            animate={{
              scale: isExcited ? 1.2 : 1,
              opacity: 0.5,
            }}
            transition={{
              duration: 0.3,
            }}
          />
          <motion.circle
            cx="135"
            cy="105"
            r="12"
            fill="#FFD6E5"
            opacity="0.5"
            animate={{
              scale: isExcited ? 1.2 : 1,
              opacity: 0.5,
            }}
            transition={{
              duration: 0.3,
            }}
          />

          {/* Wiggling ears/flaps - Updated with more realistic curves */}
          <motion.path
            d="M35 90C25 85 15 70 20 60C25 50 35 45 45 48C55 51 60 65 55 75C50 85 42 92 35 90Z"
            fill="#D8D8F6"
            animate={{
              rotate: [-3, 2],
              translateX: [-1, 1],
              translateY: [-1, 1],
              scale: [0.98, 1.02],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              times: [0, 1],
              delay: Math.random() * 0.5, // Slight random delay for more natural movement
            }}
            style={{ transformOrigin: "45px 60px" }} // Set pivot point for more natural rotation
          />
          <motion.path
            d="M165 90C175 85 185 70 180 60C175 50 165 45 155 48C145 51 140 65 145 75C150 85 158 92 165 90Z"
            fill="#D8D8F6"
            animate={{
              rotate: [3, -2],
              translateX: [1, -1],
              translateY: [-1, 1],
              scale: [0.98, 1.02],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              times: [0, 1],
              delay: Math.random() * 0.5, // Slight random delay for more natural movement
            }}
            style={{ transformOrigin: "155px 60px" }} // Set pivot point for more natural rotation
          />

          {/* Add subtle inner ear details */}
          <motion.path
            d="M30 70C35 65 40 63 45 65"
            stroke="#D0D0F0"
            strokeWidth="2"
            fill="none"
            animate={{
              opacity: [0.3, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M170 70C165 65 160 63 155 65"
            stroke="#D0D0F0"
            strokeWidth="2"
            fill="none"
            animate={{
              opacity: [0.3, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Eyes */}
          <motion.path
            d="M75 85C75 85 80 90 85 85"
            stroke="#9090B8"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{
              d: isExcited
                ? "M75 85C75 85 80 80 85 85"
                : isBlinking
                ? "M75 85C75 85 80 85 85 85"
                : "M75 85C75 85 80 90 85 85",
            }}
          />
          <motion.path
            d="M115 85C115 85 120 90 125 85"
            stroke="#9090B8"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{
              d: isExcited
                ? "M115 85C115 85 120 80 125 85"
                : isBlinking
                ? "M115 85C115 85 120 85 125 85"
                : "M115 85C115 85 120 90 125 85",
            }}
          />

          {/* Smile */}
          <motion.path
            d="M85 110C85 110 95 120 115 110"
            stroke="#9090B8"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{
              d: isExcited
                ? "M85 110C85 110 100 130 115 110"
                : isSquished
                ? "M85 115C85 115 100 120 115 115"
                : "M85 110C85 110 100 120 115 110",
            }}
            transition={{
              duration: 0.3,
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
