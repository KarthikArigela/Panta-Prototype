"use client";

import { useState } from "react";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { ProgressIndicator } from "@/components/intake/ProgressIndicator";
import { KnockoutStage } from "@/components/intake/KnockoutStage";
import { RiskClassifierStage } from "@/components/intake/RiskClassifierStage";
import { BusinessInfoSection } from "@/components/intake/BusinessInfoSection";
import { OperationsSafetySection } from "@/components/intake/OperationsSafetySection";
import { VehicleScheduleSection } from "@/components/intake/VehicleScheduleSection";
import { DriverSection } from "@/components/intake/DriverSection";
import PriorInsuranceSection from "@/components/intake/PriorInsuranceSection";
import { CoveragePreferencesSection } from "@/components/intake/CoveragePreferencesSection";
import { DocumentGateStage } from "@/components/intake/DocumentGateStage";
import DownloadPacket from "@/components/intake/DownloadPacket";

// ===========================
// MAIN COMPONENT
// ===========================
export default function SmartIntake() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    form,
    currentStage,
    totalStages,
    hasRestoredState,
    isKnockedOut,
    canProceed,
    goToNextStage,
    goToPrevStage,
    saveNow,
    resetForm,
    hasSavedProgress,
    continueFromSaved,
    startFresh,
  } = useIntakeForm();


  // Handle form submission
  const handleSubmit = () => {
    if (currentStage === totalStages && canProceed()) {
      setIsSubmitted(true);
    }
  };

  // ===========================
  // RENDER FORM
  // ===========================

  // Show download packet after submission
  if (isSubmitted) {
    return (
      <>
        <ProgressIndicator
          currentStage={currentStage}
          totalStages={totalStages}
          hasRestoredState={hasRestoredState}
          hasSavedProgress={hasSavedProgress}
          continueFromSaved={continueFromSaved}
          startFresh={startFresh}
          saveNow={saveNow}
          resetForm={resetForm}
        />
        <DownloadPacket form={form} />
      </>
    );
  }

  return (
    <>
      {/* Progress Indicator */}
      <ProgressIndicator
        currentStage={currentStage}
        totalStages={totalStages}
        hasRestoredState={hasRestoredState}
        hasSavedProgress={hasSavedProgress}
        continueFromSaved={continueFromSaved}
        startFresh={startFresh}
        saveNow={saveNow}
        resetForm={resetForm}
      />

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
              onClick={currentStage === totalStages ? handleSubmit : goToNextStage}
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

