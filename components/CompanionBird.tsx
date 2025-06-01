import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled(motion.div)`
  position: fixed;
  z-index: 9999999999999;
  cursor: pointer;
  user-select: none;
  width: 120px;
  height: 120px;
`;

const Bird = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Face = styled(motion.div)`
  position: relative;
  width: 90px;
  height: 90px;
  background: #FFE5D9;
  border: 4px solid #000;
  border-radius: 50%;
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 20px;
    background: #FFE5D9;
    border: 4px solid #000;
    border-radius: 50% 50% 0 0;
    border-bottom: none;
  }
`;

const Eyes = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  display: flex;
  justify-content: space-between;
`;

const Eye = styled(motion.div)`
  width: 12px;
  height: 12px;
  background: #000;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 4px;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
  }
`;

const Eyelid = styled(motion.div)`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #FFE5D9;
  border: 3px solid #000;
  border-radius: 50%;
  top: -3px;
  left: -3px;
`;

const Cheek = styled.div`
  position: absolute;
  width: 15px;
  height: 10px;
  background: #FFB7B7;
  border-radius: 50%;
  top: 50%;

  &.left {
    left: 15%;
  }

  &.right {
    right: 15%;
  }
`;

const EmoteBubble = styled(motion.div)`
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  color: #000;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  white-space: nowrap;
  border: 2px solid #000;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: white;
    border-right: 2px solid #000;
    border-bottom: 2px solid #000;
  }
`;

const EMOTES = [
  "🎵 *tweet tweet*",
  "✨ *happy chirp*",
  "🌟 *bounces joyfully*",
  "🍃 *dances around*",
  "🌸 *giggles*",
];

export const CompanionBird = () => {
  const [emote, setEmote] = useState("");
  const [scale, setScale] = useState(1);
  const [isBlinking, setIsBlinking] = useState(false);

  // Blinking animation
  useEffect(() => {
    const startBlinking = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    // Initial delay before starting blink cycle
    const initialDelay = setTimeout(() => {
      startBlinking();
      // Start the blink interval after initial blink
      const blinkInterval = setInterval(() => {
        startBlinking();
      }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

      return () => clearInterval(blinkInterval);
    }, Math.random() * 1000);

    return () => clearTimeout(initialDelay);
  }, []);

  const handleClick = async () => {
    setEmote(EMOTES[Math.floor(Math.random() * EMOTES.length)]);
    
    // Bounce animation
    setScale(1.1);
    setTimeout(() => setScale(1), 200);

    // Clear emote after delay
    setTimeout(() => {
      setEmote("");
    }, 2000);
  };

  return (
    <Container
      drag
      dragMomentum={false}
      initial={{ x: window.innerWidth - 150, y: window.innerHeight - 150 }}
      animate={{
        y: ["0%", "-8%", "0%"],
        scale: scale,
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.2
        }
      }}
      onClick={handleClick}
    >
      <AnimatePresence>
        {emote && (
          <EmoteBubble
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {emote}
          </EmoteBubble>
        )}
      </AnimatePresence>

      <Bird>
        <Face>
          <Eyes>
            <Eye>
              <AnimatePresence>
                {isBlinking && (
                  <Eyelid
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>
            </Eye>
            <Eye>
              <AnimatePresence>
                {isBlinking && (
                  <Eyelid
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>
            </Eye>
          </Eyes>
          <Cheek className="left" />
          <Cheek className="right" />
        </Face>
      </Bird>
    </Container>
  );
};

export default CompanionBird; 