"use client";

import { useIntakeForm, STAGE_CONFIG } from "@/hooks/useIntakeForm";
import { KnockoutStage } from "@/components/intake/KnockoutStage";
import { RiskClassifierStage } from "@/components/intake/RiskClassifierStage";
import { BusinessInfoSection } from "@/components/intake/BusinessInfoSection";
import { OperationsSafetySection } from "@/components/intake/OperationsSafetySection";
import { VehicleScheduleSection } from "@/components/intake/VehicleScheduleSection";
import { DriverSection } from "@/components/intake/DriverSection";
import PriorInsuranceSection from "@/components/intake/PriorInsuranceSection";
import { CoveragePreferencesSection } from "@/components/intake/CoveragePreferencesSection";
import { DocumentGateStage } from "@/components/intake/DocumentGateStage";

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
        {currentStage === 2 && <RiskClassifierStage form={form} />}
        {currentStage === 3 && (
          <>
            <div className="card-header">
              <h2>📝 Business Details</h2>
              <p>Tell us about your trucking business so we can prepare your quote.</p>
            </div>
            <BusinessInfoSection form={form} />
            <OperationsSafetySection form={form} />
            <VehicleScheduleSection form={form} />
            <DriverSection form={form} />
            <PriorInsuranceSection form={form} />
            <CoveragePreferencesSection form={form} />
          </>
        )}
        {currentStage === 4 && <DocumentGateStage form={form} />}

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

