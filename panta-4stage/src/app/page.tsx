"use client";

import { useState, useEffect } from "react";
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
import { ValidationErrorBanner } from "@/components/ui/ValidationErrorBanner";

// ===========================
// MAIN COMPONENT
// ===========================
export default function SmartIntake() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const {
    form,
    currentStage,
    totalStages,
    hasRestoredState,
    isKnockedOut,
    canProceed,
    getStageErrors,
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

  // Remove field-error class when fields become valid
  useEffect(() => {
    // Remove field-error class from any fields that are now valid
    const errorFields = document.querySelectorAll('.field-error');
    errorFields.forEach((field) => {
      const fieldType = field.getAttribute('data-field-type');
      const fieldName = field.getAttribute('data-field-name');

      if (fieldType && fieldName) {
        // Check if field is now valid
        const value = form.watch(`${fieldType}.${fieldName}` as any);
        const isValid = value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);

        if (isValid) {
          field.classList.remove('field-error');
        }
      }
    });
  }, [form.watch(), form]);

  // Handle Continue button click with validation error display
  const handleContinueClick = () => {
    if (currentStage === totalStages) {
      // Last stage - submit
      if (canProceed()) {
        setShowValidationErrors(false);
        handleSubmit();
      } else {
        setShowValidationErrors(true);
        scrollToFirstError();
      }
    } else {
      // Navigate to next stage
      if (goToNextStage()) {
        setShowValidationErrors(false);
      } else {
        setShowValidationErrors(true);
        scrollToFirstError();
      }
    }
  };

  // Scroll to first invalid field and highlight it
  const scrollToFirstError = () => {
    // Wait for next tick to ensure error banner is rendered
    setTimeout(() => {
      // Remove any existing field-error classes
      document.querySelectorAll('.field-error').forEach(el => {
        el.classList.remove('field-error');
      });

      // Find first invalid field based on current stage
      let firstInvalidField: Element | null = null;

      if (currentStage === 1) {
        // Stage 1: Knockout - find first unanswered knockout question
        const knockoutInputs = document.querySelectorAll('[data-field-type="knockout"]');
        for (const input of knockoutInputs) {
          const fieldName = input.getAttribute('data-field-name');
          if (fieldName) {
            const value = form.watch(`knockout.${fieldName}` as any);
            if (value === null) {
              firstInvalidField = input;
              break;
            }
          }
        }
      } else if (currentStage === 2) {
        // Stage 2: Risk Profile - find first unanswered risk profile field
        const riskInputs = document.querySelectorAll('[data-field-type="riskProfile"]');
        for (const input of riskInputs) {
          const fieldName = input.getAttribute('data-field-name');
          if (fieldName) {
            const value = form.watch(`riskProfile.${fieldName}` as any);
            if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
              firstInvalidField = input;
              break;
            }
          }
        }
      } else if (currentStage === 3) {
        // Stage 3: Business Details - find first invalid business field
        const businessInputs = document.querySelectorAll('[data-field-type="business"]');
        for (const input of businessInputs) {
          const fieldName = input.getAttribute('data-field-name');
          if (fieldName && input.hasAttribute('required')) {
            const value = form.watch(`business.${fieldName}` as any);
            if (!value || value === '' || (typeof value === 'number' && value === 0)) {
              firstInvalidField = input;
              break;
            }
          }
        }
      } else if (currentStage === 4) {
        // Stage 4: Documents - find first missing document upload zone
        const docZones = document.querySelectorAll('[data-doc-required="true"]');
        for (const zone of docZones) {
          const uploaded = zone.querySelector('.uploaded-file');
          if (!uploaded) {
            firstInvalidField = zone;
            break;
          }
        }
      }

      // If we found an invalid field, scroll to it and add error class
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.classList.add('field-error');
      } else {
        // Fall back to error banner if no specific field found
        const errorBanner = document.querySelector('.validation-error-banner');
        if (errorBanner) {
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
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

        {/* Validation Error Banner */}
        {!isKnockedOut && showValidationErrors && (
          <ValidationErrorBanner
            errors={getStageErrors()}
            show={true}
          />
        )}

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
              onClick={handleContinueClick}
            >
              {currentStage === totalStages ? "Submit Application" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

