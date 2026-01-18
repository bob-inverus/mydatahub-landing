'use client';

import { useState, useEffect, ReactElement } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Computer, CornerDownLeft, Paperclip, Mic, Zap, FolderOpen, Globe, Presentation, BarChart3, FileText, Search, Image as ImageIcon, Database, Wrench } from 'lucide-react';
import { MySanctumLoader } from '@/components/ui/mysanctum-loader';
import { motion } from 'framer-motion';
import { MySanctumIcon } from '@/components/sidebar/mysanctum-logo';

// Company Logo Component
const CompanyLogo = ({ name, className }: { name: string; className?: string }) => {
  const logos: Record<string, ReactElement> = {
    facebook: (
      <div className={`${className} bg-[#1877F2] rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    ),
    google: (
      <div className={`${className} bg-white dark:bg-white rounded-lg flex items-center justify-center border border-border`}>
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
    ),
    x: (
      <div className={`${className} bg-black dark:bg-black rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    ),
    chase: (
      <div className={`${className} bg-white dark:bg-white rounded-lg flex items-center justify-center border border-border`}>
        <svg viewBox="0 -228.6 561.578 561.578" className="w-5 h-5">
          <path d="M494.525 0a3.69 3.69 0 0 0-3.691 3.686v25.83h68.244L528 .008 494.525 0M561.578 37.33a3.677 3.677 0 0 0-3.688-3.68h-25.828v68.242l29.504-31.086.012-33.476M524.236 104.369a3.688 3.688 0 0 0 3.678-3.688V74.854h-68.241l31.073 29.508 33.49.007M457.18 67.043a3.687 3.687 0 0 0 3.686 3.688h25.83V2.484l-29.512 31.078-.004 33.481" fill="#0659a5"/>
          <path fill="#010101" d="M144.379 12.453v31.514h-43.91V12.453l-15.987-.006v79.461h15.987V57.771h43.91v34.137h16.016V12.453h-16.016M357.123 12.453v79.441l70.164-.004-8.891-13.98h-45.23V57.771h43.797V44.299h-43.797V26.111h45.156l8.711-13.658h-69.91M25.043 12.443C8.404 12.443 0 22.549 0 37.266v29.665C0 83.957 10.824 91.91 24.957 91.91l50.164-.01-9.293-14.521H28.053c-8.021 0-11.515-2.899-11.515-11.881v-26.91c0-8.684 2.939-12.072 11.729-12.072h37.955l8.928-14.072-50.107-.001M286.947 12.42c-9.613 0-19.451 5.771-19.451 20.625v3.816c0 15.475 9.476 21.389 18.949 21.432h33.275c3.455 0 6.264.572 6.264 6.416l-.004 6.754c-.086 5.236-2.711 6.447-6.379 6.447H275.83l-8.967 13.979h53.762c12.972 0 21.773-6.447 21.773-21.353V65.06c0-14.408-8.176-21.207-20.859-21.207h-31.77c-3.525 0-5.976-.967-5.976-6.184l-.004-5.492c0-4.443 1.688-6.066 5.791-6.066l41.683-.016 8.715-13.69-53.031.015M206.863 12.465L169.184 91.9h17.811l7.338-16.405h40.941l7.315 16.405h17.882l-37.765-79.436-15.843.001m7.896 16.488l14.479 33.021h-28.867l14.388-33.021z"/>
        </svg>
      </div>
    ),
  };

  return logos[name] || <div className={`${className} bg-card border rounded-lg`} />;
};

type ViewType = 'terminal' | 'files' | 'browser' | 'dashboard';
type IconType = 'computer' | 'presentation' | 'chart' | 'file' | 'search' | 'image' | 'database';
type ContentType = 'empty' | 'image' | 'files' | 'slides' | 'table' | 'markdown' | 'search' | 'dashboard';

interface Connection {
  id: string;
  name: string;
  status: 'granted' | 'denied' | 'pending';
  logo: string; // Can be emoji or URL
  logoType?: 'emoji' | 'svg' | 'image';
  category: string;
  dataRequested?: string;
  lastAccess?: string;
  highlight?: boolean;
}

// Helper to get icon component
const getIconComponent = (iconType?: IconType) => {
  switch (iconType) {
    case 'presentation': return Presentation;
    case 'chart': return BarChart3;
    case 'file': return FileText;
    case 'search': return Search;
    case 'image': return ImageIcon;
    case 'database': return Database;
    default: return Computer;
  }
};

interface Step {
  type: 'message' | 'toolcall' | 'voice' | 'transcription';
  aiText?: string;
  title?: string;
  voiceText?: string;
  transcribedText?: string;
  view?: ViewType;
  icon?: IconType;
  // Content to show in computer
  contentType?: ContentType;
  contentImage?: string;
  contentSlides?: string[];
  contentFiles?: { name: string; type: 'folder' | 'file' }[];
  contentMarkdown?: string;
  contentConnections?: Connection[];
  // Keep content from previous step
  keepContent?: boolean;
}

// Example showcase data with steps
const exampleShowcases = [
  {
    id: 'grant-access',
    title: 'Grant Access',
    description: 'Grant Chase Bank access to my income data',
    steps: [
      {
        type: 'voice',
        voiceText: 'Listening...'
      } as Step,
      {
        type: 'transcription',
        transcribedText: 'Grant Chase Bank access to my income data'
      } as Step,
      {
        type: 'message',
        aiText: "I'll help you grant Chase Bank access to your income data securely..."
      } as Step,
      {
        type: 'toolcall',
        title: 'Loading Dashboard',
        view: 'dashboard' as ViewType,
        icon: 'database',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'denied', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data' },
          { id: '2', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '2 hours ago' },
          { id: '3', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '1 day ago' },
        ]
      } as Step,
      {
        type: 'toolcall',
        title: 'Verifying App',
        view: 'dashboard' as ViewType,
        icon: 'search',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'pending', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', highlight: true },
          { id: '2', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '2 hours ago' },
          { id: '3', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '1 day ago' },
        ]
      } as Step,
      {
        type: 'toolcall',
        title: 'Granting Access',
        view: 'dashboard' as ViewType,
        icon: 'database',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', lastAccess: 'Just now', highlight: true },
          { id: '2', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '2 hours ago' },
          { id: '3', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '1 day ago' },
        ]
      } as Step,
    ],
  },
  {
    id: 'revoke-access',
    title: 'Revoke Access',
    description: 'Revoke Facebook access to my contacts',
    steps: [
      {
        type: 'voice',
        voiceText: 'Listening...'
      } as Step,
      {
        type: 'transcription',
        transcribedText: 'Revoke Facebook access to my contacts'
      } as Step,
      {
        type: 'message',
        aiText: "I'll revoke Facebook's access to your contacts immediately..."
      } as Step,
      {
        type: 'toolcall',
        title: 'Loading Dashboard',
        view: 'dashboard' as ViewType,
        icon: 'database',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', lastAccess: '15 min ago' },
          { id: '2', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '2 hours ago' },
          { id: '3', name: 'Facebook', status: 'granted', logo: 'facebook', logoType: 'svg', category: 'Social Media', dataRequested: 'Contacts', lastAccess: '2 hours ago' },
          { id: '4', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '1 week ago' },
        ]
      } as Step,
      {
        type: 'toolcall',
        title: 'Revoking Access',
        view: 'dashboard' as ViewType,
        icon: 'database',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '3', name: 'Facebook', status: 'pending', logo: 'facebook', logoType: 'svg', category: 'Social Media', dataRequested: 'Contacts', lastAccess: '2 hours ago', highlight: true },
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', lastAccess: '15 min ago' },
          { id: '2', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '2 hours ago' },
          { id: '4', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '1 week ago' },
        ]
      } as Step,
      {
        type: 'toolcall',
        title: 'Access Revoked',
        view: 'dashboard' as ViewType,
        icon: 'file',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '3', name: 'Facebook', status: 'denied', logo: 'facebook', logoType: 'svg', category: 'Social Media', dataRequested: 'Contacts', highlight: true },
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', lastAccess: '15 min ago' },
          { id: '2', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '2 hours ago' },
          { id: '4', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '1 week ago' },
        ]
      } as Step,
    ],
  },
  {
    id: 'monitor-access',
    title: 'Monitor Access',
    description: 'Show me who accessed my data this week',
    steps: [
      {
        type: 'voice',
        voiceText: 'Listening...'
      } as Step,
      {
        type: 'transcription',
        transcribedText: 'Show me who accessed my data this week'
      } as Step,
      {
        type: 'message',
        aiText: "I'll pull up your data access log for this week..."
      } as Step,
      {
        type: 'toolcall',
        title: 'Loading Dashboard',
        view: 'dashboard' as ViewType,
        icon: 'search',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: 'Income Data', lastAccess: '15 min ago' },
          { id: '2', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: 'Email & Contacts', lastAccess: '2 hours ago' },
          { id: '3', name: 'Facebook', status: 'denied', logo: 'facebook', logoType: 'svg', category: 'Social Media', dataRequested: 'Contacts' },
          { id: '4', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '1 week ago' },
        ]
      } as Step,
      {
        type: 'toolcall',
        title: 'Activity Analysis',
        view: 'dashboard' as ViewType,
        icon: 'chart',
        contentType: 'dashboard' as ContentType,
        contentConnections: [
          { id: '1', name: 'Chase Bank', status: 'granted', logo: 'chase', logoType: 'svg', category: 'Financial', dataRequested: '156 requests', lastAccess: '15 min ago', highlight: true },
          { id: '2', name: 'Google', status: 'granted', logo: 'google', logoType: 'svg', category: 'Cloud Services', dataRequested: '98 requests', lastAccess: '2 hours ago', highlight: true },
          { id: '3', name: 'Facebook', status: 'denied', logo: 'facebook', logoType: 'svg', category: 'Social Media', dataRequested: '93 requests (revoked)', highlight: true },
          { id: '4', name: 'X', status: 'granted', logo: 'x', logoType: 'svg', category: 'Social Media', dataRequested: 'Profile Info', lastAccess: '1 week ago' },
        ]
      } as Step,
    ],
  },
];

