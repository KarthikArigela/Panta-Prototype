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

      {/* GitHub Link */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px 16px",
          marginBottom: "16px",
          borderRadius: "8px",
          maxWidth: "700px",
          margin: "0 auto 16px auto",
        }}
      >
        <a
          href="https://github.com/KarthikArigela/Panta-Prototype"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#24292f",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #d0d7de",
            backgroundColor: "#fff",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.borderColor = "#1f2328";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.borderColor = "#d0d7de";
          }}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View Source Code on GitHub
        </a>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        {STAGE_CONFIG.map((stage) => (
          <div
            key={stage.id}
            className={`progress-step ${currentStage === stage.id
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
          gap: "12px",
          maxWidth: "700px",
          margin: "0 auto 24px auto",
          padding: "0 1rem",
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
