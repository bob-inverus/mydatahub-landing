"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { ThemeToggle } from "@/components/home/theme-toggle";
import { MySanctumIcon } from "@/components/icons/mysanctum-icon";

interface LandingPageProps {
  className?: string;
}

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-block overflow-hidden h-5 flex items-center text-sm">
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-muted-foreground">{children}</span>
        <span className="text-foreground">{children}</span>
      </div>
    </a>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = <MySanctumIcon size={24} className="flex-shrink-0" />;

  const navLinksData = [
    { label: 'About', href: '/about' },
    { label: 'Security', href: '/security' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const getStartedButtonElement = (
    <Link href="/auth">
      <button className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-border bg-background/20 backdrop-blur-sm text-foreground rounded-full hover:border-foreground/50 hover:bg-background/30 transition-colors duration-200 w-full sm:w-auto">
        Get Started
      </button>
    </Link>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-border bg-background/40
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
          {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <ThemeToggle variant="icon" />
          {getStartedButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-foreground focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {getStartedButtonElement}
          <div className="flex justify-center w-full">
            <ThemeToggle variant="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}

export const LandingPage = ({ className }: LandingPageProps) => {

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-background relative", className)}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-background"
            colors={[
              [29, 78, 216],
              [29, 78, 216],
            ]}
            dotSize={6}
            reverse={false}
            showGradient={false}
          />
        </div>
        
        {/* Dark mode gradient - only shows in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 dark:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Subtle fades for both modes */}
        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-background/90 via-background/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
      </div>
      
      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar />

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-md px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
                  MySanctum
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light">
                  Your Personal Data Vault
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <Link href="/auth">
                  <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-background/5 hover:bg-accent text-foreground border border-border rounded-full py-3 px-4 transition-colors">
                    Get Started
                  </button>
                </Link>
              </motion.div>
              
              <p className="text-xs text-muted-foreground pt-8">
                By signing up, you agree to the <Link href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">MSA</Link>, <Link href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">Product Terms</Link>, <Link href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">Policies</Link>, <Link href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">Privacy Notice</Link>, and <Link href="#" className="underline text-muted-foreground hover:text-foreground transition-colors">Cookie Notice</Link>.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

