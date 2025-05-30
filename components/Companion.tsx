import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const OrbContainer = styled(motion.div)`
  position: fixed;
  z-index: 9999999999999;
  cursor: pointer;
  user-select: none;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  background: rgba(24, 21, 31, 0.95);
  border: 1px solid rgba(124, 77, 255, 0.3);
  box-shadow: 0 0 20px rgba(124, 77, 255, 0.2);
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
    border-right: 1px solid rgba(124, 77, 255, 0.3);
    border-bottom: 1px solid rgba(124, 77, 255, 0.3);
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }
`;

interface GlowingOrbProps {
  $isIdle: boolean;
}

const GlowingOrb = styled(motion.div)<GlowingOrbProps>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isIdle
      ? "radial-gradient(circle at 30% 30%, #808080 0%, #4a4a4a 45%, #2d2d2d 100%)"
      : "radial-gradient(circle at 30% 30%, #FF69B4 0%, #DA70D6 45%, #9370DB 100%)"};
  box-shadow: ${(props) =>
    props.$isIdle
      ? "0 0 8px rgba(100, 100, 100, 0.3)"
      : "0 0 16px rgba(255, 105, 180, 0.5), 0 0 32px rgba(218, 112, 214, 0.3), 0 0 48px rgba(147, 112, 219, 0.2)"};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
`;

const InnerCore = styled(motion.div)<GlowingOrbProps>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isIdle
      ? "radial-gradient(circle at 30% 30%, rgba(150, 150, 150, 0.9) 0%, rgba(100, 100, 100, 0.4) 60%, transparent 100%)"
      : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 192, 203, 0.4) 60%, transparent 100%)"};
  position: absolute;
  opacity: ${(props) => (props.$isIdle ? 0.3 : 0.7)};
  transition: all 0.5s ease;
`;

const ParticleEffect = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
`;

const HeartParticle = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  &:before,
  &:after {
    position: absolute;
    content: "";
    left: 10px;
    top: 0;
    width: 10px;
    height: 16px;
    background: #ff69b4;
    border-radius: 10px 10px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  &:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`;

const RippleEffect = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 105, 180, 0.5);
  pointer-events: none;
`;

const WaterEffect = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 105, 180, 0.2) 0%,
    rgba(218, 112, 214, 0.1) 45%,
    transparent 100%
  );
  pointer-events: none;
`;

const Eye = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Pupil = styled(motion.div)`
  width: 5px;
  height: 5px;
  background: #da70d6;
  border-radius: 50%;
  position: relative;
`;

const SleepingZ = styled(motion.div)`
  position: absolute;
  font-size: 13px;
  color: #808080;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 0 4px rgba(128, 128, 128, 0.3);
`;

// Add this new styled component for the eyelid
const Eyelid = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 50%;
  background: ${props => props.$isIdle ? '#808080' : '#fff'};
  border-radius: 6px 6px 0 0;
  top: 0;
