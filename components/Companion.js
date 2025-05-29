import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState } from "react";

export const PixelSpirit = ({ initialX = 20, initialY = 20 }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Motion values for smooth dragging
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  // Springy rotation for playful effect
  const rotation = useSpring(0, {
    stiffness: 300,
    damping: 20,
  });

  // Floating animation
  const y2 = useTransform(
    useSpring(useMotionValue(0), {
      stiffness: 100,
      damping: 10,
    }),
    [0, 1],
    [0, -10]
  );

  const controls = useAnimation();

  const handleHoverStart = () => {
    setIsHappy(true);
    rotation.set(10);
    controls.start({
      scale: 1.2,
      transition: { duration: 0.2 },
    });
  };

  const handleHoverEnd = () => {
    setIsHappy(false);
    rotation.set(0);
    controls.start({
      scale: 1,
      transition: { duration: 0.2 },
    });
  };

  const handleDragStart = () => {
    controls.start({
      scale: 0.9,
      transition: { duration: 0.2 },
    });
  };

  const handleDragEnd = () => {
    controls.start({
      scale: 1,
      transition: { duration: 0.2 },
    });
  };

  const handleSuccess = () => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 1500); // Reset after animation
  };

  return (
    <motion.div
      style={{
        position: "fixed",
        x,
        y: useTransform([y, y2], ([y, y2]) => y + y2),
        cursor: "grab",
        zIndex: 9999,
      }}
      animate={controls}
      drag
      dragMomentum={false}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      <motion.div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          background: "linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)",
          boxShadow: "0 4px 15px rgba(0,242,254,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          rotate: rotation,
        }}
      >
        <motion.div
          animate={{
            background: isHappy
              ? "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)"
              : "linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)",
            transition: { duration: 0.3 },
          }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          {/* Eyes */}
          <motion.div
            animate={{
              height: isHappy ? "8px" : "12px",
              y: isHappy ? 2 : 0,
            }}
            style={{
              position: "absolute",
              left: "6px",
              top: "10px",
              width: "8px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          />
          <motion.div
            animate={{
              height: isHappy ? "8px" : "12px",
              y: isHappy ? 2 : 0,
            }}
            style={{
              position: "absolute",
              right: "6px",
              top: "10px",
              width: "8px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          />

          {/* Mouth */}
          <motion.div
            animate={{
              d: isHappy ? "M 10 28 Q 20 35 30 28" : "M 10 30 Q 20 30 30 30",
            }}
            style={{
              position: "absolute",
              bottom: "8px",
              left: "5px",
              right: "5px",
              height: "2px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PixelSpirit;
