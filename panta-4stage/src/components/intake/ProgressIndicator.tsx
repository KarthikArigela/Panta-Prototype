/**
 * Progress Indicator Component
 * Displays current stage, visual progress bar, and navigation buttons.
 * Includes welcome back prompt, save & continue, and start over functionality.
 */

"use client";

import { useEffect, useState } from "react";
import { STAGE_CONFIG } from "@/hooks/useIntakeForm";

interface ProgressIndicatorProps {
  currentStage: number;
  totalStages: number;
  hasRestoredState: boolean;
  hasSavedProgress: () => boolean;
  continueFromSaved: () => void;
  startFresh: () => void;
  saveNow: () => void;
  resetForm: () => boolean;
}

export function ProgressIndicator({
  currentStage,
  totalStages,
  hasRestoredState,
  hasSavedProgress,
  continueFromSaved,
  startFresh,
  saveNow,
  resetForm,
}: ProgressIndicatorProps) {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Check for saved progress on mount and show welcome back prompt
  useEffect(() => {
    // Only show welcome back if:
    // 1. We're on the first render (not yet restored state)
    // 2. There is saved progress
    // 3. We haven't already shown the prompt
    if (!hasRestoredState && hasSavedProgress() && typeof window !== "undefined") {
      const hasShownPrompt = sessionStorage.getItem("panta-welcome-shown");
      if (!hasShownPrompt) {
        setShowWelcomeBack(true);
        sessionStorage.setItem("panta-welcome-shown", "true");
      }
    }
  }, [hasRestoredState, hasSavedProgress]);

  // Handle continue from saved
  const handleContinue = () => {
    continueFromSaved();
    setShowWelcomeBack(false);
  };

  // Handle start fresh
  const handleStartFresh = () => {
    startFresh();
    setShowWelcomeBack(false);
  };

  // Handle save & continue later
  const handleSaveAndExit = () => {
    saveNow();
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 3000);
  };

  // Handle start over
  const handleStartOver = () => {
    const success = resetForm();
    if (success && typeof window !== "undefined") {
      sessionStorage.removeItem("panta-welcome-shown");
    }
  };

  return (
    <>
      {/* Welcome Back Modal */}
      {showWelcomeBack && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "32px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "16px",
                color: "var(--color-primary)",
              }}
            >
              Welcome back! 👋
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "24px",
                color: "#333",
              }}
            >
              We found your saved progress. Would you like to continue where you
              left off, or start a new application?
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexDirection: "column",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={handleContinue}
                style={{ width: "100%" }}
              >
                Continue where I left off →
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleStartFresh}
                style={{ width: "100%" }}
              >
                Start a new application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-container">
        {STAGE_CONFIG.map((stage) => (
          <div
            key={stage.id}
            className={`progress-step ${
              currentStage === stage.id
                ? "active"
                : currentStage > stage.id
                ? "completed"
                : ""
            }`}
          >
            <div className="progress-circle">
              {currentStage > stage.id ? "✓" : stage.id}
            </div>
            <span className="progress-label">{stage.label}</span>
          </div>
        ))}
      </div>

      {/* Stage Info & Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Current Stage Info */}
        <div>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "4px",
            }}
          >
            Step {currentStage} of {totalStages}
          </p>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            {STAGE_CONFIG[currentStage - 1]?.label}
          </h3>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Save & Continue Later */}
          <button
            className="btn btn-secondary"
            onClick={handleSaveAndExit}
            style={{
              fontSize: "14px",
              padding: "8px 16px",
              position: "relative",
            }}
          >
            💾 Save & Continue Later
          </button>

          {/* Start Over */}
          <button
            onClick={handleStartOver}
            style={{
              fontSize: "14px",
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#666",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#999";
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#666";
            }}
          >
            🔄 Start Over
          </button>
        </div>
      </div>

      {/* Save Confirmation Toast */}
      {showSaveConfirmation && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            backgroundColor: "#22C55E",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <span style={{ fontSize: "20px" }}>✓</span>
          <span style={{ fontSize: "15px", fontWeight: 500 }}>
            Your progress has been saved!
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .progress-container {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
}
