import { motion } from "framer-motion";
import { ArrowUpRight, BadgeDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import Space from "../../space";

// Star component for individual stars
const Star = ({
  top,
  left,
  delay,
}: {
  top: number;
  left: number;
  delay: number;
}) => (
  <motion.div
    className="star"
    initial={{ opacity: 0.1 }}
    animate={{ opacity: [0.1, 1, 0.1] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      top: `${top}%`,
      left: `${left}%`,
      width: "2px",
      height: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
    }}
  />
);

export default function BannerPremium({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const [stars, setStars] = useState<
    Array<{ id: number; top: number; left: number; delay: number }>
  >([]);

  useEffect(() => {
    // Generate random stars
    const numberOfStars = 20;
    const newStars = Array.from({ length: numberOfStars }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2, // Random delay for each star
    }));
    setStars(newStars);
  }, []);

  const style = { width: showSidebar ? "100%" : "40px" };

  return (
    <div className="banner-premium-container" style={style}>
      <div
        className="banner-premium"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Star background */}
        {stars.map((star) => (
          <Star
            key={star.id}
            top={star.top}
            left={star.left}
            delay={star.delay}
          />
        ))}
        {/* Your banner content goes here */}
        {showSidebar ? (
          <>
            <p className="banner-premium-title">Premium</p>
            <p className="banner-premium-description">
              Level up your productivity with our premium features and get 100%
              access to all of our features.
            </p>
            <div className="mt-1" style={{ cursor: "pointer" }}>
              <Space gap={5}>
                <p className="banner-premium-upgrade">Upgrade to premium</p>
                <i style={{ color: "#c5b1ff", cursor: "pointer" }}>
                  <ArrowUpRight size={16} />
                </i>
              </Space>
            </div>
          </>
        ) : (
          <BadgeDollarSign size={16} />
        )}
      </div>
    </div>
  );
}
