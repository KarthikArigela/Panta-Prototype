"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, LiabilityLimit, DeductibleAmount } from "@/types/intake";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface CoveragePreferencesSectionProps {
  form: UseFormReturn<SmartIntakeData>;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * Stage 3.6: Coverage Preferences Section
 *
 * Collapsible section for coverage limits and options including liability limit,
 * comprehensive deductible, collision deductible, hired auto, and non-owned auto coverage.
 *
 * Based on US-012 acceptance criteria.
 */
export function CoveragePreferencesSection({ form, isExpanded = true, onToggle }: CoveragePreferencesSectionProps) {
  const { watch, setValue } = form;

  // Watch coverage preference fields
  const liabilityLimit = watch("coveragePreferences.liabilityLimit");
  const liabilityLimitOther = watch("coveragePreferences.liabilityLimitOther");
  const comprehensiveDeductible = watch("coveragePreferences.comprehensiveDeductible");
  const comprehensiveDeductibleOther = watch("coveragePreferences.comprehensiveDeductibleOther");
  const collisionDeductible = watch("coveragePreferences.collisionDeductible");
  const collisionDeductibleOther = watch("coveragePreferences.collisionDeductibleOther");
  const hiredAutoCoverage = watch("coveragePreferences.hiredAutoCoverage");
  const nonOwnedAutoCoverage = watch("coveragePreferences.nonOwnedAutoCoverage");

  // Format currency
  const formatCurrency = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    const num = parseInt(cleaned, 10);
    return num.toLocaleString("en-US");
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        onClick={onToggle}
        style={{
          padding: "1rem 1.5rem",
          background: "var(--color-surface)",
          border: "2px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isExpanded ? "1rem" : 0,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--color-text)" }}>
          Coverage Preferences
        </h3>
        <span style={{ fontSize: "1.5rem", color: "var(--color-text-muted)" }}>{isExpanded ? "−" : "+"}</span>
      </div>

      {isExpanded && (
        <div
          style={{
            padding: "2rem",
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Liability Limit */}
          <div className="form-group">
            <label className="form-label">
              Liability Limit <span style={{ color: "var(--color-danger)" }}>*</span>
              <InfoTooltip content="The maximum amount your insurance will pay for damages you cause to others." />
            </label>
            <p className="form-sublabel">
              Combined Single Limit (CSL) - Covers bodily injury and property damage
            </p>
            <div className="options-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              <button
                type="button"
                className={liabilityLimit === "1000000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.liabilityLimit", "1000000");
                  setValue("coveragePreferences.liabilityLimitOther", undefined);
                }}
              >
                <strong>$1M CSL</strong>
              </button>
              <button
                type="button"
                className={liabilityLimit === "750000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.liabilityLimit", "750000");
                  setValue("coveragePreferences.liabilityLimitOther", undefined);
                }}
              >
                <strong>$750K</strong>
              </button>
              <button
                type="button"
                className={liabilityLimit === "500000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.liabilityLimit", "500000");
                  setValue("coveragePreferences.liabilityLimitOther", undefined);
                }}
              >
                <strong>$500K</strong>
              </button>
              <button
                type="button"
                className={liabilityLimit === "other" ? "option-card active" : "option-card"}
                onClick={() => setValue("coveragePreferences.liabilityLimit", "other")}
              >
                <strong>Other</strong>
              </button>
            </div>
            {liabilityLimit === "other" && (
              <div style={{ marginTop: "1rem" }}>
                <label className="form-label">Custom Liability Limit</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>$</span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "28px" }}
                    placeholder="Enter custom limit"
                    value={liabilityLimitOther ? formatCurrency(String(liabilityLimitOther)) : ""}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setValue("coveragePreferences.liabilityLimitOther", cleaned ? parseInt(cleaned, 10) : undefined);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Comprehensive Deductible */}
          <div className="form-group">
            <label className="form-label">
              Comprehensive Deductible <span style={{ color: "var(--color-danger)" }}>*</span>
              <InfoTooltip content="What you pay out-of-pocket before insurance covers theft, weather damage, or vandalism." />
            </label>
            <p className="form-sublabel">
              Covers damage from theft, vandalism, weather, fire, and other non-collision events
            </p>
            <div className="options-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              <button
                type="button"
                className={comprehensiveDeductible === "1000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.comprehensiveDeductible", "1000");
                  setValue("coveragePreferences.comprehensiveDeductibleOther", undefined);
                }}
              >
                <strong>$1,000</strong>
              </button>
              <button
                type="button"
                className={comprehensiveDeductible === "2500" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.comprehensiveDeductible", "2500");
                  setValue("coveragePreferences.comprehensiveDeductibleOther", undefined);
                }}
              >
                <strong>$2,500</strong>
              </button>
              <button
                type="button"
                className={comprehensiveDeductible === "5000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.comprehensiveDeductible", "5000");
                  setValue("coveragePreferences.comprehensiveDeductibleOther", undefined);
                }}
              >
                <strong>$5,000</strong>
              </button>
              <button
                type="button"
                className={comprehensiveDeductible === "other" ? "option-card active" : "option-card"}
                onClick={() => setValue("coveragePreferences.comprehensiveDeductible", "other")}
              >
                <strong>Other</strong>
              </button>
            </div>
            {comprehensiveDeductible === "other" && (
              <div style={{ marginTop: "1rem" }}>
                <label className="form-label">Custom Comprehensive Deductible</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>$</span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "28px" }}
                    placeholder="Enter custom deductible"
                    value={comprehensiveDeductibleOther ? formatCurrency(String(comprehensiveDeductibleOther)) : ""}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setValue("coveragePreferences.comprehensiveDeductibleOther", cleaned ? parseInt(cleaned, 10) : undefined);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collision Deductible */}
          <div className="form-group">
            <label className="form-label">
              Collision Deductible <span style={{ color: "var(--color-danger)" }}>*</span>
              <InfoTooltip content="What you pay out-of-pocket before insurance covers damage from crashes." />
            </label>
            <p className="form-sublabel">
              Covers damage to your vehicle from collisions with other vehicles or objects
            </p>
            <div className="options-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
              <button
                type="button"
                className={collisionDeductible === "1000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.collisionDeductible", "1000");
                  setValue("coveragePreferences.collisionDeductibleOther", undefined);
                }}
              >
                <strong>$1,000</strong>
              </button>
              <button
                type="button"
                className={collisionDeductible === "2500" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.collisionDeductible", "2500");
                  setValue("coveragePreferences.collisionDeductibleOther", undefined);
                }}
              >
                <strong>$2,500</strong>
              </button>
              <button
                type="button"
                className={collisionDeductible === "5000" ? "option-card active" : "option-card"}
                onClick={() => {
                  setValue("coveragePreferences.collisionDeductible", "5000");
                  setValue("coveragePreferences.collisionDeductibleOther", undefined);
                }}
              >
                <strong>$5,000</strong>
              </button>
              <button
                type="button"
                className={collisionDeductible === "other" ? "option-card active" : "option-card"}
                onClick={() => setValue("coveragePreferences.collisionDeductible", "other")}
              >
                <strong>Other</strong>
              </button>
            </div>
            {collisionDeductible === "other" && (
              <div style={{ marginTop: "1rem" }}>
                <label className="form-label">Custom Collision Deductible</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>$</span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "28px" }}
                    placeholder="Enter custom deductible"
                    value={collisionDeductibleOther ? formatCurrency(String(collisionDeductibleOther)) : ""}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setValue("coveragePreferences.collisionDeductibleOther", cleaned ? parseInt(cleaned, 10) : undefined);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hired Auto Coverage */}
          <div className="form-group">
            <label className="form-label">
              Hired Auto Coverage
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.875rem",
                  color: "#666",
                  cursor: "help",
                }}
                title="Coverage for vehicles you rent or lease short-term (e.g., rental trucks)"
              >
                ⓘ
              </span>
            </label>
            <p className="form-sublabel">
              Covers vehicles you rent or lease short-term (e.g., rental trucks)
            </p>
            <div className="yes-no-grid">
              <button
                type="button"
                className={hiredAutoCoverage === true ? "yes-no-btn yes" : "yes-no-btn"}
                onClick={() => setValue("coveragePreferences.hiredAutoCoverage", true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={hiredAutoCoverage === false ? "yes-no-btn no" : "yes-no-btn"}
                onClick={() => setValue("coveragePreferences.hiredAutoCoverage", false)}
              >
                No
              </button>
            </div>
          </div>

          {/* Non-Owned Auto Coverage */}
          <div className="form-group">
            <label className="form-label">
              Non-Owned Auto Coverage
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.875rem",
                  color: "#666",
                  cursor: "help",
                }}
                title="Coverage for vehicles your employees use for business but that you don't own"
              >
                ⓘ
              </span>
            </label>
            <p className="form-sublabel">
              Covers vehicles your employees use for business but that you don&apos;t own (e.g., employee&apos;s personal vehicle)
            </p>
            <div className="yes-no-grid">
              <button
                type="button"
                className={nonOwnedAutoCoverage === true ? "yes-no-btn yes" : "yes-no-btn"}
                onClick={() => setValue("coveragePreferences.nonOwnedAutoCoverage", true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={nonOwnedAutoCoverage === false ? "yes-no-btn no" : "yes-no-btn"}
                onClick={() => setValue("coveragePreferences.nonOwnedAutoCoverage", false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
