import { motion } from "framer-motion";

const EmptyListAnimation = () => {
  return (
    <motion.div
      className="empty-list-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <motion.path
          d="M8 2V5"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.path
          d="M16 2V5"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.path
          d="M3 8H21"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke="#94A3B8"
          strokeWidth="2"
        />
      </motion.svg>
      <motion.p
        className="empty-list-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        No tasks scheduled for this day
      </motion.p>
    </motion.div>
  );
};

export default EmptyListAnimation; 