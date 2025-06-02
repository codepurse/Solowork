import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion';
import { FC, useCallback, useEffect, useState } from 'react';

const CompanionGhost: FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ left: undefined, right: undefined });
  const [isFollowingMouse, setIsFollowingMouse] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [sleepingZ, setSleepingZ] = useState<{ id: number; scale: number }[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  // Use motion values for position tracking
  const x = useMotionValue(window.innerWidth - 80);
  const y = useMotionValue(32);
  const floatY = useSpring(0, { stiffness: 100, damping: 10 });
  const controls = useAnimation();
  const bodyControls = useAnimation();
  
  // Create a combined spring for y motion
  const combinedY = useSpring(y.get() + floatY.get(), {
    stiffness: 100,
    damping: 10,
  });

  const createParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleDoubleClick = async () => {
    if (!isIdle) {
      resetIdleTimer();
      createParticles();
      
      // Shake and giggle animation
      await bodyControls.start({
        rotate: [0, -5, 5, -5, 5, 0],
        scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
        transition: {
          duration: 0.5,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeInOut"
        }
      });
    }
  };

  // Reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (isIdle) {
      controls.start("bounce");
    }
    setIsIdle(false);
  }, [isIdle, controls]);

  // User activity tracking
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const handleUserActivity = () => {
      resetIdleTimer();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), 5000); // 5 seconds idle timeout
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
    idleTimer = setTimeout(() => setIsIdle(true), 5000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearTimeout(idleTimer);
    };
  }, [resetIdleTimer]);

  // Add sleeping Z's animation
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

  // Add random eye movement when not following mouse
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isFollowingMouse && !isIdle) {
      interval = setInterval(() => {
        setEyePosition({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        });
      }, Math.random() * 2000 + 1000);
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
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(blinkInterval);
  }, [isIdle]);

  // Update the mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isIdle) return; // Don't track mouse when idle
      
      const orbRect = document
        .querySelector("#ghost-companion")
        ?.getBoundingClientRect();
      if (!orbRect) return;

      // Calculate the center of each eye relative to the page
      const leftEyeCenter = {
        x: orbRect.left + 21,
        y: orbRect.top + 28,
      };

      const rightEyeCenter = {
        x: orbRect.right - 21,
        y: orbRect.top + 28,
      };

      // Calculate angles for both eyes
      const getEyeAngle = (eyeCenter: { x: number; y: number }) => {
        const deltaX = e.clientX - eyeCenter.x;
        const deltaY = e.clientY - eyeCenter.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxRadius = 3;
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
  }, [isIdle]);

  useEffect(() => {
    // Continuous floating animation
    const floatAnimation = async () => {
      while (true) {
        await floatY.set(Math.random() * (isIdle ? 5 : 10) - (isIdle ? 2.5 : 5));
        await new Promise(resolve => setTimeout(resolve, isIdle ? 3000 : 2000));
      }
    };

    floatAnimation();
  }, [isIdle]);

  return (
    <motion.div
      id="ghost-companion"
      style={{
        x,
        y: combinedY,
        position: 'fixed',
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 1000,
      }}
      drag
      dragMomentum={false}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 60,
        bottom: window.innerHeight - 60
      }}
      onDragStart={() => {
        setIsDragging(true);
        resetIdleTimer();
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={resetIdleTimer}
      onDoubleClick={handleDoubleClick}
    >
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: '#FFB6C1',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(255, 182, 193, 0.5)',
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Sleeping Z's */}
      {isIdle && sleepingZ.map((z, index) => (
        <motion.div
          key={z.id}
          style={{
            position: 'absolute',
            fontSize: '13px',
            color: '#808080',
            fontWeight: 'bold',
            pointerEvents: 'none',
            textShadow: '0 0 4px rgba(128, 128, 128, 0.3)',
          }}
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
        </motion.div>
      ))}
      
      {/* Ghost body */}
      <motion.div
        animate={bodyControls}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'white',
          borderRadius: '50% 50% 0 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Eyes */}
        <motion.div
          style={{
            position: 'absolute',
            top: '35%',
            left: '25%',
            width: '10px',
            height: '10px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          animate={{
            scaleY: isIdle ? 0.3 : isBlinking ? 0.1 : 1,
          }}
          transition={{ duration: isBlinking ? 0.1 : 0.3 }}
        >
          <motion.div
            style={{
              width: '5px',
              height: '5px',
              background: '#000',
              borderRadius: '50%',
            }}
            animate={{
              x: isIdle ? 0 : isFollowingMouse ? mousePosition.left?.x : eyePosition.x,
              y: isIdle ? 1 : isFollowingMouse ? mousePosition.left?.y : eyePosition.y,
              scale: isIdle ? 0.8 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 800,
              damping: 30,
              mass: 0.2,
            }}
          />
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            top: '35%',
            right: '25%',
            width: '10px',
            height: '10px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
          animate={{
            scaleY: isIdle ? 0.3 : isBlinking ? 0.1 : 1,
          }}
          transition={{ duration: isBlinking ? 0.1 : 0.3 }}
        >
          <motion.div
            style={{
              width: '5px',
              height: '5px',
              background: '#000',
              borderRadius: '50%',
            }}
            animate={{
              x: isIdle ? 0 : isFollowingMouse ? mousePosition.right?.x : eyePosition.x,
              y: isIdle ? 1 : isFollowingMouse ? mousePosition.right?.y : eyePosition.y,
              scale: isIdle ? 0.8 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 800,
              damping: 30,
              mass: 0.2,
            }}
          />
        </motion.div>
        
        {/* Wavy bottom */}
        <div style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', display: 'flex' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: '25%',
                height: '12px',
                background: 'white',
                borderRadius: '0 0 50% 50%',
              }}
              animate={isDragging || isIdle
                ? { y: 0, x: 0 } 
                : {
                    y: [-3, 3, -3],
                    x: [-1, 1, -1],
                  }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompanionGhost;