`;

interface FloatingOrbProps {
  initialX?: number;
  initialY?: number;
  idleTimeout?: number;
}

const DRAG_MESSAGES = [
  "Wheee! This is kinda fun!",
  "Do I get paid for this? 😴",
  "Where are we going now?",
  "Don't drop me, okay? 😴",
  "You're the boss, I guess.",
];

const getRandomPosition = () => ({
  x: (Math.random() - 0.5) * 4,
  y: (Math.random() - 0.5) * 4,
});

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  initialX = 20,
  initialY = 20,
  idleTimeout = 10000, // 10 seconds default
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [isHeart, setIsHeart] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [ripples, setRipples] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({
    left: undefined,
    right: undefined,
  });
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyePosition, setEyePosition] = useState(getRandomPosition());
  const [isFollowingMouse, setIsFollowingMouse] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMessage, setDragMessage] = useState("Drag me anywhere! ✨");
  const [sleepingZ, setSleepingZ] = useState<{ id: number; scale: number }[]>([]);

  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const controls = useAnimation();

  // Floating animation
  const floatY = useSpring(0, {
    stiffness: 100,
    damping: 10,
  });

  // Rolling animation
  const roll = useSpring(0, {
    stiffness: 200,
    damping: 15,
  });

  // User activity tracking
  const resetIdleTimer = useCallback(() => {
    if (isIdle) {
      controls.start("bounce");
    }
    setIsIdle(false);
  }, [isIdle, controls]);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const handleUserActivity = () => {
      resetIdleTimer();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), idleTimeout);
    };

    // Track various user activities
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Initial timer
    idleTimer = setTimeout(() => setIsIdle(true), idleTimeout);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearTimeout(idleTimer);
    };
  }, [idleTimeout, resetIdleTimer]);

  useEffect(() => {
    // Continuous floating animation
    const floatAnimation = async () => {
      while (true) {
        await floatY.set(
          Math.random() * (isIdle ? 5 : 20) - (isIdle ? 2.5 : 10)
        );
        await new Promise((resolve) =>
          setTimeout(resolve, isIdle ? 3000 : 2000)
        );
      }
    };

    // Random rolling animation
    const rollAnimation = async () => {
      while (true) {
        if (!isIdle) {
          await roll.set(Math.random() * 30 - 15);
        } else {
          await roll.set(0);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    };

    floatAnimation();
    rollAnimation();
  }, [isIdle]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isIdle) {
      interval = setInterval(() => {
        setRipples((prev) => {
          const newRipples = [...prev, Date.now()];
          if (newRipples.length > 3) {
            return newRipples.slice(-3);
          }
          return newRipples;
        });
      }, 2000); // Create new ripple every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isIdle]);

  // Update the mouse tracking effect to calculate proper eye angles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const orbRect = document
        .querySelector("#floating-orb")
        ?.getBoundingClientRect();
      if (!orbRect) return;

      // Calculate the center of each eye relative to the page
      const leftEyeCenter = {
        x: orbRect.left + 21, // 15px from left + half of eye width
        y: orbRect.top + 28, // 22px from top + half of eye height
      };

      const rightEyeCenter = {
        x: orbRect.right - 21,
        y: orbRect.top + 28,
      };

      // Calculate angles for both eyes
      const getEyeAngle = (eyeCenter: { x: number; y: number }) => {
        const deltaX = e.clientX - eyeCenter.x;
        const deltaY = e.clientY - eyeCenter.y;

        // Calculate distance from eye to cursor
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Maximum movement radius for pupil (in pixels)
        const maxRadius = 3;

        // Calculate normalized position within the maxRadius
        const moveX = (deltaX / distance) * maxRadius;
        const moveY = (deltaY / distance) * maxRadius;

        return { x: moveX || 0, y: moveY || 0 };
      };

      const leftEyePosition = getEyeAngle(leftEyeCenter);
      const rightEyePosition = getEyeAngle(rightEyeCenter);

      setMousePosition({
        left: leftEyePosition,
        right: rightEyePosition,
      });
      setIsFollowingMouse(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Add random eye movement when not following mouse
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isFollowingMouse && !isIdle) {
      interval = setInterval(() => {
        setEyePosition(getRandomPosition());
      }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFollowingMouse, isIdle]);

  // Add blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isIdle) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, Math.random() * 3000 + 2000); // Random blink between 2-5 seconds

    return () => clearInterval(blinkInterval);
  }, [isIdle]);

  // Add this new effect for sleeping animation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isIdle) {
      interval = setInterval(() => {
        setSleepingZ((prev) => {
          // Create a new Z with random scale
          const newZ = {
            id: Date.now(),
            scale: Math.random() * 0.5 + 0.8, // Random scale between 0.8 and 1.3
          };
          
          // Keep only the last 3 Z's
          const updatedZ = [...prev, newZ].slice(-3);
          return updatedZ;
        });
      }, 2000); // Create new Z every 2 seconds
    } else {
      setSleepingZ([]); // Clear Z's when not idle
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isIdle]);

  const createParticles = () => {
    if (isIdle) return; // No particles when idle
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const createHearts = () => {
    if (isIdle) return;
    const newHearts = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -40 - Math.random() * 40,
    }));
    setHearts(newHearts);
    setTimeout(() => setHearts([]), 1000);

    // Temporarily transform to heart shape
    setIsHeart(true);
    setTimeout(() => setIsHeart(false), 600);
  };

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

    setIsExpanded(true);
    createParticles();

    await controls.start({
      scale: [1, 1.3, 0.9, 1],
      transition: { duration: 0.4 },
    });

    setIsExpanded(false);
  };

  const handleDoubleClick = () => {
    if (!isIdle) {
      createHearts();
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 },
      });
    }
  };

  return (
    <OrbContainer
      id="floating-orb"
      style={{
        x,
        y: useSpring(y.get() + floatY.get(), {
          stiffness: 100,
          damping: 10,
        }),
      }}
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 48,
        bottom: window.innerHeight - 48
      }}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
    >
      <AnimatePresence>
        {isIdle && sleepingZ.map((z, index) => (
          <SleepingZ
            key={z.id}
            initial={{ 
              x: 24 + (index * 8), 
              y: -16, 
              opacity: 1, 
              scale: z.scale,
              rotate: Math.random() * 20 - 10 
            }}
            animate={{ 
              x: 32 + (index * 12),
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
        {!isIdle && (
          <>
            <WaterEffect
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <WaterEffect
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </>
        )}

        <AnimatePresence>
          {!isIdle &&
            ripples.map((id) => (
              <RippleEffect
                key={id}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              />
            ))}
        </AnimatePresence>

        <GlowingOrb
          $isIdle={isIdle}
          style={{
            rotate: roll,
            borderRadius: isHeart ? "50% 50% 45% 45%" : "50%",
            transform: isHeart ? "scaleY(1.1)" : "none",
          }}
          animate={
            !isIdle
              ? {
                  scale: [1, 1.02, 1],
                  transition: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }
              : undefined
          }
          whileHover={{
            scale: isIdle ? 1.05 : 1.1,
            transition: { duration: 0.2 },
          }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <InnerCore
            $isIdle={isIdle}
            animate={{
              scale: isExpanded ? 1.2 : 1,
              opacity: isExpanded ? 0.9 : isIdle ? 0.3 : 0.7,
              borderRadius: isHeart ? "50% 50% 45% 45%" : "50%",
            }}
          />

          {!isHeart && (
            <>
              <Eye
                style={{
                  left: "12px",
                  top: "18px",
                  scaleY: isBlinking ? 0.1 : isIdle ? 0.5 : 1,
                  overflow: "hidden"
                }}
                transition={{ duration: isBlinking ? 0.1 : 0.3 }}
              >
                {isIdle && <Eyelid $isIdle={isIdle} />}
                <Pupil
                  animate={{
                    x: isFollowingMouse ? mousePosition.left?.x : eyePosition.x,
                    y: isFollowingMouse ? mousePosition.left?.y : eyePosition.y,
                    scale: isIdle ? 0.8 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 800,
                    damping: 30,
                    mass: 0.2,
                  }}
                />
              </Eye>
              <Eye
                style={{
                  right: "12px",
                  top: "18px",
                  scaleY: isBlinking ? 0.1 : isIdle ? 0.5 : 1,
                  overflow: "hidden"
                }}
                transition={{ duration: isBlinking ? 0.1 : 0.3 }}
              >
                {isIdle && <Eyelid $isIdle={isIdle} />}
                <Pupil
                  animate={{
                    x: isFollowingMouse ? mousePosition.right?.x : eyePosition.x,
                    y: isFollowingMouse ? mousePosition.right?.y : eyePosition.y,
                    scale: isIdle ? 0.8 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 800,
                    damping: 30,
                    mass: 0.2,
                  }}
                />
              </Eye>
            </>
          )}

          <AnimatePresence>
            {particles.map((particle) => (
              <ParticleEffect
                key={particle.id}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
            {hearts.map((heart) => (
              <HeartParticle
                key={heart.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: heart.x,
                  y: heart.y,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 30 - 15,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </GlowingOrb>
      </motion.div>
    </OrbContainer>
  );
};

export default FloatingOrb;
