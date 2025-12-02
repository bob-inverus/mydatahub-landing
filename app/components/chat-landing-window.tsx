"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { APP_AUTH_URL } from "@/lib/config";

import { Loader } from "@/components/prompt-kit/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Copy,
  ThumbsUp,
  Trash,
  Pencil,
  ChevronDown,
  Share,
  RotateCcw,
} from "lucide-react";

// Circular Progress Chart Component with Animation
interface CircularChartProps {
  score: number;
  title: string;
  size?: number;
}

function CircularChart({ score, title, size = 120 }: CircularChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(0);

  const radius = (size * 45) / 120; // Scale radius based on size (45 was for size=120)
  const strokeWidth = (size * 6) / 120; // Scale stroke width proportionally
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;

  const getStrokeColor = (title: string) => {
    if (title === "Online Trust Score") return "#3b82f6"; // Brand blue for Online Trust Score
    if (title === "Trust Score") return "#3b82f6"; // Brand blue for Trust Score
    if (title === "Confidence Score") return "#6b7280"; // Muted gray for Confidence Score
    return "#6b7280"; // Default muted gray
  };

  useEffect(() => {
    // Start animation after a brief delay
    const startDelay = setTimeout(() => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const stepDuration = duration / steps;
      const scoreIncrement = score / steps;
      const offsetStart = circumference;
      const offsetEnd = circumference - (score / 100) * circumference;
      const offsetDecrement = (offsetStart - offsetEnd) / steps;

      let currentStep = 0;

      const animate = () => {
        if (currentStep <= steps) {
          const progress = currentStep / steps;
          // Easing function for smooth animation
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);

          const newScore = Math.round(score * easeOutCubic);
          const newOffset =
            offsetStart - offsetDecrement * steps * easeOutCubic;

          setAnimatedScore(newScore);
          setAnimatedOffset(newOffset);

          currentStep++;
          setTimeout(animate, stepDuration);
        }
      };

      animate();
    }, 300); // 300ms delay before starting

    return () => clearTimeout(startDelay);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={size} width={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated Progress circle */}
          <circle
            stroke={getStrokeColor(title)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset: animatedOffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
            className="transition-none" // Remove CSS transition since we're manually animating
          />
        </svg>
        {/* Animated Score text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            {animatedScore}
          </span>
          <span className="text-xl font-medium text-gray-500 ml-0.5">%</span>
        </div>
      </div>
      {/* Title */}
      <div className="mt-3 text-center">
        <div
          className={`font-semibold text-gray-900 dark:text-gray-100 ${
            title === "Online Trust Score" ? "text-2xl" : "text-base"
          }`}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "loading";
  content: string;
  isTyping?: boolean;
  digitalIdentityScore?: number;
  showCTA?: boolean;
  query?: string;
}

export function ChatLandingWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ctaShown, setCtaShown] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const [feedback, setFeedback] = useState<"good" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Section 2 Particle animation state
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const particleDataRef = useRef<Array<{ x: number; y: number; baseX: number; baseY: number; size: number; isBlue: boolean; distanceFromCenter: number }>>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const isAutoModeRef = useRef(true);
  const lastMouseMoveRef = useRef(Date.now());
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();
  
  // Hero (Section 1) Grid Particle animation state - matching animation.tsx exactly
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroParticlesRef = useRef<HTMLDivElement[]>([]);
  const [heroCursor, setHeroCursor] = useState({ x: 0, y: 0 });
  const [heroStaticCursor, setHeroStaticCursor] = useState({ x: 0, y: 0 });
  const [isHeroAutoMode, setIsHeroAutoMode] = useState(true);
  const [isHeroStaticAnimation, setIsHeroStaticAnimation] = useState(false);
  const heroStartTimeRef = useRef(Date.now());
  const heroLastMouseMoveRef = useRef(Date.now());
  const heroAnimationFrameRef = useRef<number>();
  const heroTimeoutRef = useRef<NodeJS.Timeout>();
  const heroRows = 15; // Grid size (15x15 = 225 particles)
  const heroTotalParticles = heroRows * heroRows;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hero Grid Particle Animation - Initialize particles (matching animation.tsx)
  useEffect(() => {
    if (!heroContainerRef.current) return;
    
    const container = heroContainerRef.current;
    container.innerHTML = '';
    heroParticlesRef.current = [];

    for (let i = 0; i < heroTotalParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle absolute rounded-full will-change-transform';
      
      // Calculate grid position
      const row = Math.floor(i / heroRows);
      const col = i % heroRows;
      const centerRow = Math.floor(heroRows / 2);
      const centerCol = Math.floor(heroRows / 2);
      
      // Distance from center for stagger effects
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );
      
      // Staggered scale (larger in center)
      const scale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);
      
      // Staggered opacity (more opaque in center)
      const opacity = Math.max(0.05, 1 - distanceFromCenter * 0.1);
      
      // Glow intensity
      const glowSize = Math.max(1, 8 - distanceFromCenter * 0.6);
      
      particle.style.cssText = `
        width: 0.5rem;
        height: 0.5rem;
        left: ${col * 1.8}rem;
        top: ${row * 1.8}rem;
        transform: scale(${scale});
        opacity: ${opacity};
        background: rgb(59, 130, 246);
        box-shadow: 0 0 ${glowSize}px rgba(59, 130, 246, 0.6);
        z-index: ${Math.round(heroTotalParticles - distanceFromCenter * 5)};
        transition: transform 0.05s linear;
      `;
      
      container.appendChild(particle);
      heroParticlesRef.current.push(particle);
    }
  }, [heroRows, heroTotalParticles]);

  // Hero Continuous Animation (matching animation.tsx)
  useEffect(() => {
    const animate = () => {
      const currentTime = (Date.now() - heroStartTimeRef.current) * 0.001;
      
      if (isHeroAutoMode) {
        const x = Math.sin(currentTime * 0.3) * 200 + Math.sin(currentTime * 0.17) * 100;
        const y = Math.cos(currentTime * 0.2) * 150 + Math.cos(currentTime * 0.23) * 80;
        setHeroCursor({ x, y });
      } else if (isHeroStaticAnimation) {
        const timeSinceLastMove = Date.now() - heroLastMouseMoveRef.current;
        
        if (timeSinceLastMove > 200) {
          const animationStrength = Math.min((timeSinceLastMove - 200) / 1000, 1);
          const subtleX = Math.sin(currentTime * 1.5) * 20 * animationStrength;
          const subtleY = Math.cos(currentTime * 1.2) * 16 * animationStrength;
          
          setHeroCursor({
            x: heroStaticCursor.x + subtleX,
            y: heroStaticCursor.y + subtleY
          });
        }
      }
      
      heroAnimationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (heroAnimationFrameRef.current) {
        cancelAnimationFrame(heroAnimationFrameRef.current);
      }
    };
  }, [isHeroAutoMode, isHeroStaticAnimation, heroStaticCursor]);

  // Update Hero Particle Positions (matching animation.tsx)
  useEffect(() => {
    heroParticlesRef.current.forEach((particle, i) => {
      const row = Math.floor(i / heroRows);
      const col = i % heroRows;
      const centerRow = Math.floor(heroRows / 2);
      const centerCol = Math.floor(heroRows / 2);
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
      );
      
      const delay = distanceFromCenter * 8;
      const originalScale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);
      const dampening = Math.max(0.3, 1 - distanceFromCenter * 0.08);
      
      setTimeout(() => {
        const moveX = heroCursor.x * dampening;
        const moveY = heroCursor.y * dampening;
        
        particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${originalScale})`;
        particle.style.transition = `transform ${120 + distanceFromCenter * 20}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      }, delay);
    });
  }, [heroCursor, heroRows]);

  // Hero Mouse/Touch Movement Handler
  const handleHeroPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const event = 'touches' in e ? e.touches[0] : e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newCursor = {
      x: (event.clientX - centerX) * 0.8,
      y: (event.clientY - centerY) * 0.8
    };
    
    setHeroCursor(newCursor);
    setHeroStaticCursor(newCursor);
    setIsHeroAutoMode(false);
    setIsHeroStaticAnimation(false);
    heroLastMouseMoveRef.current = Date.now();
    
    if (heroTimeoutRef.current) {
      clearTimeout(heroTimeoutRef.current);
    }
    
    heroTimeoutRef.current = setTimeout(() => {
      setIsHeroStaticAnimation(true);
    }, 500);
    
    setTimeout(() => {
      if (Date.now() - heroLastMouseMoveRef.current >= 4000) {
        setIsHeroAutoMode(true);
        setIsHeroStaticAnimation(false);
        heroStartTimeRef.current = Date.now();
      }
    }, 4000);
  };

  // Interactive particle field animation (matching animation.tsx style)
  useEffect(() => {
    const particleField = document.getElementById('particleField');
    if (!particleField) return;

    const count = 400; // Optimal count for smooth animation
    particleField.innerHTML = '';
    particlesRef.current = [];
    particleDataRef.current = [];
    
    // Get container dimensions
    const containerWidth = particleField.offsetWidth || window.innerWidth;
    const containerHeight = particleField.offsetHeight || window.innerHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 6 + 3; // 3-9px
      const isBlue = Math.random() > 0.5;
      const baseX = Math.random() * 100;
      const baseY = Math.random() * 100;
      
      // Calculate distance from center for stagger effects
      const posX = (baseX / 100) * containerWidth;
      const posY = (baseY / 100) * containerHeight;
      const distanceFromCenter = Math.sqrt(
        Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2)
      ) / maxDistance;
      
      // Staggered opacity (more opaque near center)
      const opacity = Math.max(0.05, 0.25 - distanceFromCenter * 0.15);
      
      // Glow intensity based on distance
      const glowSize = isBlue ? Math.max(2, 8 - distanceFromCenter * 4) : 0;
      
      particle.className = 'particle-interactive';
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isBlue ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)'};
        left: ${baseX}%;
        top: ${baseY}%;
        opacity: ${opacity};
        box-shadow: ${isBlue ? `0 0 ${glowSize}px rgba(59, 130, 246, 0.3)` : 'none'};
        will-change: transform;
        transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        pointer-events: none;
      `;
      
      particleField.appendChild(particle);
      particlesRef.current.push(particle);
      particleDataRef.current.push({
        x: posX,
        y: posY,
        baseX,
        baseY,
        size,
        isBlue,
        distanceFromCenter
      });
    }

    // Animation loop
    const animate = () => {
      const currentTime = (Date.now() - startTimeRef.current) * 0.001;
      const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;
      
      // Auto-animation mode - organic flowing movement
      if (isAutoModeRef.current || timeSinceLastMove > 2000) {
        // Multiple sine waves for organic movement
        const autoX = Math.sin(currentTime * 0.3) * 80 + Math.sin(currentTime * 0.17) * 40 + Math.cos(currentTime * 0.11) * 30;
        const autoY = Math.cos(currentTime * 0.2) * 60 + Math.cos(currentTime * 0.23) * 35 + Math.sin(currentTime * 0.13) * 25;
        cursorRef.current = { x: autoX, y: autoY };
        
        // Gradually return to auto mode
        if (timeSinceLastMove > 2000 && !isAutoModeRef.current) {
          isAutoModeRef.current = true;
        }
      }
      
      // Update particle positions with stagger and dampening
      particlesRef.current.forEach((particle, i) => {
        const data = particleDataRef.current[i];
        if (!data) return;
        
        // Dampening based on distance from center (closer = more movement)
        const dampening = Math.max(0.2, 1 - data.distanceFromCenter * 0.7);
        
        // Staggered delay based on distance
        const delayFactor = 1 - data.distanceFromCenter * 0.5;
        
        const moveX = cursorRef.current.x * dampening * delayFactor;
        const moveY = cursorRef.current.y * dampening * delayFactor;
        
        // Add subtle individual oscillation
        const individualOsc = Math.sin(currentTime * 2 + i * 0.1) * 3 * (1 - data.distanceFromCenter);
        
        particle.style.transform = `translate(${moveX + individualOsc}px, ${moveY + individualOsc * 0.7}px)`;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Mouse/touch movement handler for the section
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const section = document.getElementById('trust-protocol-section');
      if (!section) return;
      
      const rect = section.getBoundingClientRect();
      const event = 'touches' in e ? e.touches[0] : e;
      
      // Only respond when pointer is over the section
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      cursorRef.current = {
        x: (event.clientX - centerX) * 0.15,
        y: (event.clientY - centerY) * 0.15
      };
      
      isAutoModeRef.current = false;
      lastMouseMoveRef.current = Date.now();
    };
    
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove as EventListener);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove as EventListener);
    };
  }, []);

  // Handle section detection using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: [0.1, 0.5, 0.9],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const target = entry.target as HTMLElement;
          const sectionId = target.id;

          // Clear any existing timeout
          if (sectionChangeTimeoutRef.current) {
            clearTimeout(sectionChangeTimeoutRef.current);
          }

          // Debounce section changes to prevent flickering
          sectionChangeTimeoutRef.current = setTimeout(() => {
            switch (sectionId) {
              case "chat-demo-section":
                setCurrentSection(1);
                setShowScrollArrow(true);
                break;
              case "trust-protocol-section":
                setCurrentSection(2);
                setShowScrollArrow(true);
                break;
              case "architecture-section":
                setCurrentSection(3);
                setShowScrollArrow(true);
                break;
              case "horizon-section":
                setCurrentSection(4);
                setShowScrollArrow(true);
                break;
              case "cta-section":
                setCurrentSection(5);
                setShowScrollArrow(false);
                break;
            }
          }, 150); // Slightly longer debounce
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    const sections = [
      "chat-demo-section",
      "trust-protocol-section",
      "architecture-section",
      "horizon-section",
      "cta-section",
    ];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Enhanced backup scroll detection method for reliability
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Find the section that's most visible in the viewport
        const sections = document.querySelectorAll('[id$="-section"]');
        let mostVisibleSection = null;
        let maxVisibleArea = 0;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Calculate visible area of the section
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibleArea = visibleHeight * rect.width;

          if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            mostVisibleSection = section;
          }
        });

        if (mostVisibleSection) {
          const sectionId = (mostVisibleSection as HTMLElement).id;

          let newSection = currentSection;
          let newShowArrow = showScrollArrow;

          switch (sectionId) {
            case "chat-demo-section":
              newSection = 1;
              newShowArrow = true;
              break;
            case "trust-protocol-section":
              newSection = 2;
              newShowArrow = isMobile ? false : true;
              break;
            case "architecture-section":
              newSection = 3;
              newShowArrow = isMobile ? false : true;
              break;
            case "horizon-section":
              newSection = 4;
              newShowArrow = isMobile ? false : true;
              break;
            case "cta-section":
              newSection = 5;
              newShowArrow = false;
              break;
          }

          // Always update both section and arrow state
          if (
            newSection !== currentSection ||
            newShowArrow !== showScrollArrow
          ) {
            setCurrentSection(newSection);
            setShowScrollArrow(newShowArrow);
          }
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection, showScrollArrow, isMobile]);

  // Get the target section ID based on current section
  const getNextSectionId = () => {
    switch (currentSection) {
      case 1:
        return "trust-protocol-section";
      case 2:
        return "architecture-section";
      case 3:
        return "horizon-section";
      case 4:
        return "cta-section";
      default:
        return "trust-protocol-section";
    }
  };

  // Helper: Scroll to section with desktop centering and mobile/top alignment
  const scrollToSectionById = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error(`Target element not found: ${targetId}`);
      return;
    }

    // Use the simplest, most reliable method: scrollIntoView
    try {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Scroll error:", error);
    }
  };

  // Handle arrow click with improved reliability
  const handleArrowClick = () => {
    const targetId = getNextSectionId();

    // Ensure target element exists before scrolling
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error(`Target element not found: ${targetId}`);
      return;
    }

    scrollToSectionById(targetId);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title: "MyDataHub Demo",
          text: "Check out this result from MyDataHub",
          url: window.location.href,
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
        console.log("Link copied to clipboard");
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleRetry = () => {
    // Clear all messages to show input box again
    setMessages([]);
    setCtaShown(false);
    setFeedback(null);
  };

  const handleGoodResponse = () => {
    setFeedback(feedback === "good" ? null : "good");
    // Here you could send feedback to analytics or backend
    console.log("Good response feedback submitted");
  };

  return (
    <div className="w-full">
      {/* Section 1: Hero with Grid Particle Animation */}
      <section
        id="chat-demo-section"
        className="relative flex flex-col items-center justify-center h-[100svh] md:min-h-screen w-full overflow-hidden"
        onMouseMove={handleHeroPointerMove}
        onTouchMove={handleHeroPointerMove}
      >
        {/* Grid Particle Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            ref={heroContainerRef}
            className="relative"
            style={{
              width: `${heroRows * 1.8}rem`,
              height: `${heroRows * 1.8}rem`
            }}
          />
        </div>
        
        {/* Ambient Effects - Works in both light and dark mode */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 dark:bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] bg-gradient-radial from-blue-500/5 dark:from-blue-900/3 to-transparent rounded-full"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[900px] min-h-[400px] md:min-h-[480px] max-h-[85vh] md:max-h-[80vh] backdrop-filter backdrop-blur-xl rounded-md px-4 py-0 md:py-8">
          {/* Main Chat Content */}
          <div className="flex h-full flex-col">
            {messages.length === 0 ? (
              /* Empty state - centered layout */
              <div className="flex flex-1 items-center justify-center flex-col">
                <div className="text-center">
                  {/* Logo Mark - MyDataHub Logo (Placeholder) */}
                  <div className="flex justify-center mb-6">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="50" height="50" rx="15" fill="#006DED" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.7366 6.15368C23.9778 6.05228 24.2376 6 24.5 6C24.7624 6 25.0222 6.05228 25.2634 6.15368L37.6518 11.3612C38.3489 11.6542 38.9431 12.1415 39.3605 12.7626C39.7779 13.3836 40.0003 14.1112 40 14.855V27.888C39.9998 30.2322 39.3676 32.5348 38.1675 34.5623C36.9675 36.5898 35.2422 38.2703 33.1664 39.4334L25.461 43.7498C25.1683 43.9138 24.8371 44 24.5 44C24.1629 44 23.8317 43.9138 23.539 43.7498L15.8336 39.4334C13.7573 38.27 12.0316 36.5889 10.8315 34.5607C9.6314 32.5324 8.99955 30.2291 9 27.8842V14.855C9.00008 14.1115 9.22261 13.3844 9.64002 12.7637C10.0574 12.143 10.6514 11.656 11.3482 11.3631L23.7366 6.15368ZM31.6823 22.5437C32.0352 22.1854 32.2305 21.7055 32.2261 21.2073C32.2217 20.7092 32.0179 20.2327 31.6587 19.8804C31.2995 19.5282 30.8135 19.3284 30.3055 19.3241C29.7975 19.3197 29.3081 19.5112 28.9427 19.8573L22.5625 26.1135L20.0573 23.657C19.6919 23.3109 19.2025 23.1194 18.6945 23.1238C18.1865 23.1281 17.7005 23.3279 17.3413 23.6802C16.9821 24.0324 16.7783 24.5089 16.7739 25.007C16.7695 25.5052 16.9648 25.9851 17.3177 26.3434L21.1927 30.1431C21.556 30.4993 22.0487 30.6994 22.5625 30.6994C23.0763 30.6994 23.569 30.4993 23.9323 30.1431L31.6823 22.5437Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  
                  {/* Logo Mark - MyDataHub */}
                  <div className="flex justify-center mb-6">
                    <div className="text-base font-normal tracking-widest uppercase text-gray-400 dark:text-gray-500">
                      MyDataHub
                    </div>
                  </div>
                  
                  {/* Header */}
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight leading-tight max-w-4xl text-gray-900 dark:text-gray-100 text-balance mb-6">
                    Your Data.<br />Your Sanctuary.
                  </h1>

                  {/* Subtitle */}
                  <div className="mb-4 md:mb-8">
                    <p className="text-gray-500 dark:text-gray-400 max-w-3xl text-xl md:text-2xl font-light">
                      It's time for clarity. It's time for control.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat with messages - input at bottom */
              <>
                {/* Chat messages */}
                <div className="relative flex-1 space-y-0 px-4 overflow-y-auto scrollbar-hide">
                  <div className="space-y-6 px-2 py-6">
                    {messages.map((message, index) => {
                      const isAssistant =
                        message.role === "assistant" ||
                        message.role === "loading";
                      const isLastMessage = index === messages.length - 1;

                      return (
                        <Message
                          key={message.id}
                          className={cn(
                            "mx-auto flex w-full max-w-full flex-col gap-2 px-0",
                            isAssistant ? "items-start" : "items-end"
                          )}
                        >
                          {isAssistant ? (
                            <div className="group flex w-full flex-col gap-0">
                              {message.role === "loading" ? (
                                /* Loading message - exact same as main chat */
                                <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2">
                                  <Loader />
                                </div>
                              ) : (
                                /* Assistant result message */
                                <div className="w-full">
                                  <div className="flex gap-3 items-start">
                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="text-center mb-4">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                          <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 50 50"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0"
                                          >
                                            <rect
                                              width="50"
                                              height="50"
                                              rx="15"
                                              fill="#006DED"
                                            />
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M23.7366 6.15368C23.9778 6.05228 24.2376 6 24.5 6C24.7624 6 25.0222 6.05228 25.2634 6.15368L37.6518 11.3612C38.3489 11.6542 38.9431 12.1415 39.3605 12.7626C39.7779 13.3836 40.0003 14.1112 40 14.855V27.888C39.9998 30.2322 39.3676 32.5348 38.1675 34.5623C36.9675 36.5898 35.2422 38.2703 33.1664 39.4334L25.461 43.7498C25.1683 43.9138 24.8371 44 24.5 44C24.1629 44 23.8317 43.9138 23.539 43.7498L15.8336 39.4334C13.7573 38.27 12.0316 36.5889 10.8315 34.5607C9.6314 32.5324 8.99955 30.2291 9 27.8842V14.855C9.00008 14.1115 9.22261 13.3844 9.64002 12.7637C10.0574 12.143 10.6514 11.656 11.3482 11.3631L23.7366 6.15368ZM31.6823 22.5437C32.0352 22.1854 32.2305 21.7055 32.2261 21.2073C32.2217 20.7092 32.0179 20.2327 31.6587 19.8804C31.2995 19.5282 30.8135 19.3284 30.3055 19.3241C29.7975 19.3197 29.3081 19.5112 28.9427 19.8573L22.5625 26.1135L20.0573 23.657C19.6919 23.3109 19.2025 23.1194 18.6945 23.1238C18.1865 23.1281 17.7005 23.3279 17.3413 23.6802C16.9821 24.0324 16.7783 24.5089 16.7739 25.007C16.7695 25.5052 16.9648 25.9851 17.3177 26.3434L21.1927 30.1431C21.556 30.4993 22.0487 30.6994 22.5625 30.6994C23.0763 30.6994 23.569 30.4993 23.9323 30.1431L31.6823 22.5437Z"
                                              fill="white"
                                            />
                                          </svg>
                                          <span className="text-2xl font-medium text-gray-900 dark:text-gray-400">
                                            {message.query}
                                          </span>
                                        </div>
                                      </div>

                                      <MessageContent
                                        className="text-foreground prose w-full flex-1 bg-transparent p-0"
                                        markdown
                                      >
                                        {message.content}
                                      </MessageContent>

                                      {/* Online Trust Score Chart */}
                                      {message.digitalIdentityScore && (
                                        <div className="mt-6">
                                          <div className="flex justify-center">
                                            <CircularChart
                                              score={
                                                message.digitalIdentityScore
                                              }
                                              title="Online Trust Score"
                                              size={280}
                                            />
                                          </div>
                                          <div className="text-xs text-gray-500 mt-4 text-center">
                                            (This is a sample signal.)
                                          </div>
                                        </div>
                                      )}

                                      {/* Middle Copy */}
                                      {message.showCTA && (
                                        <div className="mt-6 text-center">
                                          <div className="text-base max-w-2xl mx-auto leading-relaxed">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                              Your digital presence already speaks before you do.
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-500 mt-1">
                                              See Who's Real. Including You.
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Results CTA Block - Only shown for first result */}
                                      {message.showCTA && (
                                        <div className="mt-6 pt-4">
                                          <div className="text-center">
                                            <Link href="https://inverus.ai/auth">
                                              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-600 dark:hover:bg-gray-200 px-8 py-3 rounded-full transition duration-200">
                                                Launch the Trust Layer
                                              </Button>
                                            </Link>
                                            <p className="text-sm text-gray-500 dark:text-gray-600 mt-4 mb-6">
                                              No noise. Just signal.
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Message Actions */}
                                  <MessageActions
                                    className={cn(
                                      "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 mt-2",
                                      isLastMessage && "opacity-100"
                                    )}
                                  >
                                    <MessageAction
                                      tooltip="Good response"
                                      delayDuration={100}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                          "rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800",
                                          feedback === "good" &&
                                            "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        )}
                                        onClick={handleGoodResponse}
                                        aria-pressed={feedback === "good"}
                                      >
                                        <ThumbsUp size={16} />
                                      </Button>
                                    </MessageAction>

                                    <MessageAction
                                      tooltip="Share"
                                      delayDuration={100}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={handleShare}
                                      >
                                        <Share size={16} />
                                      </Button>
                                    </MessageAction>
                                    <MessageAction
                                      tooltip="Retry"
                                      delayDuration={100}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={handleRetry}
                                      >
                                        <RotateCcw size={16} />
                                      </Button>
                                    </MessageAction>
                                  </MessageActions>
                                </div>
                              )}
                            </div>
                          ) : (
                            /* User message */
                            <div className="group flex flex-col items-end gap-1">
                              <MessageContent className="bg-muted text-primary rounded-3xl px-5 py-2.5">
                                {message.content}
                              </MessageContent>
                              <MessageActions
                                className={cn(
                                  "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                )}
                              >
                                <MessageAction
                                  tooltip="Edit"
                                  delayDuration={100}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                  >
                                    <Pencil />
                                  </Button>
                                </MessageAction>
                                <MessageAction
                                  tooltip="Delete"
                                  delayDuration={100}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                  >
                                    <Trash />
                                  </Button>
                                </MessageAction>
                                <MessageAction
                                  tooltip="Copy"
                                  delayDuration={100}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                  >
                                    <Copy />
                                  </Button>
                                </MessageAction>
                              </MessageActions>
                            </div>
                          )}
                        </Message>
                      );
                    })}
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Awakening (The Problem) */}
      <section
        id="trust-protocol-section"
        className="relative flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-12 md:py-16 overflow-hidden"
      >
        {/* Particle Background - Interactive Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            id="particleField" 
            className="w-full h-full"
          />
                </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-24 md:space-y-32">
          {/* First paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-4xl leading-normal font-light text-gray-900 dark:text-gray-100"
          >
            Your digital life: scattered, exposed, a story written by others. What they call "connection" often feels like exploitation.{" "}
            <br />
            <span className="text-gray-500 dark:text-gray-400">
              It wasn't meant to be this way.
            </span>
          </motion.p>

          {/* Second paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl md:text-3xl italic text-gray-500 dark:text-gray-400 font-light"
          >
            (Are you tired of being the unseen product in their profit equation?)
          </motion.p>

          {/* Third paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-4xl font-medium leading-relaxed text-gray-900 dark:text-gray-100"
          >
            We believe in a different future.
            <br />
            A place of{" "}
            <span className="font-bold">focus</span>,{" "}
            <span className="font-bold">trust</span>, and{" "}
            <span className="font-bold">true ownership</span> — a place that is{" "}
            <span className="text-blue-500 dark:text-blue-400 font-bold">yours</span>.
          </motion.p>
        </div>
      </section>

      {/* Section 3: Sanctuary (The Solution) */}
      <section
        id="architecture-section"
        className="relative flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-12 md:py-16 overflow-hidden"
      >
        {/* AI Animation Styles */}
        <style>{`
          @property --a {
            syntax: "<angle>";
            inherits: true;
            initial-value: 0deg;
          }
          @property --l {
            syntax: "<number>";
            inherits: true;
            initial-value: 0;
          }
          @property --x {
            syntax: "<length>";
            inherits: false;
            initial-value: 0;
          }
          @property --o {
            syntax: "<number>";
            inherits: false;
            initial-value: 0;
          }
          @property --value {
            syntax: "<angle>";
            inherits: true;
            initial-value: 0deg;
          }
          @property --width-ratio {
            syntax: "<number>";
            inherits: true;
            initial-value: 0;
          }
          @property --scale {
            syntax: "<number>";
            inherits: true;
            initial-value: 0;
          }
          
          .ai-visualizer {
            --s: 200px;
            --p: calc(var(--s) / 4);
            --count: 4;
            --radius: 30px;
            width: var(--s);
            aspect-ratio: 1;
            --bg-color: color-mix(in srgb, #3b82f6, transparent 90%);
            background: radial-gradient(60% 75% at center, var(--bg-color) 50%, transparent 50%), 
                        radial-gradient(75% 60% at center, var(--bg-color) 50%, transparent 50%);
            padding: var(--p);
            display: grid;
            place-items: center;
            position: relative;
            border-radius: 50%;
            transform: scale(1);
          }
          
          @keyframes ai-orbit {
            from {
              --a: 360deg;
              --l: 0.35;
              --o: 1;
            }
            30% {
              --l: 1.5;
            }
            70% {
              --o: 0.4;
              --l: 0.05;
            }
            98% {
              --o: 0.7;
            }
            to {
              --a: 0deg;
              --l: 0.35;
              --o: 1;
            }
          }
          
          .ai-circle {
            opacity: 0.9;
            position: absolute;
            width: 40px;
            aspect-ratio: 1;
            border-radius: 50%;
            --offset-per-item: calc(360deg / var(--count));
            --current-angle-offset: calc(var(--offset-per-item) * var(--i) + var(--a));
            translate: calc(cos(var(--current-angle-offset)) * var(--radius) + var(--x, 0)) 
                       calc(sin(var(--current-angle-offset)) * var(--radius) * -1);
            scale: calc(0.6 + var(--l));
            animation: ai-orbit 5.5s cubic-bezier(0.45, -0.35, 0.16, 1.5) infinite;
            transition: opacity 0.3s linear;
            opacity: var(--o, 1);
          }
          
          .ai-c1 {
            --i: 0;
            background: radial-gradient(50% 50% at center, #60a5fa, #93c5fd);
            --x: 4px;
            width: 64px;
            animation-timing-function: cubic-bezier(0.12, 0.32, 0.68, 0.24);
          }
          
          .ai-c2 {
            --i: 1;
            background: radial-gradient(50% 50% at center, #3b82f6, #bfdbfe);
            width: 60px;
          }
          
          .ai-c3 {
            --i: 2;
            background: radial-gradient(50% 50% at center, #2563eb, transparent);
            width: 20px;
            opacity: 0.6;
            --x: -4px;
          }
          
          .ai-c4 {
            --i: 3;
            background: #1d4ed8;
            animation-timing-function: cubic-bezier(0.39, -0.03, 0.75, 0.47);
          }
          
          .ai-container {
            overflow: hidden;
            background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%);
            width: 100%;
            border-radius: 50%;
            aspect-ratio: 1;
            position: relative;
            display: grid;
            place-items: center;
          }
          
          .ai-glass {
            overflow: hidden;
            position: absolute;
            --w: 2px;
            inset: calc(var(--p) - var(--w));
            border-radius: 50%;
            backdrop-filter: blur(5px);
            box-shadow: 0 0 32px color-mix(in srgb, #3b82f6, transparent 60%);
            background: radial-gradient(40px at 70% 30%, rgba(255, 255, 255, 0.5), transparent);
          }
          
          .ai-glass:after {
            content: "";
            position: absolute;
            inset: 0;
            --c: rgba(255, 255, 255, 0.03);
            --w: 1px;
            --g: 3px;
            background: repeating-linear-gradient(var(--c), var(--c), var(--w), transparent var(--w), transparent calc(var(--w) + var(--g)));
            border-radius: inherit;
            border: 4px rgba(255, 255, 255, 0.15) solid;
          }
          
          .ai-rings {
            aspect-ratio: 1;
            border-radius: 50%;
            position: absolute;
            inset: 0;
            perspective: 176px;
            opacity: 0.7;
            --width: 4px;
            --duration: 8s;
          }
          
          .ai-rings:before, .ai-rings:after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 50%;
            --width-ratio: 1;
            border: calc(var(--width) * var(--width-ratio)) solid transparent;
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            background: linear-gradient(135deg, #ffffff, #60a5fa, #3b82f6, #1d4ed8, #bfdbfe) border-box;
            mask-composite: exclude;
            animation: ai-ring var(--duration) ease-in-out infinite;
            --start: 180deg;
            --value: var(--start);
            --scale: 1;
            transform: rotateY(var(--value)) rotateX(var(--value)) rotateZ(var(--value)) scale(var(--scale));
          }
          
          .ai-rings:before {
            --start: 180deg;
          }
          
          .ai-rings:after {
            --start: 90deg;
          }
          
          @keyframes ai-ring {
            from {
              --value: var(--start);
              --scale: 1;
            }
            50% {
              --scale: 1.2;
              --width-ratio: 1.5;
            }
            70% {
              --scale: 1;
              --value: calc(var(--start) + 180deg);
              --width-ratio: 1;
            }
            80% {
              --scale: 1.2;
              --width-ratio: 1.5;
            }
            to {
              --value: calc(var(--start) + 360deg);
              --scale: 1;
              --width-ratio: 1;
            }
          }
        `}</style>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-12 text-center text-gray-900 dark:text-gray-100"
          >
            This is Your Sanctuary.
          </motion.h2>

          {/* AI Animation Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex justify-center mb-16"
          >
            <div className="ai-visualizer">
              <div className="ai-container">
                <div className="ai-circle ai-c4"></div>
                <div className="ai-circle ai-c1"></div>
                <div className="ai-circle ai-c2"></div>
                <div className="ai-circle ai-c3"></div>
                <div className="ai-rings"></div>
              </div>
              <div className="ai-glass"></div>
            </div>
          </motion.div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full px-4">
            {/* Absolute Control */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 group"
            >
              <div className="mb-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex justify-center">
                <svg 
                              xmlns="http://www.w3.org/2000/svg"
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                                  stroke="currentColor"
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                            </svg>
                          </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Absolute Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                You hold the only key. Grant access by purpose, and revoke it instantly.
              </p>
            </motion.div>

            {/* Profound Security */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 group"
            >
              <div className="mb-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex justify-center">
                <svg 
                              xmlns="http://www.w3.org/2000/svg"
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                          </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Profound Security</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Encryption, isolation, and zero-knowledge architecture. Peace of mind by design.
              </p>
            </motion.div>

            {/* Recognised Value */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 group"
            >
              <div className="mb-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex justify-center">
                <svg 
                              xmlns="http://www.w3.org/2000/svg"
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                              fill="none"
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                            >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                          </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Recognised Value</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Stop being the product. When you share, you define the terms and keep the value.
              </p>
            </motion.div>
              </div>
            </div>

      </section>

      {/* Section 4: Horizon (Future) */}
      <section
        id="horizon-section"
        className="flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-12 md:py-16"
      >
        <div className="w-full max-w-3xl mx-auto text-center space-y-12">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100"
          >
            This is Only the Beginning.
          </motion.h2>

          {/* Body Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed space-y-6"
          >
            <p>
              Your <strong className="text-gray-900 dark:text-gray-100">Sanctuary</strong> evolves with you — unlocking personal insights that truly serve you and pioneering a fairer, more thoughtful digital economy. Join today to secure your data and help build this future, together.
            </p>
            
            <p>
              As a <span className="text-blue-500 dark:text-blue-400 font-medium">Founding Pioneer</span>, you'll gain early influence, priority access, and <span className="text-blue-500 dark:text-blue-400 font-medium">Pioneer Points</span> — your share in the future we're building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section
        id="cta-section"
        className="flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-2 md:py-8 my-4 md:my-0"
      >
        {/* CTA Content */}
        <div className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center">
          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-900 py-16 grid grid-cols-12 rounded-lg">
              <div className="px-4 md:px-0 md:col-span-10 md:col-start-2 col-span-12 flex flex-col text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-tight max-w-4xl text-gray-900 dark:text-gray-100 text-balance mb-6 mx-auto">
                  Step Into Your Sanctuary.
                </h1>
                <div className="mb-4 md:mb-8">
                  <p className="text-gray-600 dark:text-gray-400 max-w-4xl text-lg mx-auto">
                    Your data deserves a home it can trust.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Link href="/auth">
                    <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 has-[>svg]:px-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-3 rounded-full transition duration-200">
                      Secure My Sanctuary
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="relative">
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col items-center gap-6 md:hidden">
                {/* Logo */}
                <div className="flex items-center justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center"
                  >
                    <motion.svg
                      className="w-8 h-8"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <rect width="50" height="50" rx="15" fill="#006DED" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.7366 6.15368C23.9778 6.05228 24.2376 6 24.5 6C24.7624 6 25.0222 6.05228 25.2634 6.15368L37.6518 11.3612C38.3489 11.6542 38.9431 12.1415 39.3605 12.7626C39.7779 13.3836 40.0003 14.1112 40 14.855V27.888C39.9998 30.2322 39.3676 32.5348 38.1675 34.5623C36.9675 36.5898 35.2422 38.2703 33.1664 39.4334L25.461 43.7498C25.1683 43.9138 24.8371 44 24.5 44C24.1629 44 23.8317 43.9138 23.539 43.7498L15.8336 39.4334C13.7573 38.27 12.0316 36.5889 10.8315 34.5607C9.6314 32.5324 8.99955 30.2291 9 27.8842V14.855C9.00008 14.1115 9.22261 13.3844 9.64002 12.7637C10.0574 12.143 10.6514 11.656 11.3482 11.3631L23.7366 6.15368ZM31.6823 22.5437C32.0352 22.1854 32.2305 21.7055 32.2261 21.2073C32.2217 20.7092 32.0179 20.2327 31.6587 19.8804C31.2995 19.5282 30.8135 19.3284 30.3055 19.3241C29.7975 19.3197 29.3081 19.5112 28.9427 19.8573L22.5625 26.1135L20.0573 23.657C19.6919 23.3109 19.2025 23.1194 18.6945 23.1238C18.1865 23.1281 17.7005 23.3279 17.3413 23.6802C16.9821 24.0324 16.7783 24.5089 16.7739 25.007C16.7695 25.5052 16.9648 25.9851 17.3177 26.3434L21.1927 30.1431C21.556 30.4993 22.0487 30.6994 22.5625 30.6994C23.0763 30.6994 23.569 30.4993 23.9323 30.1431L31.6823 22.5437Z"
                        fill="white"
                      />
                    </motion.svg>
                  </Link>
                </div>

                {/* Footer Text */}
                <div className="flex items-center justify-center text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Crafted with care by a team dedicated to restoring digital dignity.
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <a
                    href="mailto:andrew@inverus.tech"
                    className="text-blue-500 dark:text-blue-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                  >
                    Investors
                  </a>
                  <span>·</span>
                  <Link
                    href="/manifesto"
                    className="text-blue-500 dark:text-blue-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                  >
                    Our Belief
                  </Link>
                </div>
              </div>

              {/* Desktop Layout - Absolute Positioning for Perfect Centering */}
              <div className="hidden md:block">
                {/* Left Logo */}
                <div className="absolute left-0 top-0">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center"
                  >
                    <motion.svg
                      className="w-8 h-8"
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <rect width="50" height="50" rx="15" fill="#006DED" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23.7366 6.15368C23.9778 6.05228 24.2376 6 24.5 6C24.7624 6 25.0222 6.05228 25.2634 6.15368L37.6518 11.3612C38.3489 11.6542 38.9431 12.1415 39.3605 12.7626C39.7779 13.3836 40.0003 14.1112 40 14.855V27.888C39.9998 30.2322 39.3676 32.5348 38.1675 34.5623C36.9675 36.5898 35.2422 38.2703 33.1664 39.4334L25.461 43.7498C25.1683 43.9138 24.8371 44 24.5 44C24.1629 44 23.8317 43.9138 23.539 43.7498L15.8336 39.4334C13.7573 38.27 12.0316 36.5889 10.8315 34.5607C9.6314 32.5324 8.99955 30.2291 9 27.8842V14.855C9.00008 14.1115 9.22261 13.3844 9.64002 12.7637C10.0574 12.143 10.6514 11.656 11.3482 11.3631L23.7366 6.15368ZM31.6823 22.5437C32.0352 22.1854 32.2305 21.7055 32.2261 21.2073C32.2217 20.7092 32.0179 20.2327 31.6587 19.8804C31.2995 19.5282 30.8135 19.3284 30.3055 19.3241C29.7975 19.3197 29.3081 19.5112 28.9427 19.8573L22.5625 26.1135L20.0573 23.657C19.6919 23.3109 19.2025 23.1194 18.6945 23.1238C18.1865 23.1281 17.7005 23.3279 17.3413 23.6802C16.9821 24.0324 16.7783 24.5089 16.7739 25.007C16.7695 25.5052 16.9648 25.9851 17.3177 26.3434L21.1927 30.1431C21.556 30.4993 22.0487 30.6994 22.5625 30.6994C23.0763 30.6994 23.569 30.4993 23.9323 30.1431L31.6823 22.5437Z"
                        fill="white"
                      />
                    </motion.svg>
                  </Link>
                </div>

                {/* Center Footer Text - Perfectly Centered */}
                <div className="flex items-center justify-center text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Crafted with care by a team dedicated to restoring digital dignity.
                  </p>
                </div>

                {/* Right Links */}
                <div className="absolute right-0 top-0">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <a
                      href="mailto:andrew@inverus.tech"
                      className="text-blue-500 dark:text-blue-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                    >
                      Investors
                    </a>
                    <span>·</span>
                    <Link
                      href="/manifesto"
                      className="text-blue-500 dark:text-blue-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                    >
                      Our Belief
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>

      {/* Global Fixed Scroll Arrow - Works on all sections with improved mobile support */}
      <AnimatePresence>
        {showScrollArrow && (
          <div className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]">
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleArrowClick();
              }}
              onTouchStart={(e) => {
                // Prevent scrolling while touching the button
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleArrowClick();
              }}
              className="group flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors duration-300 cursor-pointer p-3 md:p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{ touchAction: "manipulation" }}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown
                  size={24}
                  className="text-blue-500 group-hover:text-blue-600 md:w-7 md:h-7"
                />
              </motion.div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
