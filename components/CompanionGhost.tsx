import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FC, useEffect, useState } from 'react';

const CompanionGhost: FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Use motion values for position tracking
  const x = useMotionValue(window.innerWidth - 80);
  const y = useMotionValue(32);
  const floatY = useSpring(0, { stiffness: 100, damping: 10 });
  
  // Create a combined spring for y motion
  const combinedY = useSpring(y.get() + floatY.get(), {
    stiffness: 100,
    damping: 10,
  });

  useEffect(() => {
    // Continuous floating animation
    const floatAnimation = async () => {
      while (true) {
        await floatY.set(Math.random() * 10 - 5);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    floatAnimation();
  }, []);

  return (
    <motion.div
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
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Ghost body */}
      <motion.div
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
            width: '5px',
            height: '5px',
            background: '#000',
            borderRadius: '50%',
          }}
          animate={isDragging ? { scale: 1.2 } : {}}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '35%',
            right: '25%',
            width: '5px',
            height: '5px',
            background: '#000',
            borderRadius: '50%',
          }}
          animate={isDragging ? { scale: 1.2 } : {}}
        />
        
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
              animate={isDragging 
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
