'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TutorialStep {
  title: string;
  description: string;
  image: string;
  features?: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to FieldFlow Pro',
    description: 'Your complete command center for field service management. Let us show you around.',
    image: '/images/assets/tutorial-1.png',
    features: ['Schedule jobs effortlessly', 'Track everything in real-time', 'Get paid faster'],
  },
  {
    title: 'Manage Jobs Like a Pro',
    description: 'Create, assign, and track jobs from your phone. GPS routing gets you there faster.',
    image: '/images/assets/tutorial-2.png',
    features: ['One-tap job creation', 'GPS route optimization', 'Photo documentation'],
  },
  {
    title: 'Invoice & Get Paid Instantly',
    description: 'Send professional invoices in seconds. Accept payments on the spot.',
    image: '/images/assets/tutorial-3.png',
    features: ['Auto-fill from job data', 'Accept card payments', 'Track payment status'],
  },
];

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-[#141416] to-[#0A0A0B] rounded-3xl border border-[#27272A] overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-orange-500'
                      : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {/* Image */}
                <div className="relative w-48 h-48 mb-6">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
                  <p className="text-zinc-400 mb-6 max-w-md">{step.description}</p>
                </motion.div>

                {/* Features */}
                {step.features && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-6"
                  >
                    {step.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                className="gap-2"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Dashboard Tutorial Component
export function DashboardTutorial({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem('fieldflow_tutorial_seen');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('fieldflow_tutorial_seen', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <TutorialOverlay
      isOpen={isVisible}
      onClose={handleClose}
      onComplete={handleClose}
    />
  );
}

export default TutorialOverlay;
