import { motion } from "framer-motion";
import { useState } from "react";

export default function FolderList() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="modern-folder-container mt-4"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="folder-glow"
        animate={{
          opacity: isHovered ? 0.5 : 0,
          scale: isHovered ? 1.1 : 1,
          transition: { duration: 0.2 },
        }}
      />
      <motion.div
        className="folder-main"
        animate={{
          y: isHovered ? -2 : 0,
          transition: { duration: 0.2 },
        }}
      >
        <motion.div
          className="folder-tab"
          animate={{
            rotateX: isHovered ? "30deg" : "0deg",
            transition: { duration: 0.3 },
          }}
        />
        <motion.div
          className="folder-papers"
          animate={{
            y: isHovered ? -3 : 0,
            transition: { duration: 0.2 },
          }}
        />
        <motion.div
          className="folder-front"
          animate={{
            scaleY: isHovered ? 1.02 : 1,
            transition: { duration: 0.2 },
          }}
        />
      </motion.div>
    </motion.div>
  );
}
