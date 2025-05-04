import { OAuthProvider } from "appwrite";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { account } from "../constant/appwrite";
export default function Login() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        "http://localhost:3000", // Redirect back here
        "http://localhost:3000/login"
      );
    } catch (error) {
      console.error("❌ Error during Google login:", error);
    }
  };

  // Initialize the animated grid
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Grid configuration
    const gridSpacing = 35;

    // Create dots at grid intersections
    interface GridDot {
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
      isNode: boolean;
      connections: number[];
      // For animation
      animDirection: number;
      animPhase: number;
    }

    const gridDots: GridDot[] = [];

    // Create grid dots
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
      for (let y = 0; y <= canvas.height; y += gridSpacing) {
        // Soft, uniform grid
        const distanceFromCenter = Math.sqrt(
          Math.pow((x - canvas.width / 2) / canvas.width, 2) +
            Math.pow((y - canvas.height / 2) / canvas.height, 2)
        );

        // Dots fade out slightly toward the edges
        const alphaFalloff = 1 - distanceFromCenter * 0.6;

        // Very subtle size variation
        const sizeVariation = Math.random() * 0.2 + 0.9;

        // Randomly select a few dots to be network nodes (very sparse)
        const isNode = Math.random() < 0.05; // Only 5% of dots are nodes

        gridDots.push({
          x,
          y,
          size: isNode ? 1.5 : 1 * sizeVariation,
          // Soft blues with slight variation
          color: isNode
            ? `rgba(200, 230, 255, ${0.2 + Math.random() * 0.2})`
            : `rgba(190, 225, 255, ${0.1 + Math.random() * 0.1})`,
          alpha: isNode ? 0.5 * alphaFalloff : 0.3 * alphaFalloff,
          pulseSpeed: 0.2 + Math.random() * 0.3, // Faster pulsing for visibility
          pulseOffset: Math.random() * Math.PI * 2,
          isNode,
          connections: [],
          // Animation direction and phase
          animDirection: Math.random() < 0.5 ? 1 : -1,
          animPhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Create minimal connections between nodes (only closest neighbors)
    const connectionDistance = gridSpacing * 3; // Max distance for connections

    // Find nodes and create connections
    const nodes = gridDots.filter((dot) => dot.isNode);
    nodes.forEach((node, nodeIdx) => {
      // Find other nodes within connection distance
      const nearbyNodes = nodes
        .map((otherNode, otherIdx) => ({
          idx: gridDots.findIndex((dot) => dot === otherNode),
          distance: Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) +
              Math.pow(node.y - otherNode.y, 2)
          ),
        }))
        .filter(
          (conn) =>
            conn.distance < connectionDistance &&
            nodes[nodeIdx] !== gridDots[conn.idx]
        )
        .sort((a, b) => a.distance - b.distance);

      // Keep only 1-2 closest connections per node
      const maxConnections = Math.floor(Math.random() * 2) + 1; // 1 or 2 connections
      const connections = nearbyNodes
        .slice(0, Math.min(nearbyNodes.length, maxConnections))
        .map((conn) => conn.idx);

      // Add connections to the node
      node.connections = connections;
    });

    // Animation variables to ensure movement
    let globalAnimTime = 0;
    let flowDirection = 1;

    // Animation loop
    const animate = () => {
      globalAnimTime += 0.01 * flowDirection;

      // Occasionally change global flow direction
      if (Math.random() < 0.001) {
        flowDirection *= -1;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw very subtle grid lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(190, 225, 255, 0.03)";
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }

      ctx.stroke();

      // Current time in seconds for animation
      const time = Date.now() * 0.001;

      // First draw minimal neural connections with more visible animation
      gridDots.forEach((dot) => {
        if (dot.isNode && dot.connections.length > 0) {
          // More noticeable pulse for connections
          const connectionPulse =
            Math.sin(time * dot.pulseSpeed + dot.pulseOffset) * 0.3 + 0.7;

          // Draw minimal connections
          dot.connections.forEach((connIdx) => {
            const connectedDot = gridDots[connIdx];

            // Create a flowing effect along connections
            const flowOffset = ((time * 0.5) % 1) * dot.animDirection;
            const flowPosition = (flowOffset + globalAnimTime) % 1;

            // Draw a more visible connection line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 230, 255, ${0.1 * connectionPulse})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(connectedDot.x, connectedDot.y);
            ctx.stroke();

            // Draw small flowing particle on connection line
            const particleX = dot.x + (connectedDot.x - dot.x) * flowPosition;
            const particleY = dot.y + (connectedDot.y - dot.y) * flowPosition;

            ctx.beginPath();
            ctx.fillStyle = `rgba(220, 240, 255, ${0.3 * connectionPulse})`;
            ctx.arc(particleX, particleY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });

      // Draw grid dots with more visible pulsing
      gridDots.forEach((dot) => {
        // More noticeable pulse effect
        const pulse =
          Math.sin(time * dot.pulseSpeed + dot.pulseOffset) * 0.4 + 0.6;

        // Calculate a breathing size effect
        const sizeMultiplier = dot.isNode
          ? 1 + Math.sin(time * 0.3 + dot.animPhase) * 0.2
          : 1;

        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = dot.alpha * pulse;
        ctx.arc(dot.x, dot.y, dot.size * sizeMultiplier, 0, Math.PI * 2);
        ctx.fill();

        // Add a subtle glow to nodes
        if (dot.isNode) {
          const glowRadius =
            dot.size * 3 * (0.7 + Math.sin(time * 0.4 + dot.animPhase) * 0.3);
          const gradient = ctx.createRadialGradient(
            dot.x,
            dot.y,
            0,
            dot.x,
            dot.y,
            glowRadius
          );
          gradient.addColorStop(0, `rgba(200, 230, 255, ${0.15 * pulse})`);
          gradient.addColorStop(1, "rgba(200, 230, 255, 0)");

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Continue animation
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleLogin = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      router.push("/");
    } catch (error) {
      console.log("❌ Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <canvas ref={canvasRef} className="animated-grid-background" />
      <div className="login-content">
        <h2>Sign in to your account</h2>
        <input
          type="email"
          placeholder="Email"
          className="input-type"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-type"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Login</button>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
}
