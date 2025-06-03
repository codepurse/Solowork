import {
    AnimatePresence,
    motion,
    useAnimation,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const PandaContainer = styled(motion.div)`
  position: fixed;
  z-index: 9999999999999;
  cursor: pointer;
  user-select: none;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  background: rgba(24, 21, 31, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
  pointer-events: none;
  white-space: nowrap;
  z-index: 9999;
  top: -60px;
  left: -110%;
  text-align: center;
  width: max-content;

  &::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background: rgba(24, 21, 31, 0.95);
    border-right: 1px solid rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }
`;

interface PandaFaceProps {
  $isIdle: boolean;
}

const PandaFace = styled(motion.div)<PandaFaceProps>`
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PandaEar = styled(motion.div)`
  width: 28px;
  height: 28px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  top: -7px;

  &.left {
    left: -3px;
  }

  &.right {
    right: -3px;
  }
`;

const PandaEye = styled(motion.div)`
  width: 20px;
  height: 15px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  top: 18px;
  transform: rotate(-10deg);

  &.left {
    left: 11px;
  }

  &.right {
    right: 11px;
    transform: rotate(10deg);
  }
`;

const PandaPupil = styled(motion.div)`
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 10px;
`;

const PandaMouth = styled(motion.div)`
  position: absolute;
  top: 42px;
  width: 28px;
  height: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PandaNose = styled(motion.div)`
  width: 7px;
  height: 5px;
  background: #333;
  border-radius: 50%;
  margin-bottom: 2px;
`;

const PandaSmile = styled(motion.div)`
  width: 18px;
  height: 8px;
  border-bottom: 2px solid #333;
  border-radius: 0 0 70px 70px;
`;

const PandaCheek = styled(motion.div)`
  width: 14px;
  height: 7px;
  background: #ffc0cb;
  border-radius: 50%;
  position: absolute;
  top: 28px;
  opacity: 0.6;

  &.left {
    left: 7px;
    transform: rotate(-10deg);
  }

  &.right {
    right: 7px;
    transform: rotate(10deg);
  }
`;

const SleepingZ = styled(motion.div)`
  position: absolute;
  font-size: 13px;
  color: #333;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
`;

const DRAG_MESSAGES = [
  "Bamboo break! 🎋",
  "Taking me on an adventure? 🐼",
  "Wheeeee! 🌱",
  "Need a snack break! 🍃",
  "Are we there yet? 😴",
];

export const CompanionPanda: React.FC = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMessage, setDragMessage] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [sleepingZ, setSleepingZ] = useState<{ id: number; scale: number }[]>([]);

  const x = useMotionValue(20);
  const y = useMotionValue(20);
  const controls = useAnimation();
  const floatY = useSpring(0, { stiffness: 100, damping: 10 });
  
  // Create a separate spring for the combined y motion
  const combinedY = useSpring(y.get() + floatY.get(), {
    stiffness: 100,
    damping: 10,
  });

  // Reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (isIdle) {
      controls.start("bounce");
    }
    setIsIdle(false);
  }, [isIdle, controls]);

  // Idle timer effect
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const handleUserActivity = () => {
      resetIdleTimer();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 10000);
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    idleTimer = setTimeout(() => setIsIdle(true), 10000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearTimeout(idleTimer);
    };
  }, [resetIdleTimer]);

  // Floating animation
  useEffect(() => {
    const floatAnimation = async () => {
      while (true) {
        await floatY.set(Math.random() * (isIdle ? 5 : 20) - (isIdle ? 2.5 : 10));
        await new Promise((resolve) => setTimeout(resolve, isIdle ? 3000 : 2000));
      }
    };

    floatAnimation();
  }, [isIdle, floatY]);

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isIdle) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(blinkInterval);
  }, [isIdle]);

  // Sleeping Z's animation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isIdle) {
      interval = setInterval(() => {
        setSleepingZ((prev) => {
          const newZ = {
            id: Date.now(),
            scale: Math.random() * 0.5 + 0.8,
          };
          const updatedZ = [...prev, newZ].slice(-3);
          return updatedZ;
        });
      }, 2000);
    } else {
      setSleepingZ([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isIdle]);

  const getRandomDragMessage = () => {
    const randomIndex = Math.floor(Math.random() * DRAG_MESSAGES.length);
    return DRAG_MESSAGES[randomIndex];
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setDragMessage(getRandomDragMessage());
  };

  const handleClick = async () => {
    if (isIdle) {
      resetIdleTimer();
      return;
    }

    await controls.start({
      scale: [1, 1.2, 0.9, 1],
      transition: { duration: 0.4 },
    });
  };

  return (
    <PandaContainer
      style={{
        x,
        y: combinedY,
      }}
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 70,
        bottom: window.innerHeight - 70,
      }}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      onClick={handleClick}
    >
      <AnimatePresence>
        {isIdle && sleepingZ.map((z, index) => (
          <SleepingZ
            key={z.id}
            initial={{ 
              x: 50 + (index * 8), 
              y: -16, 
              opacity: 1, 
              scale: z.scale,
              rotate: Math.random() * 20 - 10 
            }}
            animate={{ 
              x: 60 + (index * 12),
              y: -48,
              opacity: 0,
              scale: z.scale * 1.2
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            Z
          </SleepingZ>
        ))}
      </AnimatePresence>

      {isDragging && (
        <Tooltip
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {dragMessage}
        </Tooltip>
      )}

      <motion.div
        animate={controls}
        variants={{
          bounce: {
            y: [-20, 0],
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 10,
              restDelta: 0.001,
            },
          },
        }}
      >
        <PandaEar className="left" />
        <PandaEar className="right" />
        
        <PandaFace
          $isIdle={isIdle}
          animate={{
            scale: [1, 1.02, 1],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
        >
          <PandaEye 
            className="left"
            animate={{
              scaleY: isBlinking ? 0.1 : isIdle ? 0.5 : 1,
            }}
            transition={{ duration: isBlinking ? 0.1 : 0.3 }}
          >
            <PandaPupil />
          </PandaEye>
          
          <PandaEye 
            className="right"
            animate={{
              scaleY: isBlinking ? 0.1 : isIdle ? 0.5 : 1,
            }}
            transition={{ duration: isBlinking ? 0.1 : 0.3 }}
          >
            <PandaPupil />
          </PandaEye>
          
          <PandaMouth>
            <PandaNose />
            <PandaSmile />
          </PandaMouth>
          <PandaCheek className="left" />
          <PandaCheek className="right" />
        </PandaFace>
      </motion.div>
    </PandaContainer>
  );
};

export default CompanionPanda;
