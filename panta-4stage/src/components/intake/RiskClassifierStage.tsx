"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, HazmatType, CargoType } from "@/types/intake";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface RiskClassifierStageProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 2: Risk Classifier Questions
 *
 * Displays 8 risk classifier questions with multiple-choice buttons.
 * Determines if this is a Standard or E&S market submission.
 * Tracks E&S market flags for underwriting decisions.
 *
 * Based on US-006 acceptance criteria.
 */
export function RiskClassifierStage({ form }: RiskClassifierStageProps) {
  const { watch, setValue } = form;

  // Watch all risk profile fields
  const hazmat = watch("riskProfile.hazmat");
  const hazmatTypes = watch("riskProfile.hazmatTypes") || [];
  const radius = watch("riskProfile.radius");
  const fleetSize = watch("riskProfile.fleetSize");
  const cargoTypes = watch("riskProfile.cargoTypes") || [];
  const leasesOnToCarrier = watch("riskProfile.leasesOnToCarrier");
  const motorCarrierLeasedTo = watch("riskProfile.motorCarrierLeasedTo");
  const refrigeratedCargo = watch("riskProfile.refrigeratedCargo");
  const reeferBreakdownCoverage = watch("riskProfile.reeferBreakdownCoverage");
  const trailerInterchange = watch("riskProfile.trailerInterchange");
  const trailerInterchangeCount = watch("riskProfile.trailerInterchangeCount");
  const trailerInterchangeZones = watch("riskProfile.trailerInterchangeZones");
  const trailerInterchangeRadius = watch("riskProfile.trailerInterchangeRadius");
  const newVenture = watch("riskProfile.newVenture");
  const accidentsLast3Years = watch("riskProfile.accidentsLast3Years");

  // Helper to toggle hazmat types
  const toggleHazmatType = (type: HazmatType) => {
    const current = hazmatTypes || [];
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("riskProfile.hazmatTypes", newTypes, { shouldValidate: true });
  };

  // Helper to toggle cargo types
  const toggleCargoType = (type: CargoType) => {
    const current = cargoTypes || [];
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue("riskProfile.cargoTypes", newTypes, { shouldValidate: true });
  };

  // Check for E&S market flags
  const isLongHaul = radius === "long_haul";
  const showFleetDiscount = fleetSize !== null && fleetSize > 10;
  const isNewVenture = newVenture === true;
  const hasMultipleAccidents = accidentsLast3Years !== null && accidentsLast3Years > 2;

  return (
    <>
      <div className="card-header">
        <h2>📋 Tell Us About Your Operations</h2>
        <p>This helps us find the right coverage for your business.</p>
      </div>

      {/* Question 1: Hazmat */}
      <div className="form-group">
        <div className="question-counter">Question 1 of 8</div>
        <label className="form-label">Do you haul hazardous materials (HAZMAT)?</label>
        <span className="form-sublabel">
          This includes anything requiring a placard or special DOT endorsement.
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${hazmat === true ? "selected-yes" : ""}`}
            onClick={() => setValue("riskProfile.hazmat", true, { shouldValidate: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${hazmat === false ? "selected-no" : ""}`}
            onClick={() => setValue("riskProfile.hazmat", false, { shouldValidate: true })}
          >
            No
          </button>
        </div>

        {/* Confirmation message when hazmat = false */}
        {hazmat === false && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(34, 197, 94, 0.1)", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
              ✅ Got it - we&apos;ll skip the hazmat questions.
            </span>
          </div>
        )}

        {/* Conditional: Hazmat Types */}
        {hazmat === true && (
          <div style={{ marginTop: "1rem" }}>
            <label className="form-label">What types of hazardous materials?</label>
            <span className="form-sublabel">Select all that apply</span>
            <div className="options-grid">
              {[
                { value: "flammables" as HazmatType, label: "Flammables" },
                { value: "corrosives" as HazmatType, label: "Corrosives" },
                { value: "explosives" as HazmatType, label: "Explosives" },
                { value: "radioactive" as HazmatType, label: "Radioactive" },
                { value: "other" as HazmatType, label: "Other" },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`option-card ${hazmatTypes.includes(option.value) ? "selected" : ""}`}
                  onClick={() => toggleHazmatType(option.value)}
                >
                  <input type="checkbox" checked={hazmatTypes.includes(option.value)} readOnly />
                  <div className="option-title">{option.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question 2: Farthest Travel Distance */}
      <div className="form-group">
        <div className="question-counter">Question 2 of 8</div>
        <label className="form-label">Where do your trucks typically go?</label>
        <span className="form-sublabel">Think about your farthest regular route</span>
        <div className="options-grid">
          {[
            { value: "local", label: "Around town", desc: "Under 50 miles" },
            { value: "regional", label: "Nearby states", desc: "50-200 miles" },
            { value: "long_regional", label: "Multi-state", desc: "200-500 miles" },
            { value: "long_haul", label: "Cross-country", desc: "Over 500 miles" },
          ].map((option) => (
            <div
              key={option.value}
              className={`option-card ${radius === option.value ? "selected" : ""}`}
              onClick={() => setValue("riskProfile.radius", option.value as any, { shouldValidate: true })}
            >
              <input type="radio" checked={radius === option.value} readOnly />
              <div className="option-title">{option.label}</div>
              <div className="option-desc">{option.desc}</div>
            </div>
          ))}
        </div>
        {isLongHaul && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(34, 197, 94, 0.1)", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
              ℹ️ Long haul operations may require specialized coverage.
            </span>
          </div>
        )}
      </div>

      {/* Question 3: Fleet Size */}
      <div className="form-group">
        <div className="question-counter">Question 3 of 8</div>
        <label className="form-label">How many trucks/tractors do you have in total?</label>
        <span className="form-sublabel">Include owned and leased power units</span>
        <input
          type="number"
          className="form-input"
          min="1"
          max="999"
          placeholder="e.g., 5"
          value={fleetSize || ""}
          onChange={(e) =>
            setValue("riskProfile.fleetSize", e.target.value ? parseInt(e.target.value) : null, {
              shouldValidate: true,
            })
          }
        />
        {showFleetDiscount && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(34, 197, 94, 0.1)", borderRadius: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
              ✅ You may be eligible for a fleet discount!
            </span>
          </div>
        )}
      </div>

      {/* Question 4: Cargo Types */}
      <div className="form-group">
        <div className="question-counter">Question 4 of 8</div>
        <label className="form-label">What types of cargo do you haul?</label>
        <span className="form-sublabel">Select all that apply</span>
        <div className="options-grid">
          {[
            { value: "general_freight" as CargoType, label: "General Freight" },
            { value: "refrigerated" as CargoType, label: "Refrigerated" },
            { value: "dry_van" as CargoType, label: "Dry Van" },
            { value: "flatbed" as CargoType, label: "Flatbed" },
            { value: "tanker" as CargoType, label: "Tanker" },
            { value: "auto_hauler" as CargoType, label: "Auto Hauler" },
            { value: "household_goods" as CargoType, label: "Household Goods" },
            { value: "intermodal" as CargoType, label: "Intermodal" },
            { value: "oversized" as CargoType, label: "Oversized" },
            { value: "other" as CargoType, label: "Other" },
          ].map((option) => (
            <div
              key={option.value}
              className={`option-card ${cargoTypes.includes(option.value) ? "selected" : ""}`}
              onClick={() => toggleCargoType(option.value)}
            >
              <input type="checkbox" checked={cargoTypes.includes(option.value)} readOnly />
              <div className="option-title">{option.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Question 5: Lease On */}
      <div className="form-group">
        <div className="question-counter">Question 5 of 8</div>
        <label className="form-label">Do you lease on to another motor carrier?</label>
        <span className="form-sublabel">
          This means you operate under someone else&apos;s authority
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${leasesOnToCarrier === true ? "selected-yes" : ""}`}
            onClick={() => setValue("riskProfile.leasesOnToCarrier", true, { shouldValidate: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${leasesOnToCarrier === false ? "selected-no" : ""}`}
            onClick={() => setValue("riskProfile.leasesOnToCarrier", false, { shouldValidate: true })}
          >
            No
          </button>
        </div>

        {/* Conditional: Motor Carrier Leased To */}
        {leasesOnToCarrier === true && (
          <div style={{ marginTop: "1rem" }}>
            <label className="form-label">Motor carrier you lease to</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., ABC Trucking LLC"
              value={motorCarrierLeasedTo || ""}
              onChange={(e) =>
                setValue("riskProfile.motorCarrierLeasedTo", e.target.value, { shouldValidate: true })
              }
            />
          </div>
        )}
      </div>

      {/* Question 6: Refrigerated Cargo */}
      <div className="form-group">
        <div className="question-counter">Question 6 of 8</div>
        <label className="form-label">Do you haul refrigerated cargo?</label>
        <span className="form-sublabel">Temperature-controlled reefer trailers</span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${refrigeratedCargo === true ? "selected-yes" : ""}`}
            onClick={() => setValue("riskProfile.refrigeratedCargo", true, { shouldValidate: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${refrigeratedCargo === false ? "selected-no" : ""}`}
            onClick={() => setValue("riskProfile.refrigeratedCargo", false, { shouldValidate: true })}
          >
            No
          </button>
        </div>

        {/* Conditional: Reefer Breakdown Coverage */}
        {refrigeratedCargo === true && (
          <div style={{ marginTop: "1rem" }}>
            <label className="form-label">Do you want reefer breakdown coverage?</label>
            <span className="form-sublabel">
              Covers spoilage if your reefer unit fails during transport
            </span>
            <div className="yes-no-grid">
              <button
                type="button"
                className={`yes-no-btn ${reeferBreakdownCoverage === true ? "selected-yes" : ""}`}
                onClick={() =>
                  setValue("riskProfile.reeferBreakdownCoverage", true, { shouldValidate: true })
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={`yes-no-btn ${reeferBreakdownCoverage === false ? "selected-no" : ""}`}
                onClick={() =>
                  setValue("riskProfile.reeferBreakdownCoverage", false, { shouldValidate: true })
                }
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Question 7: Trailer Interchange */}
      <div className="form-group">
        <div className="question-counter">Question 7 of 8</div>
        <label className="form-label">
          Do you use trailer interchange?
          <InfoTooltip content="Swapping trailers with other carriers at rail yards." />
        </label>
        <span className="form-sublabel">
          Swapping trailers with other carriers (requires special coverage)
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${trailerInterchange === true ? "selected-yes" : ""}`}
            onClick={() => setValue("riskProfile.trailerInterchange", true, { shouldValidate: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${trailerInterchange === false ? "selected-no" : ""}`}
            onClick={() => setValue("riskProfile.trailerInterchange", false, { shouldValidate: true })}
          >
            No
          </button>
        </div>

        {/* Conditional: Trailer Interchange Details */}
        {trailerInterchange === true && (
          <div style={{ marginTop: "1rem" }}>
            <div className="form-group">
              <label className="form-label">How many trailers in interchange?</label>
              <input
                type="number"
                className="form-input"
                min="1"
                placeholder="e.g., 10"
                value={trailerInterchangeCount || ""}
                onChange={(e) =>
                  setValue("riskProfile.trailerInterchangeCount", e.target.value ? parseInt(e.target.value) : undefined, {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interchange zones/regions</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Midwest, Southeast"
                value={trailerInterchangeZones || ""}
                onChange={(e) =>
                  setValue("riskProfile.trailerInterchangeZones", e.target.value, { shouldValidate: true })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interchange radius (miles)</label>
              <input
                type="number"
                className="form-input"
                min="1"
                placeholder="e.g., 500"
                value={trailerInterchangeRadius || ""}
                onChange={(e) =>
                  setValue("riskProfile.trailerInterchangeRadius", e.target.value ? parseInt(e.target.value) : undefined, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Question 8: New Venture & Accidents */}
      <div className="form-group">
        <div className="question-counter">Question 8 of 8</div>
        <label className="form-label">Is this a new venture (less than 3 years in business)?</label>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${newVenture === true ? "selected-yes" : ""}`}
            onClick={() => setValue("riskProfile.newVenture", true, { shouldValidate: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${newVenture === false ? "selected-no" : ""}`}
            onClick={() => setValue("riskProfile.newVenture", false, { shouldValidate: true })}
          >
            No
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">How many accidents have you had in the last 3 years?</label>
        <span className="form-sublabel">Include all preventable and non-preventable accidents</span>
        <input
          type="number"
          className="form-input"
          min="0"
          max="99"
          placeholder="e.g., 0"
          value={accidentsLast3Years || ""}
          onChange={(e) =>
            setValue("riskProfile.accidentsLast3Years", e.target.value ? parseInt(e.target.value) : null, {
              shouldValidate: true,
            })
          }
        />
      </div>

      {/* E&S Market Warning */}
      {(isNewVenture || hasMultipleAccidents) && (
        <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(239, 68, 68, 0.1)", border: "2px solid var(--color-danger)", borderRadius: "12px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--color-danger)" }}>
            ⚠️ E&amp;S Market Placement
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            Based on your answers, this may be placed in the Excess &amp; Surplus (E&amp;S) market.
            {isNewVenture && " New ventures require specialized coverage."}
            {hasMultipleAccidents && " Multiple accidents require enhanced underwriting."}
          </p>
        </div>
      )}
    </>
  );
}
