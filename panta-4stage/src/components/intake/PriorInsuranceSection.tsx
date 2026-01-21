"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, ClaimType, Claim } from "@/types/intake";
import { useState } from "react";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface PriorInsuranceSectionProps {
  form: UseFormReturn<SmartIntakeData>;
}

const CLAIM_TYPES: ClaimType[] = [
  "collision",
  "cargo_damage",
  "bodily_injury_liability",
  "property_damage_liability",
  "comprehensive",
  "other",
];

const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  collision: "Collision",
  cargo_damage: "Cargo Damage",
  bodily_injury_liability: "Bodily Injury Liability",
  property_damage_liability: "Property Damage Liability",
  comprehensive: "Comprehensive",
  other: "Other",
};

const SHOPPING_REASONS = [
  { value: "renewal_coming_up", label: "Renewal coming up" },
  { value: "want_better_rates", label: "Looking for better rates" },
  { value: "need_higher_limits", label: "Need higher coverage limits" },
  { value: "non_renewed", label: "Carrier dropped/non-renewed me" },
  { value: "cancelled", label: "Policy was cancelled" },
  { value: "other", label: "Other" },
];

const defaultClaim: Claim = {
  dateOfLoss: "",
  type: "collision",
  description: "",
  amountPaid: 0,
  amountReserved: 0,
  stillOpen: false,
};