export function ExampleShowcase() {
  const [activeExample, setActiveExample] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiText, setAiText] = useState('');
  const [selectedView, setSelectedView] = useState<ViewType>('dashboard');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayedContent, setDisplayedContent] = useState<Step | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceTime, setVoiceTime] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');

  const currentExample = exampleShowcases[activeExample];
  const currentStep = currentExample.steps[currentStepIndex];
  const userMessage = currentExample.description;

  // Different timing per example
  const isSlowExample = currentExample.id === 'monitor-access';
  const AUTOPLAY_DURATION = isSlowExample ? 20000 : 16000; // 20s for monitor, 16s for others (added time for voice steps)
  const STEP_DURATION = isSlowExample ? 2800 : 1800; // 2.8s for monitor, 1.8s for others
  const SLIDE_DURATION = 1500; // Time per slide

  // Auto-play - switch examples
  useEffect(() => {
    const autoplayTimer = setTimeout(() => {
      setActiveExample((prev) => (prev + 1) % exampleShowcases.length);
      setCurrentStepIndex(0);
    }, AUTOPLAY_DURATION);

    return () => {
      clearTimeout(autoplayTimer);
    };
  }, [activeExample]);

  // Step progression
  useEffect(() => {
    setCurrentStepIndex(0);
    setAiText('');
    setSelectedView('dashboard');
    setCurrentSlide(0);
    setDisplayedContent(null);
    setIsListening(false);
    setVoiceTime(0);
    setTranscribedText('');
  }, [activeExample]);

  // Animate through steps
  useEffect(() => {
    const step = currentExample.steps[currentStepIndex];
    if (!step) return;

    // Handle voice step (simulate recording)
    if (step.type === 'voice') {
      setIsListening(true);
      setVoiceTime(0);
      
      // Simulate voice recording for 2 seconds
      const voiceTimer = setTimeout(() => {
        setIsListening(false);
        if (currentStepIndex < currentExample.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, 2000);

      // Animate timer
      const timerInterval = setInterval(() => {
        setVoiceTime(t => t + 1);
      }, 1000);

      return () => {
        clearTimeout(voiceTimer);
        clearInterval(timerInterval);
      };
    }

    // Handle transcription step
    if (step.type === 'transcription') {
      setTranscribedText('');
      let index = 0;
      const fullText = step.transcribedText || '';
      const typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setTranscribedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          // Move to next step after transcription (keep text visible longer)
          setTimeout(() => {
            if (currentStepIndex < currentExample.steps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
            }
          }, 800);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }

    // Handle message step with typing
    if (step.type === 'message') {
      setAiText('');
      // Clear input box transcription once message appears
      const clearTimer = setTimeout(() => {
        setTranscribedText('');
      }, 100);
      
      let index = 0;
      const fullText = step.aiText || '';
      const typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setAiText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          // Move to next step after typing
          setTimeout(() => {
            if (currentStepIndex < currentExample.steps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
            }
          }, 300);
        }
      }, 15);

      return () => {
        clearTimeout(clearTimer);
        clearInterval(typingInterval);
      };
    }

    // Handle tool call step
    if (step.type === 'toolcall') {
      if (step.view) {
        setSelectedView(step.view);
      }
      setCurrentSlide(0);

      // Update displayed content (unless keepContent is true)
      if (!step.keepContent) {
        setDisplayedContent(step);
      }

      // If slides, cycle through them
      if (step.contentType === 'slides' && step.contentSlides && step.contentSlides.length > 1) {
        const slideTimer = setTimeout(() => {
          setCurrentSlide(1);
        }, SLIDE_DURATION);

        const nextStepTimer = setTimeout(() => {
          if (currentStepIndex < currentExample.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          }
        }, STEP_DURATION + SLIDE_DURATION);

        return () => {
          clearTimeout(slideTimer);
          clearTimeout(nextStepTimer);
        };
      }

      const timer = setTimeout(() => {
        if (currentStepIndex < currentExample.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, STEP_DURATION);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentExample, activeExample]);

  return (
    <div className="relative z-10 w-full max-w-5xl px-8">
      {/* Main Card - 16:9 aspect ratio */}
      <Card className="!rounded-3xl !p-0 overflow-hidden aspect-video select-none">
        {/* 50/50 Split Layout */}
        <div className="flex h-full">
          {/* Left Side - Chat */}
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 space-y-3 overflow-hidden">
              {/* Show user message once AI starts responding (after transcription) */}
              {currentStepIndex > 1 && currentExample.steps.find(s => s.type === 'transcription') && (
                <div className="flex justify-end">
                  <div className="flex max-w-[90%] rounded-3xl rounded-br-lg bg-card border px-3 py-2 break-words overflow-hidden">
                    <p className="text-[10px] leading-relaxed">
                      {currentExample.steps.find(s => s.type === 'transcription')?.transcribedText || ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Show all steps up to current (history) - skip voice and transcription steps */}
              {currentExample.steps.slice(0, currentStepIndex + 1).filter(s => s.type !== 'voice' && s.type !== 'transcription').map((step, idx) => {
                const originalIdx = currentExample.steps.indexOf(step);
                const isCurrentStep = originalIdx === currentStepIndex;

                if (step.type === 'message') {
                  const displayText = isCurrentStep ? aiText : (step.aiText || '');
                  const isTyping = isCurrentStep && aiText.length < (step.aiText?.length || 0);

                  return (
                    <div key={idx} className="flex justify-start">
                      <div className="max-w-[90%] space-y-1">
                        <div className="flex items-center gap-1 mb-1">
                          <MySanctumIcon size={8} className="flex-shrink-0" />
                        </div>
                        <p className="text-[9px] leading-relaxed text-foreground">
                          {displayText}
                          {isTyping && <span className="inline-block w-0.5 h-2.5 bg-primary ml-0.5 animate-pulse" />}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (step.type === 'toolcall') {
                  const IconComponent = getIconComponent(step.icon);
                  return (
                    <div key={idx} className="my-1">
                      <button
                        onClick={() => setCurrentStepIndex(idx)}
                        className="inline-flex items-center gap-1 h-6 px-1.5 py-1 text-xs text-muted-foreground bg-card rounded-lg border border-neutral-200 dark:border-neutral-700/50 whitespace-nowrap cursor-pointer hover:bg-card/80 transition-colors"
                      >
                        <IconComponent className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-mono text-[9px] text-foreground">{step.title}</span>
                        {isCurrentStep && (
                          <MySanctumLoader size="small" className="ml-0.5" />
                        )}
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Example Selector - Above chat input */}
            <div className="bg-background px-4 pt-3 pb-2">
              <div className="flex gap-1.5 flex-wrap">
                {exampleShowcases.map((example, idx) => (
                  <motion.button
                    key={example.id}
                    onClick={() => setActiveExample(idx)}
                    animate={{
                      width: activeExample === idx ? 'auto' : 'fit-content',
                      paddingLeft: activeExample === idx ? '14px' : '10px',
                      paddingRight: activeExample === idx ? '14px' : '10px',
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className={`py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${activeExample === idx
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border text-foreground hover:bg-card/80'
                      }`}
                  >
                    {example.title}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Area - multiline with border and voice */}
            <div className="bg-background px-4 pb-4">
              <div className="flex flex-col border rounded-2xl bg-card px-3 py-2 relative overflow-hidden">
                {/* Frequency bars overlay - shown when listening */}
                {isListening && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center gap-0.5 pointer-events-none z-10 bg-card/80 backdrop-blur-sm rounded-2xl"
                  >
                    <div className="flex items-center justify-center gap-0.5 h-full px-2">
                      {[...Array(35)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-primary rounded-full"
                          initial={{ height: 2 }}
                          animate={{
                            height: [2, 4 + Math.random() * 14, 4 + Math.random() * 7, 2],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.02,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    {/* Timer in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[9px] font-medium text-primary bg-background px-2 py-0.5 rounded-full border border-primary/30 shadow-sm">
                        {Math.floor(voiceTime / 60).toString().padStart(2, '0')}:{(voiceTime % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Text input - shows transcribed or placeholder text */}
                <textarea
                  disabled
                  rows={1}
                  value={transcribedText || ''}
                  placeholder="Click the microphone to speak..."
                  className="w-full bg-transparent text-[10px] outline-none text-foreground resize-none leading-relaxed mb-2 placeholder:text-muted-foreground relative z-0"
                />

                {/* Footer - buttons at bottom */}
                <div className="flex items-center justify-between gap-1.5 relative z-0">
                  {/* Left buttons - separate with borders */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-1 rounded-lg border">
                      <Paperclip className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded-lg border">
                      <Wrench className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Right buttons */}
                  <div className="flex gap-1 items-center flex-shrink-0">
                    <button className="px-2 py-1 rounded-lg border bg-background flex items-center gap-1">
                      <span className="text-[8px] font-medium">MySanctum</span>
                      <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Microphone button - static, no expansion */}
                    <button className="p-1 rounded-lg border bg-background">
                      {isListening ? (
                        <motion.div
                          className="w-3 h-3 bg-primary rounded-sm"
                          animate={{
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      ) : (
                        <Mic className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                    <button className="p-1.5 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <CornerDownLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - MySanctum Vault (Floating) */}
          <div className="flex-1 bg-background p-4">
            <Card className="w-full h-full !rounded-2xl !p-0 !gap-0 overflow-hidden flex flex-col">
              {/* Computer Header */}
              <div className="border-b px-3 py-2 flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-1.5">
                  <MySanctumIcon size={12} />
                  <span className="text-xs font-medium">MySanctum Vault</span>
                </div>
                <div className="flex items-center gap-0.5 border rounded-full bg-card p-1 relative">
                  <div className="p-1 relative z-10 pointer-events-none">
                    {selectedView === 'dashboard' && (
                      <motion.div
                        layoutId="active-view"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <BarChart3 className={`w-3 h-3 relative z-10 transition-colors ${selectedView === 'dashboard'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                      }`} />
                  </div>
                  <div className="p-1 relative z-10 pointer-events-none">
                    {selectedView === 'terminal' && (
                      <motion.div
                        layoutId="active-view"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Zap className={`w-3 h-3 relative z-10 transition-colors ${selectedView === 'terminal'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                      }`} />
                  </div>
                  <div className="p-1 relative z-10 pointer-events-none">
                    {selectedView === 'files' && (
                      <motion.div
                        layoutId="active-view"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <FolderOpen className={`w-3 h-3 relative z-10 transition-colors ${selectedView === 'files'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                      }`} />
                  </div>
                  <div className="p-1 relative z-10 pointer-events-none">
                    {selectedView === 'browser' && (
                      <motion.div
                        layoutId="active-view"
                        className="absolute inset-0 bg-primary rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Globe className={`w-3 h-3 relative z-10 transition-colors ${selectedView === 'browser'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                      }`} />
                  </div>
                </div>
              </div>

              {/* Computer Content - Dynamic based on displayedContent */}
              <div className="relative flex-1 min-h-0 overflow-hidden">
                {/* Empty state */}
                {(!displayedContent?.contentType || displayedContent.contentType === 'empty') && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Computer className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                      <p className="text-[9px] text-muted-foreground">Processing...</p>
                    </div>
                  </div>
                )}

                {/* Image content */}
                {displayedContent?.contentType === 'image' && displayedContent.contentImage && (
                  <>
                    {displayedContent.contentImage.includes('logo.png') || displayedContent.contentImage.includes('mockup') ? (
                      <div className="h-full w-full p-3">
                        <div className={`w-full h-full rounded-xl border relative overflow-hidden ${displayedContent.contentImage.includes('logo.png') ? 'bg-white' : ''}`}>
                          <Image
                            src={displayedContent.contentImage}
                            alt={currentExample.title}
                            fill
                            className="object-contain"
                            quality={100}
                            sizes="50vw"
                            unoptimized={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={`h-full w-full relative ${displayedContent.contentImage.includes('dashboard') ? 'bg-black' : ''}`}>
                        <Image
                          src={displayedContent.contentImage}
                          alt={currentExample.title}
                          fill
                          className="object-contain"
                          quality={100}
                          sizes="50vw"
                          unoptimized={true}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Files content - grid layout */}
                {displayedContent?.contentType === 'files' && displayedContent.contentFiles && (
                  <div className="p-3 h-full grid grid-cols-3 gap-1.5 content-start">
                    {displayedContent.contentFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center p-1.5 rounded-lg ${idx === displayedContent.contentFiles!.length - 1
                          ? 'bg-primary/10 border border-primary/20'
                          : ''
                          }`}
                      >
                        {file.type === 'folder' ? (
                          <FolderOpen className="w-5 h-5 text-primary mb-0.5" />
                        ) : (
                          <FileText className="w-5 h-5 text-muted-foreground mb-0.5" />
                        )}
                        <span className="text-[7px] text-foreground text-center truncate w-full">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Slides content */}
                {displayedContent?.contentType === 'slides' && displayedContent.contentSlides && (
                  <div className="h-full relative">
                    <Image
                      src={displayedContent.contentSlides[currentSlide] || displayedContent.contentSlides[0]}
                      alt={`Slide ${currentSlide + 1}`}
                      fill
                      className="object-contain transition-opacity duration-300"
                      quality={100}
                      sizes="50vw"
                      unoptimized={true}
                    />
                    {/* Minimal slide indicators */}
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
                      {displayedContent.contentSlides.map((_, idx) => (
                        <div
                          key={idx}
                          className={`transition-all ${idx === currentSlide
                            ? 'w-4 h-1 rounded-full bg-primary'
                            : 'w-1 h-1 rounded-full bg-muted-foreground/30'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Table content - access logs */}
                {displayedContent?.contentType === 'table' && (
                  <div className="p-3 h-full overflow-hidden">
                    <div className="border rounded-xl overflow-hidden h-full">
                      <table className="w-full text-[7px]">
                        <thead className="border-b">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-foreground">App</th>
                            <th className="px-2 py-1 text-left font-medium text-foreground">Data Type</th>
                            <th className="px-2 py-1 text-left font-medium text-foreground">Last Access</th>
                            <th className="px-2 py-1 text-right font-medium text-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ['FitApp', 'Health Data', '15 min ago', 'Active'],
                            ['WeatherPro', 'Location', '2 hrs ago', 'Active'],
                            ['SocialMedia', 'Photos', '1 day ago', 'Revoked'],
                            ['FinanceApp', 'Transactions', '3 days ago', 'Active'],
                            ['CloudDrive', 'Documents', '1 week ago', 'Active'],
                            ['MusicApp', 'Preferences', '2 weeks ago', 'Active'],
                          ].map((row, idx) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="px-2 py-1 text-foreground">{row[0]}</td>
                              <td className="px-2 py-1 text-foreground">{row[1]}</td>
                              <td className="px-2 py-1 text-foreground">{row[2]}</td>
                              <td className="px-2 py-1 text-right">
                                <span className={`${row[3] === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{row[3]}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Search content - browser verification view */}
                {displayedContent?.contentType === 'search' && (
                  <div className="p-3 h-full overflow-hidden">
                    <div className="border rounded-xl h-full overflow-hidden flex flex-col">
                      {/* Search bar */}
                      <div className="py-2 flex items-center justify-center border-b">
                        <div className="flex items-center gap-2 border rounded-full px-3 py-1 w-full max-w-[160px]">
                          <Search className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[8px] text-foreground">FitApp verification</span>
                        </div>
                      </div>
                      {/* Verification results */}
                      <div className="flex-1 p-2 space-y-2 overflow-auto">
                        <div className="space-y-0.5">
                          <p className="text-[7px] text-muted-foreground">fitapp.com</p>
                          <p className="text-[9px] text-primary font-medium">FitApp - Verified Health & Fitness Platform</p>
                          <p className="text-[7px] text-muted-foreground">Certified health app with end-to-end encryption...</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[7px] text-muted-foreground">appsecurity.io</p>
                          <p className="text-[9px] text-primary font-medium">FitApp Security Audit Report</p>
                          <p className="text-[7px] text-muted-foreground">Passed all security checks, compliant with HIPAA...</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[7px] text-muted-foreground">privacy.org</p>
                          <p className="text-[9px] text-primary font-medium">FitApp Privacy Policy Review</p>
                          <p className="text-[7px] text-muted-foreground">Strong privacy practices, transparent data usage...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Markdown content - editor view */}
                {displayedContent?.contentType === 'markdown' && displayedContent.contentMarkdown && (
                  <div className="p-3 h-full overflow-hidden">
                    <div className="border rounded-xl h-full overflow-auto p-3 bg-card">
                      <div className="prose prose-sm max-w-none">
                        {displayedContent.contentMarkdown.split('\n').map((line, idx) => {
                          // Helper to render text with inline bold
                          const renderText = (text: string, className: string) => {
                            const parts = text.split(/(\*\*.*?\*\*)/g);
                            return (
                              <span className={className}>
                                {parts.map((part, i) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                                  }
                                  return <span key={i}>{part}</span>;
                                })}
                              </span>
                            );
                          };

                          if (line.startsWith('# ')) {
                            return <h1 key={idx} className="text-sm font-bold text-foreground mb-2">{line.slice(2)}</h1>;
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-xs font-bold text-foreground mt-3 mb-1.5">{line.slice(3)}</h2>;
                          }
                          if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-[11px] font-semibold text-foreground mt-2 mb-1">{line.slice(4)}</h3>;
                          }
                          if (line.startsWith('- ')) {
                            return <p key={idx} className="text-[10px] text-muted-foreground ml-3 leading-relaxed">• {renderText(line.slice(2), '')}</p>;
                          }
                          if (line.match(/^\d+\./)) {
                            return <p key={idx} className="text-[10px] text-muted-foreground ml-3 leading-relaxed">{renderText(line, '')}</p>;
                          }
                          if (line.trim() === '') {
                            return <div key={idx} className="h-2" />;
                          }
                          return <p key={idx} className="leading-relaxed">{renderText(line, 'text-[10px] text-muted-foreground')}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard content - connections list with toggles */}
                {displayedContent?.contentType === 'dashboard' && displayedContent.contentConnections && (
                  <div className="p-3 h-full overflow-hidden flex flex-col">
                    {/* Search bar */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 border rounded-lg px-2 py-1 bg-background">
                        <Search className="w-2.5 h-2.5 text-muted-foreground" />
                        <input 
                          type="text" 
                          placeholder="Search connections..."
                          className="flex-1 bg-transparent text-[8px] outline-none text-foreground placeholder:text-muted-foreground"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Connections list */}
                    <div className="flex-1 space-y-1.5 overflow-auto">
                      {displayedContent.contentConnections.map((connection) => (
                        <motion.div
                          key={connection.id}
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-xl p-2 flex items-start gap-2 transition-colors ${
                            connection.highlight 
                              ? 'bg-primary/5 border-primary/20' 
                              : 'bg-card'
                          }`}
                        >
                          {/* Company Logo */}
                          <CompanyLogo name={connection.logo} className="w-9 h-9 flex-shrink-0" />
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-semibold text-foreground truncate">
                                  {connection.name}
                                </p>
                                <p className="text-[7px] text-muted-foreground truncate">
                                  {connection.category}
                                </p>
                                {connection.dataRequested && (
                                  <p className="text-[7px] text-foreground/60 mt-0.5">
                                    {connection.dataRequested}
                                  </p>
                                )}
                                {connection.lastAccess && (
                                  <p className="text-[6px] text-muted-foreground/70 mt-0.5">
                                    Last access: {connection.lastAccess}
                                  </p>
                                )}
                              </div>
                              
                              {/* Toggle switch */}
                              <div className="flex-shrink-0 mt-1">
                                <div 
                                  className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                                    connection.status === 'granted' 
                                      ? 'bg-green-500' 
                                      : connection.status === 'pending'
                                      ? 'bg-yellow-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition-transform ${
                                      connection.status === 'granted' || connection.status === 'pending'
                                        ? 'translate-x-3'
                                        : 'translate-x-0.5'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Status badge */}
                            <div className="mt-1.5">
                              <span className={`inline-flex items-center gap-0.5 text-[7px] font-medium px-1.5 py-0.5 rounded-md ${
                                connection.status === 'granted' 
                                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                                  : connection.status === 'pending'
                                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              }`}>
                                {connection.status === 'granted' && '✓ Access Granted'}
                                {connection.status === 'denied' && '✗ Access Denied'}
                                {connection.status === 'pending' && '⏱ Pending...'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
