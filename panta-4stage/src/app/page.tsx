"use client";

import { useIntakeForm, STAGE_CONFIG } from "@/hooks/useIntakeForm";
import { KnockoutStage } from "@/components/intake/KnockoutStage";

// ===========================
// MAIN COMPONENT
// ===========================
export default function SmartIntake() {
  const {
    form,
    currentStage,
    totalStages,
    isKnockedOut,
    canProceed,
    goToNextStage,
    goToPrevStage,
  } = useIntakeForm();


  // ===========================
  // RENDER FORM
  // ===========================
  return (
    <>
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

      {/* Card Content */}
      <div className="card">
        {/* Stage Content */}
        {currentStage === 1 && <KnockoutStage form={form} />}
        {currentStage === 2 && <div className="card-header"><h2>Stage 2 - Coming Soon</h2></div>}
        {currentStage === 3 && <div className="card-header"><h2>Stage 3 - Coming Soon</h2></div>}
        {currentStage === 4 && <div className="card-header"><h2>Stage 4 - Coming Soon</h2></div>}

        {/* Navigation */}
        {!isKnockedOut && (
          <div className="button-row">
            <button
              className="btn btn-secondary"
              onClick={goToPrevStage}
              disabled={currentStage === 1}
              style={{ opacity: currentStage === 1 ? 0 : 1 }}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={goToNextStage}
              disabled={!canProceed()}
            >
              {currentStage === totalStages ? "Submit Application" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

