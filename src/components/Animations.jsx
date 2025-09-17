import { useState, useEffect } from "react";

// This component wraps around other components to add fade-in animation
export function FadeIn({ children, delay = 0, duration = 300 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
}

// This component wraps around other components to add slide-in animation
export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 300,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Define transformations based on direction
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(20px)";
        case "down":
          return "translateY(-20px)";
        case "left":
          return "translateX(20px)";
        case "right":
          return "translateX(-20px)";
        default:
          return "translateY(20px)";
      }
    }
    return "translate(0, 0)";
  };

  return (
    <div
      className="transition-all"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
      }}
    >
      {children}
    </div>
  );
}

// This component adds a simple pulse animation, useful for notifications or highlights
export function Pulse({ children, color = "blue", duration = 1.5 }) {
  return (
    <div
      className={`animate-pulse-${color}`}
      style={{ "--pulse-duration": `${duration}s` }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse-blue {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }
        @keyframes pulse-red {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
        @keyframes pulse-green {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
          }
        }
        .animate-pulse-blue {
          animation: pulse-blue var(--pulse-duration)
            cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-red {
          animation: pulse-red var(--pulse-duration)
            cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-green {
          animation: pulse-green var(--pulse-duration)
            cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default { FadeIn, SlideIn, Pulse };
