"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, EntityType } from "@/types/intake";
import { useState } from "react";

interface BusinessInfoSectionProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 3.1: Business Information Section
 *
 * Collapsible section for business details including legal name, address, FEIN,
 * entity type, DOT/MC numbers, revenue, employees, and garaging address.
 *
 * Based on US-007 acceptance criteria.
 */
export function BusinessInfoSection({ form }: BusinessInfoSectionProps) {
  const { watch, setValue } = form;
  const [isOpen, setIsOpen] = useState(true);

  // Watch business fields
  const legalName = watch("business.legalName");
  const dba = watch("business.dba");
  const phone = watch("business.phone");
  const fein = watch("business.fein");
  const entityType = watch("business.entityType");
  const website = watch("business.website");
  const dateStarted = watch("business.dateStarted");
  const dotNumber = watch("business.dotNumber");
  const mcNumber = watch("business.mcNumber");
  const annualRevenue = watch("business.annualRevenue");
  const fullTimeEmployees = watch("business.fullTimeEmployees");
  const partTimeEmployees = watch("business.partTimeEmployees");
  const garagingAddressDifferent = watch("business.garagingAddressDifferent");

  // Watch mailing address
  const mailingStreet = watch("business.mailingAddress.street");
  const mailingCity = watch("business.mailingAddress.city");
  const mailingState = watch("business.mailingAddress.state");
  const mailingZip = watch("business.mailingAddress.zip");

  // Watch garaging address
  const garagingStreet = watch("business.garagingAddress.street");
  const garagingCity = watch("business.garagingAddress.city");
  const garagingState = watch("business.garagingAddress.state");
  const garagingZip = watch("business.garagingAddress.zip");

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Format FEIN as XX-XXXXXXX
  const formatFEIN = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 9)}`;
  };

  // Format MC number as MC-XXXXXX
  const formatMC = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    return `MC-${cleaned.slice(0, 6)}`;
  };

  // Format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return "";
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  };

  const entityTypeOptions: { value: EntityType; label: string }[] = [
    { value: "llc", label: "LLC" },
    { value: "corporation", label: "Corporation" },
    { value: "individual", label: "Sole Proprietor" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" },
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Section Header (Collapsible) */}
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
          Business Information
        </h3>
        <span style={{ fontSize: "1.5rem", color: "var(--color-text-muted)" }}>{isOpen ? "−" : "+"}</span>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div
          style={{
            padding: "1.5rem",
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Legal Business Name */}
          <div className="form-group">
            <label className="form-label">
              Legal Business Name <span className="field-required">*</span>
            </label>
            <span className="form-sublabel">As it appears on your tax documents</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., ABC Trucking LLC"
              value={legalName || ""}
              onChange={(e) => setValue("business.legalName", e.target.value, { shouldValidate: true })}
              data-field-type="business"
              data-field-name="legalName"
              required
            />
          </div>

          {/* DBA (Optional) */}
          <div className="form-group">
            <label className="form-label">DBA (Doing Business As)</label>
            <span className="form-sublabel">If your business operates under a different name</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., ABC Express"
              value={dba || ""}
              onChange={(e) => setValue("business.dba", e.target.value, { shouldValidate: true })}
            />
          </div>

          {/* Business Mailing Address */}
          <div className="form-group">
            <label className="form-label">
              Business Mailing Address <span className="field-required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Street address"
              value={mailingStreet || ""}
              onChange={(e) => setValue("business.mailingAddress.street", e.target.value, { shouldValidate: true })}
              style={{ marginBottom: "0.5rem" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="City"
                value={mailingCity || ""}
                onChange={(e) => setValue("business.mailingAddress.city", e.target.value, { shouldValidate: true })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="State"
                maxLength={2}
                value={mailingState || ""}
                onChange={(e) => setValue("business.mailingAddress.state", e.target.value.toUpperCase(), { shouldValidate: true })}
              />
              <input
                type="text"
                className="form-input"
                placeholder="ZIP"
                maxLength={10}
                value={mailingZip || ""}
                onChange={(e) => setValue("business.mailingAddress.zip", e.target.value, { shouldValidate: true })}
              />
            </div>
          </div>

          {/* Business Phone */}
          <div className="form-group">
            <label className="form-label">
              Business Phone <span className="field-required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              placeholder="(555) 123-4567"
              value={phone || ""}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setValue("business.phone", formatted, { shouldValidate: true });
              }}
              maxLength={14}
            />
          </div>

          {/* FEIN */}
          <div className="form-group">
            <label className="form-label">
              Federal Employer ID Number (FEIN) <span className="field-required">*</span>
            </label>
            <span className="form-sublabel">Format: XX-XXXXXXX</span>
            <input
              type="text"
              className="form-input"
              placeholder="12-3456789"
              value={fein || ""}
              onChange={(e) => {
                const formatted = formatFEIN(e.target.value);
                setValue("business.fein", formatted, { shouldValidate: true });
              }}
              maxLength={10}
            />
          </div>

          {/* Entity Type */}
          <div className="form-group">
            <label className="form-label">
              Business Entity Type <span className="field-required">*</span>
            </label>
            <div className="options-grid">
              {entityTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`option-card ${entityType === option.value ? "selected" : ""}`}
                  onClick={() => setValue("business.entityType", option.value, { shouldValidate: true })}
                >
                  <input type="radio" checked={entityType === option.value} readOnly />
                  <div className="option-title">{option.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Website (Optional) */}
          <div className="form-group">
            <label className="form-label">Website</label>
            <span className="form-sublabel">Optional</span>
            <input
              type="url"
              className="form-input"
              placeholder="https://www.example.com"
              value={website || ""}
              onChange={(e) => setValue("business.website", e.target.value, { shouldValidate: true })}
            />
          </div>

          {/* Date Business Started */}
          <div className="form-group">
            <label className="form-label">
              Date Business Started <span className="field-required">*</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={dateStarted || ""}
              onChange={(e) => setValue("business.dateStarted", e.target.value, { shouldValidate: true })}
            />
          </div>

          {/* USDOT Number */}
          <div className="form-group">
            <label className="form-label">
              USDOT Number <span className="field-required">*</span>
            </label>
            <span className="form-sublabel">7-digit number assigned by FMCSA</span>
            <input
              type="text"
              className="form-input"
              placeholder="1234567"
              maxLength={7}
              value={dotNumber || ""}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "");
                setValue("business.dotNumber", cleaned, { shouldValidate: true });
              }}
            />
          </div>

          {/* MC Number (Optional) */}
          <div className="form-group">
            <label className="form-label">MC Number</label>
            <span className="form-sublabel">Optional - Motor Carrier authority number</span>
            <input
              type="text"
              className="form-input"
              placeholder="MC-123456"
              value={mcNumber || ""}
              onChange={(e) => {
                const formatted = formatMC(e.target.value);
                setValue("business.mcNumber", formatted, { shouldValidate: true });
              }}
              maxLength={9}
            />
          </div>

          {/* Annual Gross Revenue */}
          <div className="form-group">
            <label className="form-label">
              Annual Gross Revenue <span className="field-required">*</span>
            </label>
            <span className="form-sublabel">Your business&apos;s total annual income</span>
            <input
              type="text"
              className="form-input"
              placeholder="$500,000"
              value={annualRevenue !== null ? formatCurrency(annualRevenue) : ""}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "");
                setValue("business.annualRevenue", cleaned ? parseInt(cleaned) : null, { shouldValidate: true });
              }}
            />
          </div>

          {/* Employee Counts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">
                Full-Time Employees <span className="field-required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={fullTimeEmployees || ""}
                onChange={(e) =>
                  setValue("business.fullTimeEmployees", e.target.value ? parseInt(e.target.value) : null, {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Part-Time Employees <span className="field-required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={partTimeEmployees || ""}
                onChange={(e) =>
                  setValue("business.partTimeEmployees", e.target.value ? parseInt(e.target.value) : null, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>

          {/* Garaging Address Toggle */}
          <div className="form-group">
            <label className="form-label">Where are your vehicles parked overnight?</label>
            <div className="yes-no-grid">
              <button
                type="button"
                className={`yes-no-btn ${garagingAddressDifferent === false ? "selected-no" : ""}`}
                onClick={() => setValue("business.garagingAddressDifferent", false, { shouldValidate: true })}
              >
                Same as business address
              </button>
              <button
                type="button"
                className={`yes-no-btn ${garagingAddressDifferent === true ? "selected-yes" : ""}`}
                onClick={() => setValue("business.garagingAddressDifferent", true, { shouldValidate: true })}
              >
                Different address
              </button>
            </div>
          </div>

          {/* Garaging Address (Conditional) */}
          {garagingAddressDifferent === true && (
            <div className="form-group">
              <label className="form-label">
                Garaging Address <span className="field-required">*</span>
              </label>
              <span className="form-sublabel">Where vehicles are parked overnight</span>
              <input
                type="text"
                className="form-input"
                placeholder="Street address"
                value={garagingStreet || ""}
                onChange={(e) =>
                  setValue("business.garagingAddress.street", e.target.value, { shouldValidate: true })
                }
                style={{ marginBottom: "0.5rem" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="City"
                  value={garagingCity || ""}
                  onChange={(e) =>
                    setValue("business.garagingAddress.city", e.target.value, { shouldValidate: true })
                  }
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="State"
                  maxLength={2}
                  value={garagingState || ""}
                  onChange={(e) =>
                    setValue("business.garagingAddress.state", e.target.value.toUpperCase(), {
                      shouldValidate: true,
                    })
                  }
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="ZIP"
                  maxLength={10}
                  value={garagingZip || ""}
                  onChange={(e) =>
                    setValue("business.garagingAddress.zip", e.target.value, { shouldValidate: true })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
