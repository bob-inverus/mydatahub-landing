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

function CountingNumber({ target }: { target: number }) {
  const [count, setCount] = useState(target);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Live counting - increment randomly every 2-5 seconds
    const scheduleNextIncrement = () => {
      const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds
      timeoutRef.current = setTimeout(() => {
        setCount((prevCount) => {
          // Add 1-3 verifications randomly
          const increment = Math.floor(Math.random() * 3) + 1;
          return prevCount + increment;
        });
        scheduleNextIncrement(); // Schedule the next increment
      }, randomDelay);
    };

    scheduleNextIncrement();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <span className="font-mono">{count.toLocaleString()}</span>;
}

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Particle field with mouse parallax and orbital animation
  useEffect(() => {
    const particleField = document.getElementById('particleField');
    if (!particleField) return;

    const particles: HTMLDivElement[] = [];

    // Create particles
    const createParticles = () => {
      const count = 800; // More particles for denser field
      particleField.innerHTML = ''; // Clear existing particles

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 3; // 3-9px (bigger)
        const isBlue = Math.random() > 0.5; // 50% blue, 50% grey
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${isBlue ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)'};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.5 + 0.2};
          transform: scale(${Math.random()});
          transition: transform 0.5s ease-out, left 1.5s cubic-bezier(0.16, 1, 0.3, 1), top 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out;
          box-shadow: ${isBlue ? '0 0 12px rgba(59, 130, 246, 0.8)' : 'none'};
        `;
        
        particleField.appendChild(particle);
        particles.push(particle);
      }
    };

    createParticles();

    // Mouse parallax effect
    let mouseParallaxEnabled = true;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseParallaxEnabled) return;
      const x = (window.innerWidth - e.pageX * 2) / 50;
      const y = (window.innerHeight - e.pageY * 2) / 50;
      particleField.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Scroll-triggered orbital animation
    const handleScroll = () => {
      const architectureSection = document.getElementById('architecture-section');
      const orbitalSystem = document.getElementById('orbitalSystem');
      const orbitingParticlesGroup = document.getElementById('orbitingParticles');
      const hubCore = document.getElementById('hubCore');
      const shieldLayers = document.getElementById('shieldLayers');
      
      if (!architectureSection || !orbitalSystem || !orbitingParticlesGroup) return;

      const rect = architectureSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the section (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - rect.top) / (windowHeight + rect.height)
      ));

      // When section comes into view (scrollProgress > 0.3)
      if (scrollProgress > 0.3) {
        mouseParallaxEnabled = false;
        particleField.style.transform = 'translate(0, 0)';
        
        // Show orbital system
        orbitalSystem.style.opacity = '1';
        
        // Animate particles to orbit
        const particleSubset = particles.filter((_, i) => i % 4 === 0); // Take every 4th particle for performance
        particleSubset.forEach((particle, index) => {
          const angle = (index / particleSubset.length) * Math.PI * 2;
          const radius = 50; // percentage from center
          const centerX = 50; // center of viewport
          const centerY = 50;
          
          const targetX = centerX + Math.cos(angle) * radius;
          const targetY = centerY + Math.sin(angle) * radius;
          
          setTimeout(() => {
            particle.style.left = `${targetX}%`;
            particle.style.top = `${targetY}%`;
            particle.style.opacity = '0.8';
          }, index * 3); // Stagger the animation
        });

        // Create orbiting particles in SVG
        if (orbitingParticlesGroup && orbitingParticlesGroup.children.length === 0) {
          for (let i = 0; i < 60; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const angle = (i / 60) * Math.PI * 2;
            const radius = 150 + Math.random() * 50;
            const cx = 300 + Math.cos(angle) * radius;
            const cy = 300 + Math.sin(angle) * radius;
            const size = Math.random() * 3 + 2;
            const isBlue = Math.random() > 0.5;
            
            circle.setAttribute('cx', cx.toString());
            circle.setAttribute('cy', cy.toString());
            circle.setAttribute('r', size.toString());
            circle.setAttribute('fill', isBlue ? 'rgb(59, 130, 246)' : 'rgb(156, 163, 175)');
            circle.setAttribute('opacity', (Math.random() * 0.5 + 0.3).toString());
            
            // Add rotation animation
            const animateTransform = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateTransform.setAttribute('attributeName', 'transform');
            animateTransform.setAttribute('type', 'rotate');
            animateTransform.setAttribute('from', `0 300 300`);
            animateTransform.setAttribute('to', `360 300 300`);
            animateTransform.setAttribute('dur', `${20 + Math.random() * 20}s`);
            animateTransform.setAttribute('repeatCount', 'indefinite');
            
            circle.appendChild(animateTransform);
            orbitingParticlesGroup.appendChild(circle);
          }
        }

        // Animate core pulsing
        if (hubCore) {
          hubCore.style.animation = 'pulse 4s ease-in-out infinite alternate';
        }
        
        // Animate shield breathing
        if (shieldLayers) {
          shieldLayers.style.animation = 'breathe 7s ease-in-out infinite alternate';
        }
      } else {
        mouseParallaxEnabled = true;
        orbitalSystem.style.opacity = '0';
      }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.8; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1.05); }
      }
      @keyframes breathe {
        0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
        100% { transform: scale(1.02) rotate(2deg); opacity: 0.9; }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
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
              case "cta-section":
                setCurrentSection(4);
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
            case "cta-section":
              newSection = 4;
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
          title: "inVerus Trust Layer Demo",
          text: "Check out this Trust Layer verification result from inVerus",
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
    setIsLoading(false);
    setFeedback(null);
    // Focus could be added to the input field here if needed
  };

  const handleGoodResponse = () => {
    setFeedback(feedback === "good" ? null : "good");
    // Here you could send feedback to analytics or backend
    console.log("Good response feedback submitted");
  };

  return (
    <div className="w-full">
      {/* Section 1: Chat Demo Window */}
      <section
        id="chat-demo-section"
        className="flex flex-col items-center justify-center h-[100svh] md:min-h-screen w-full px-4 py-0 md:py-8 my-0"
      >
        <div className="w-full max-w-[900px] min-h-[400px] md:min-h-[480px] max-h-[85vh] md:max-h-[80vh] backdrop-filter backdrop-blur-xl rounded-md relative">
          {/* Main Chat Content */}
          <div className="flex h-full flex-col">
            {messages.length === 0 ? (
              /* Empty state - centered layout */
              <div className="flex flex-1 items-center justify-center flex-col">
                <div className="text-center">
                  {/* Logo Mark - inVerus Logo (Placeholder) */}
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
                    <div className="text-lg font-medium tracking-wide uppercase text-gray-500 dark:text-gray-400">
                      MyDataHub
                    </div>
                  </div>
                  
                  {/* Header */}
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight max-w-4xl text-gray-900 dark:text-gray-100 text-balance mb-6">
                    Your Data.<br />Your Sanctuary.
                  </h1>

                  {/* Subtitle */}
                  <div className="mb-4 md:mb-8">
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl text-xl md:text-2xl">
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
        {/* Particle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            id="particleField" 
            className="w-full h-full"
            style={{ 
              transition: 'transform 0.1s linear',
              willChange: 'transform'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-16">
          {/* First paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl md:text-3xl italic text-gray-500 dark:text-gray-400 font-light"
          >
            (Are you tired of being the unseen product in their profit equation?)
          </motion.p>

          {/* Third paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
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
        {/* Orbital Particle System */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <svg 
            id="orbitalSystem"
            className="w-full h-full max-w-[600px] max-h-[600px] opacity-0 transition-opacity duration-1000"
            viewBox="0 0 600 600" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8"/>
                <stop offset="70%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="shieldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(156, 163, 175)" stopOpacity="0.1"/>
                <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="rgb(156, 163, 175)" stopOpacity="0.1"/>
              </linearGradient>
              <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            
            {/* Breathing Shield Layers */}
            <g id="shieldLayers" filter="url(#blur)">
              <ellipse cx="300" cy="300" rx="210" ry="135" fill="none" stroke="url(#shieldGradient)" strokeWidth="2" />
              <ellipse cx="300" cy="300" rx="195" ry="120" fill="url(#shieldGradient)" opacity="0.5" transform="rotate(-5 300 300)" />
            </g>

            {/* Pulsing Core */}
            <g id="hubCore">
              <circle cx="300" cy="300" r="60" fill="url(#coreGlow)" />
              <circle cx="300" cy="300" r="22" fill="rgb(59, 130, 246)" />
            </g>
            
            {/* Orbiting Particles */}
            <g id="orbitingParticles"></g>
          </svg>
        </div>

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

      {/* CTA Section + Footer Combined - Full Viewport */}
      <section
        id="cta-section"
        className="flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-2 md:py-8 my-4 md:my-0"
      >
        {/* CTA Content */}
        <div className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center">
          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-900 py-16 grid grid-cols-12 rounded-lg">
              <div className="px-4 md:px-0 md:col-span-10 md:col-start-2 col-span-12 flex flex-col text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl tracking-tighter leading-tight max-w-4xl text-gray-900 dark:text-gray-100 text-balance mb-6">
                  The Infrastructure of Trust.
                </h1>
                <div className="mb-4 md:mb-8">
                  <p className="text-gray-600 dark:text-gray-400 max-w-4xl text-lg mx-auto">
                    Built to verify who's real.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Link href="https://inverus.ai/auth">
                    <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs h-9 has-[>svg]:px-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-3 rounded-full transition duration-200">
                      Launch the Trust Layer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Bottom of CTA Section */}
        <footer className="w-full border-t border-gray-200 dark:border-gray-700 py-8 mt-auto">
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

                {/* Verifications - Centered */}
                <div className="flex items-center justify-center text-center">
                  <div className="text-green-600 dark:text-green-400">
                    <CountingNumber target={821432781} /> Identities Processed
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                  <a
                    href="mailto:andrew@inverus.tech"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                  >
                    Investors
                  </a>
                  <span>·</span>
                  <a
                    href="/manifesto"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                  >
                    The Manifesto
                  </a>
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

                {/* Center Verifications - Perfectly Centered */}
                <div className="flex items-center justify-center text-center">
                  <div className="text-green-600 dark:text-green-400">
                    <CountingNumber target={821432781} /> Identities Processed
                  </div>
                </div>

                {/* Right Links */}
                <div className="absolute right-0 top-0">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <a
                      href="mailto:andrew@inverus.tech"
                      className="hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                    >
                      Investors
                    </a>
                    <span>·</span>
                    <a
                      href="/manifesto"
                      className="hover:text-gray-900 dark:hover:text-gray-100 transition duration-200"
                    >
                      The Manifesto
                    </a>
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
