"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData } from "@/types/intake";

interface KnockoutStageProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 1: Knockout Questions
 *
 * Displays 6 knockout questions one at a time with Yes/No toggle buttons.
 * If user answers Yes to any question, shows decline message.
 * Uses plain English without insurance jargon.
 *
 * Based on US-005 acceptance criteria.
 */
export function KnockoutStage({ form }: KnockoutStageProps) {
  const { watch, setValue } = form;

  // Watch all knockout fields
  const authorityRevoked = watch("knockout.authorityRevoked");
  const safetyRatingUnsatisfactory = watch("knockout.safetyRatingUnsatisfactory");
  const driverLicenseRevoked = watch("knockout.driverLicenseRevoked");
  const fraudConviction = watch("knockout.fraudConviction");
  const bankruptcyFiled = watch("knockout.bankruptcyFiled");
  const insuranceCancelledNonPayment = watch("knockout.insuranceCancelledNonPayment");

  // Check if any knockout condition is true
  const isKnockedOut =
    authorityRevoked === true ||
    safetyRatingUnsatisfactory === true ||
    driverLicenseRevoked === true ||
    fraudConviction === true ||
    bankruptcyFiled === true ||
    insuranceCancelledNonPayment === true;

  // Knockout questions in plain English
  const questions = [
    {
      field: "authorityRevoked" as const,
      label: "Has your operating authority (DOT/MC) ever been revoked or suspended?",
      sublabel: "This means the government shut you down and you couldn't legally operate.",
      value: authorityRevoked,
    },
    {
      field: "safetyRatingUnsatisfactory" as const,
      label: "Is your current DOT Safety Rating 'Unsatisfactory'?",
      sublabel: "Check your FMCSA profile if you're not sure. Most carriers have 'Satisfactory' or no rating.",
      value: safetyRatingUnsatisfactory,
    },
    {
      field: "driverLicenseRevoked" as const,
      label: "Has any of your drivers had their license revoked or suspended in the last 5 years?",
      sublabel: "We're asking about permanent revocation, not temporary suspension for points.",
      value: driverLicenseRevoked,
    },
    {
      field: "fraudConviction" as const,
      label: "Has your business or any owner been convicted of insurance fraud?",
      sublabel: "This includes any criminal charges related to false claims or misrepresentation.",
      value: fraudConviction,
    },
    {
      field: "bankruptcyFiled" as const,
      label: "Has your business filed for bankruptcy in the last 5 years?",
      sublabel: "Chapter 7, 11, or 13 bankruptcy filings.",
      value: bankruptcyFiled,
    },
    {
      field: "insuranceCancelledNonPayment" as const,
      label: "Has your insurance been cancelled for non-payment in the last 3 years?",
      sublabel: "Non-renewal is different from cancellation - we're asking about cancellation.",
      value: insuranceCancelledNonPayment,
    },
  ];

  const handleYesNoClick = (field: keyof SmartIntakeData["knockout"], value: boolean) => {
    setValue(`knockout.${field}`, value, { shouldValidate: true });
  };

  return (
    <>
      <div className="card-header">
        <h2>🔍 Quick Check</h2>
        <p>Let&apos;s make sure we can help you before going further.</p>
      </div>

      {/* Show decline message if knocked out */}
      {isKnockedOut && (
        <div className="knockout-alert">
          <h3>⚠️ We Cannot Provide an Online Quote</h3>
          <p>
            Based on your answers, we cannot provide an online quote at this time.
            However, we may still be able to help you. Please call us at{" "}
            <strong style={{ color: "var(--color-primary)" }}>(555) 123-4567</strong> to discuss your options.
          </p>
        </div>
      )}

      {/* Render all questions (even if knocked out, so user can change answers) */}
      {questions.map((question, index) => (
        <div key={question.field} className="form-group" style={{ marginTop: index > 0 ? "2rem" : 0 }}>
          <label className="form-label">{question.label}</label>
          <span className="form-sublabel">{question.sublabel}</span>
          <div className="yes-no-grid">
            <button
              type="button"
              className={`yes-no-btn ${question.value === true ? "selected-yes" : ""}`}
              onClick={() => handleYesNoClick(question.field, true)}
              suppressHydrationWarning
            >
              ❌ Yes
            </button>
            <button
              type="button"
              className={`yes-no-btn ${question.value === false ? "selected-no" : ""}`}
              onClick={() => handleYesNoClick(question.field, false)}
              suppressHydrationWarning
            >
              ✅ No
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
