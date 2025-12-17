"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";

export function ChatLandingWindow() {
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const sectionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for GSAP animations
  const viewport1Ref = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const line4Ref = useRef<HTMLParagraphElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Sequential text animation for Viewport 1
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Set initial states
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current], {
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
      });

      // Animate each line sequentially with beautiful easing
      tl.to(line1Ref.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        delay: 0.5,
      })
        .to(line2Ref.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
        }, "+=1")
        .to(line3Ref.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
        }, "+=1")
        .to(line4Ref.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
        }, "+=1");
    }, viewport1Ref);

    return () => ctx.revert();
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

          if (sectionChangeTimeoutRef.current) {
            clearTimeout(sectionChangeTimeoutRef.current);
          }

          sectionChangeTimeoutRef.current = setTimeout(() => {
            switch (sectionId) {
              case "viewport-1-section":
                setCurrentSection(1);
                setShowScrollArrow(true);
                break;
              case "viewport-2-section":
                setCurrentSection(2);
                setShowScrollArrow(true);
                break;
              case "viewport-3-section":
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
          }, 150);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = [
      "viewport-1-section",
      "viewport-2-section",
      "viewport-3-section",
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
        const sections = document.querySelectorAll('[id$="-section"]');
        let mostVisibleSection = null;
        let maxVisibleArea = 0;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

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
            case "viewport-1-section":
              newSection = 1;
              newShowArrow = true;
              break;
            case "viewport-2-section":
              newSection = 2;
              newShowArrow = true;
              break;
            case "viewport-3-section":
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
        return "viewport-2-section";
      case 2:
        return "viewport-3-section";
      case 3:
        return "horizon-section";
      case 4:
        return "cta-section";
      default:
        return "viewport-2-section";
    }
  };

  // Helper: Scroll to section
  const scrollToSectionById = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error(`Target element not found: ${targetId}`);
      return;
    }

    try {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Scroll error:", error);
    }
  };

  // Handle arrow click
  const handleArrowClick = () => {
    const targetId = getNextSectionId();

    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.error(`Target element not found: ${targetId}`);
      return;
    }

    scrollToSectionById(targetId);
  };

  return (
    <div className="w-full">
      {/* Viewport 1: Sequential Text Transitions with Sparkles */}
      <section
        id="viewport-1-section"
        ref={viewport1Ref}
        className="relative flex flex-col items-center justify-center h-[100svh] md:min-h-screen w-full px-4 py-0 md:py-8 my-0 overflow-hidden"
      >
        {/* Sparkles Background - Full Viewport */}
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="viewport1Sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.4}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#3B82F6"
            speed={0.5}
          />
        </div>

        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

        {/* Text Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8 px-4">
          {/* Line 1 */}
          <p
            ref={line1Ref}
            className="text-xl md:text-3xl lg:text-4xl leading-relaxed font-light text-gray-900 dark:text-gray-100"
            style={{ opacity: 0 }}
          >
            Your digital life: scattered, exposed, a story written by others.
          </p>

          {/* Line 2 */}
          <p
            ref={line2Ref}
            className="text-lg md:text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 font-light"
            style={{ opacity: 0 }}
          >
            It wasn't meant to be this way.
          </p>

          {/* Line 3 */}
          <p
            ref={line3Ref}
            className="text-lg md:text-2xl lg:text-3xl italic text-gray-500 dark:text-gray-400 font-light"
            style={{ opacity: 0 }}
          >
            Are you tired...?
          </p>

          {/* Line 4 */}
          <p
            ref={line4Ref}
            className="text-xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 pt-4"
            style={{ opacity: 0 }}
          >
            We believe in a different future.
          </p>
        </div>
      </section>

      {/* Viewport 2: Clarity and Control */}
      <section
        id="viewport-2-section"
        className="relative flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-12 md:py-16 overflow-hidden"
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-16 md:space-y-24">
          {/* Line 1: It's time for clarity and control */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-4xl leading-relaxed font-medium text-gray-900 dark:text-gray-100"
          >
            It's time for clarity and control.
          </motion.p>

          {/* Line 2: A place of focus, trust and true ownership */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl md:text-3xl leading-relaxed text-gray-600 dark:text-gray-400 font-light"
          >
            A place of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              focus
            </span>
            ,{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              trust
            </span>{" "}
            and{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              true ownership
            </span>{" "}
            — a place that is{" "}
            <span className="text-blue-500 dark:text-blue-400 font-semibold">
              yours
            </span>
            .
          </motion.p>

          {/* Line 3: Your Data. Your Sanctuary. */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="pt-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-gray-900 dark:text-gray-100">
              Your Data.
              <br />
              Your Sanctuary.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Viewport 3: Introducing MySanctum.ai */}
      <section
        id="viewport-3-section"
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
          {/* Introducing... */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light tracking-wide mb-4 text-center"
          >
            Introducing...
          </motion.p>

          {/* MySanctum.ai Header */}
          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-12 text-center text-gray-900 dark:text-gray-100"
          >
            MySanctum.ai
          </motion.h2>

          {/* AI Animation Visualizer - Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
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
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.4,
              }}
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
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Absolute Control
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                You hold the only key. Grant access by purpose, and revoke it
                instantly.
              </p>
            </motion.div>

            {/* Profound Security */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.5,
              }}
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Profound Security
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Encryption, isolation, and zero-knowledge architecture. Peace of
                mind by design.
              </p>
            </motion.div>

            {/* Recognised Value */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.6,
              }}
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
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                Recognised Value
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Stop being the product. When you share, you define the terms and
                keep the value.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Viewport 4: Horizon (Future) - As is */}
      <section
        id="horizon-section"
        className="flex flex-col items-center justify-center min-h-[calc(100svh-2rem)] md:min-h-screen w-full px-4 py-12 md:py-16"
      >
        <div className="w-full max-w-3xl mx-auto text-center space-y-12">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100"
          >
            This is Only the Beginning.
          </motion.h2>

          {/* Body Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed space-y-6"
          >
            <p>
              Your{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                Sanctuary
              </strong>{" "}
              evolves with you — unlocking personal insights that truly serve
              you and pioneering a fairer, more thoughtful digital economy. Join
              today to secure your data and help build this future, together.
            </p>

            <p>
              As a{" "}
              <span className="text-blue-500 dark:text-blue-400 font-medium">
                Founding Pioneer
              </span>
              , you'll gain early influence, priority access, and{" "}
              <span className="text-blue-500 dark:text-blue-400 font-medium">
                Pioneer Points
              </span>{" "}
              — your share in the future we're building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Viewport 5: CTA - As is */}
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
                    Crafted with care by a team dedicated to restoring digital
                    dignity.
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
                    Crafted with care by a team dedicated to restoring digital
                    dignity.
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

      {/* Global Fixed Scroll Arrow */}
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
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleArrowClick();
              }}
              className="group flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer p-3 md:p-4"
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
                  className="text-blue-400 group-hover:text-blue-300 md:w-7 md:h-7"
                />
              </motion.div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