export default function PriorInsuranceSection({
  form,
}: PriorInsuranceSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const priorInsurance = form.watch("priorInsurance");
  const lossHistory = form.watch("lossHistory");

  const formatCurrency = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return "";
    const number = parseInt(cleaned);
    return "$" + number.toLocaleString("en-US");
  };

  const updatePriorInsurance = (field: string, value: any) => {
    form.setValue("priorInsurance", {
      ...priorInsurance,
      [field]: value,
    });
  };

  const updateClaim = (index: number, field: string, value: any) => {
    const updatedClaims = [...lossHistory.claims];
    updatedClaims[index] = {
      ...updatedClaims[index],
      [field]: value,
    };
    form.setValue("lossHistory", {
      ...lossHistory,
      claims: updatedClaims,
    });
  };

  const addClaim = () => {
    form.setValue("lossHistory", {
      ...lossHistory,
      claims: [...lossHistory.claims, { ...defaultClaim }],
    });
  };

  const removeClaim = (index: number) => {
    const updatedClaims = lossHistory.claims.filter((_, i) => i !== index);
    form.setValue("lossHistory", {
      ...lossHistory,
      claims: updatedClaims,
    });
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "1rem 1.5rem",
          background: "var(--color-surface)",
          border: "2px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isOpen ? "1rem" : 0,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "var(--color-text)" }}>
          Prior Insurance &amp; Claims History
        </h3>
        <span style={{ fontSize: "1.5rem", color: "var(--color-text-muted)" }}>{isOpen ? "−" : "+"}</span>
      </div>

      {isOpen && (
        <div
          style={{
            padding: "2rem",
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Currently Insured */}
          <div className="form-group">
            <label className="form-label">
              Are you currently insured?{" "}
              <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <div className="yes-no-grid">
              <button
                type="button"
                className={`yes-no-btn ${priorInsurance.currentlyInsured === true ? "selected" : ""
                  }`}
                onClick={() => updatePriorInsurance("currentlyInsured", true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`yes-no-btn ${priorInsurance.currentlyInsured === false ? "selected" : ""
                  }`}
                onClick={() => updatePriorInsurance("currentlyInsured", false)}
              >
                No
              </button>
            </div>

            {/* Helper message when Yes selected */}
            {priorInsurance.currentlyInsured === true && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                Please provide your current insurance details below.
              </div>
            )}
          </div>

          {/* Current Insurance Details - Conditional on Yes */}
          {priorInsurance.currentlyInsured === true && (
            <div
              style={{
                marginLeft: "1.5rem",
                paddingLeft: "1.5rem",
                borderLeft: "3px solid var(--color-accent)",
              }}
            >
              {/* Carrier Name */}
              <div className="form-group">
                <label className="form-label">
                  Current Insurance Carrier{" "}
                  <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter carrier name"
                  value={priorInsurance.carrierName || ""}
                  onChange={(e) =>
                    updatePriorInsurance("carrierName", e.target.value)
                  }
                />
              </div>

              {/* Policy Number */}
              <div className="form-group">
                <label className="form-label">
                  Policy Number{" "}
                  <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter policy number"
                  value={priorInsurance.policyNumber || ""}
                  onChange={(e) =>
                    updatePriorInsurance("policyNumber", e.target.value)
                  }
                />
              </div>

              {/* Annual Premium */}
              <div className="form-group">
                <label className="form-label">
                  Annual Premium{" "}
                  <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="$0"
                  value={
                    priorInsurance.annualPremium
                      ? formatCurrency(
                        priorInsurance.annualPremium.toString()
                      )
                      : ""
                  }
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, "");
                    updatePriorInsurance(
                      "annualPremium",
                      cleaned ? parseInt(cleaned) : 0
                    );
                  }}
                />
              </div>

              {/* Effective and Expiration Dates */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Effective Date{" "}
                    <span style={{ color: "var(--color-danger)" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={priorInsurance.effectiveDate || ""}
                    onChange={(e) =>
                      updatePriorInsurance("effectiveDate", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Expiration Date{" "}
                    <span style={{ color: "var(--color-danger)" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={priorInsurance.expirationDate || ""}
                    onChange={(e) =>
                      updatePriorInsurance(
                        "expirationDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Why Shopping */}
          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <label className="form-label">
              Why are you shopping for insurance?{" "}
              <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <div className="options-grid">
              {SHOPPING_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  className={`option-card ${priorInsurance.shoppingReason === reason.value
                      ? "selected"
                      : ""
                    }`}
                  onClick={() =>
                    updatePriorInsurance("shoppingReason", reason.value)
                  }
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>

          {/* Claims in Last 5 Years */}
          <div className="form-group" style={{ marginTop: "2rem" }}>
            <label className="form-label">
              Have you had any claims in the last 5 years?{" "}
              <span style={{ color: "var(--color-danger)" }}>*</span>
            </label>
            <div className="yes-no-grid">
              <button
                type="button"
                className={`yes-no-btn ${lossHistory.hasClaims === true ? "selected" : ""
                  }`}
                onClick={() => {
                  form.setValue("lossHistory", {
                    ...lossHistory,
                    hasClaims: true,
                    claims:
                      lossHistory.claims.length === 0
                        ? [{ ...defaultClaim }]
                        : lossHistory.claims,
                  });
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className={`yes-no-btn ${lossHistory.hasClaims === false ? "selected" : ""
                  }`}
                onClick={() => {
                  form.setValue("lossHistory", {
                    hasClaims: false,
                    claims: [],
                  });
                }}
              >
                No
              </button>
            </div>
          </div>

          {/* Claims List - Conditional on Yes */}
          {lossHistory.hasClaims === true && (
            <div
              style={{
                marginLeft: "1.5rem",
                paddingLeft: "1.5rem",
                borderLeft: "3px solid var(--color-accent)",
                marginTop: "1rem",
              }}
            >
              {lossHistory.claims.map((claim, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "var(--color-primary)",
                      }}
                    >
                      Claim #{index + 1}
                    </h4>
                    {lossHistory.claims.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClaim(index)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "var(--color-danger)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Date of Loss */}
                  <div className="form-group">
                    <label className="form-label">
                      Date of Loss{" "}
                      <span style={{ color: "var(--color-danger)" }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={claim.dateOfLoss || ""}
                      onChange={(e) =>
                        updateClaim(index, "dateOfLoss", e.target.value)
                      }
                    />
                  </div>

                  {/* Claim Type */}
                  <div className="form-group">
                    <label className="form-label">
                      Type of Claim{" "}
                      <span style={{ color: "var(--color-danger)" }}>*</span>
                    </label>
                    <select
                      className="form-input"
                      value={claim.type || ""}
                      onChange={(e) =>
                        updateClaim(index, "type", e.target.value as ClaimType)
                      }
                    >
                      <option value="">Select claim type</option>
                      {CLAIM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {CLAIM_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Paid and Reserved */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        Amount Paid
                        <InfoTooltip content="The total amount your insurance company has already paid for this claim." />
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$0"
                        value={
                          claim.amountPaid
                            ? formatCurrency(claim.amountPaid.toString())
                            : ""
                        }
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, "");
                          updateClaim(
                            index,
                            "amountPaid",
                            cleaned ? parseInt(cleaned) : 0
                          );
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Amount Reserved
                        <InfoTooltip content="The amount your insurance company has set aside for future payments on this claim." />
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="$0"
                        value={
                          claim.amountReserved
                            ? formatCurrency(claim.amountReserved.toString())
                            : ""
                        }
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, "");
                          updateClaim(
                            index,
                            "amountReserved",
                            cleaned ? parseInt(cleaned) : 0
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* Still Open */}
                  <div className="form-group">
                    <label className="form-label">Is this claim still open?</label>
                    <div className="yes-no-grid">
                      <button
                        type="button"
                        className={`yes-no-btn ${claim.stillOpen === true ? "selected" : ""
                          }`}
                        onClick={() => updateClaim(index, "stillOpen", true)}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`yes-no-btn ${claim.stillOpen === false ? "selected" : ""
                          }`}
                        onClick={() => updateClaim(index, "stillOpen", false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">
                      Description{" "}
                      <span style={{ color: "var(--color-danger)" }}>*</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Describe what happened..."
                      value={claim.description || ""}
                      onChange={(e) =>
                        updateClaim(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add Claim Button */}
              <button
                type="button"
                onClick={addClaim}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  marginTop: "1rem",
                }}
              >
                + Add Another Claim
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
