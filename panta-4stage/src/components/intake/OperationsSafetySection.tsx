"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, SafetyProgramComponent, TelematicsFeature, USState } from "@/types/intake";


interface OperationsSafetySectionProps {
  form: UseFormReturn<SmartIntakeData>;
  isExpanded?: boolean;
  onToggle?: () => void;
}

/**
 * Stage 3.2: Operations & Safety Section
 *
 * Collapsible section for operations details including cargo description,
 * states of operation, safety programs, maintenance, telematics, and MVR checks.
 *
 * Based on US-008 acceptance criteria.
 */
export function OperationsSafetySection({ form, isExpanded = true, onToggle }: OperationsSafetySectionProps) {
  const { watch, setValue } = form;

  // Watch operations fields
  const cargoDescription = watch("operations.cargoDescription");
  const statesOfOperation = watch("operations.statesOfOperation");
  const hasSafetyProgram = watch("operations.hasSafetyProgram");
  const safetyProgramComponents = watch("operations.safetyProgramComponents");
  const hasMaintenanceProgram = watch("operations.hasMaintenanceProgram");
  const hasTelematics = watch("operations.hasTelematics");
  const telematicsFeatures = watch("operations.telematicsFeatures");
  const telematicsFleetPercentage = watch("operations.telematicsFleetPercentage");
  const checksMVRs = watch("operations.checksMVRs");

  // All US states
  const usStates: USState[] = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];

  // Safety program options
  const safetyProgramOptions: { value: SafetyProgramComponent; label: string }[] = [
    { value: "safety_manual", label: "Written Safety Manual" },
    { value: "safety_director", label: "Designated Safety Director" },
    { value: "monthly_meetings", label: "Monthly Safety Meetings" },
    { value: "osha_compliance", label: "OSHA Compliance Program" },
  ];

  // Telematics features options
  const telematicsOptions: { value: TelematicsFeature; label: string }[] = [
    { value: "driver_safety", label: "Driver Safety Monitoring" },
    { value: "fuel_tracking", label: "Fuel Tracking" },
    { value: "maintenance_alerts", label: "Maintenance Alerts" },
    { value: "mileage_tracking", label: "Mileage Tracking" },
    { value: "gps_tracking", label: "GPS Tracking" },
  ];

  // Toggle state selection
  const toggleState = (state: USState) => {
    const current = statesOfOperation || [];
    if (current.includes(state)) {
      setValue("operations.statesOfOperation", current.filter(s => s !== state));
    } else {
      setValue("operations.statesOfOperation", [...current, state]);
    }
  };

  // Toggle safety program component
  const toggleSafetyComponent = (component: SafetyProgramComponent) => {
    const current = safetyProgramComponents || [];
    if (current.includes(component)) {
      setValue("operations.safetyProgramComponents", current.filter(c => c !== component));
    } else {
      setValue("operations.safetyProgramComponents", [...current, component]);
    }
  };

  // Toggle telematics feature
  const toggleTelematicsFeature = (feature: TelematicsFeature) => {
    const current = telematicsFeatures || [];
    if (current.includes(feature)) {
      setValue("operations.telematicsFeatures", current.filter(f => f !== feature));
    } else {
      setValue("operations.telematicsFeatures", [...current, feature]);
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Section Header (Collapsible) */}
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
          Operations & Safety
        </h3>
        <span style={{ fontSize: "1.5rem", color: "var(--color-text-muted)" }}>
          {isExpanded ? "−" : "+"}
        </span>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div
          style={{
            padding: "2rem",
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {/* Cargo Description */}
          <div className="form-group">
            <label className="form-label">
              What do you haul? <span className="field-required">*</span>
            </label>
            <div className="form-sublabel">Describe the type of cargo or freight you transport</div>
            <textarea
              className="form-input"
              value={cargoDescription || ""}
              onChange={(e) => setValue("operations.cargoDescription", e.target.value)}
              placeholder="Example: General freight including dry goods, palletized freight, and occasional refrigerated items. No hazardous materials."
              rows={4}
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* States of Operation */}
          <div className="form-group">
            <label className="form-label">
              Which states do you operate in? <span className="field-required">*</span>
            </label>
            <div className="form-sublabel">Select all that apply</div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
              gap: "0.5rem",
              marginTop: "0.5rem"
            }}>
              {usStates.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => toggleState(state)}
                  style={{
                    padding: "0.5rem",
                    border: statesOfOperation?.includes(state)
                      ? "2px solid var(--color-accent)"
                      : "2px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    background: statesOfOperation?.includes(state)
                      ? "rgba(34, 197, 94, 0.1)"
                      : "white",
                    color: statesOfOperation?.includes(state)
                      ? "var(--color-accent)"
                      : "var(--color-text)",
                    fontWeight: statesOfOperation?.includes(state) ? 600 : 400,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    transition: "all 0.2s",
                  }}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Program */}
          <div className="form-group">
            <label className="form-label">
              Do you have a written safety program? <span className="field-required">*</span>
            </label>
            <div className="yes-no-grid">
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.hasSafetyProgram", true)}
                style={{
                  background: hasSafetyProgram === true ? "var(--color-accent)" : "white",
                  color: hasSafetyProgram === true ? "white" : "var(--color-text)",
                  border: hasSafetyProgram === true ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                  fontWeight: hasSafetyProgram === true ? 600 : 400,
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => {
                  setValue("operations.hasSafetyProgram", false);
                  setValue("operations.safetyProgramComponents", []);
                }}
                style={{
                  background: hasSafetyProgram === false ? "var(--color-danger)" : "white",
                  color: hasSafetyProgram === false ? "white" : "var(--color-text)",
                  border: hasSafetyProgram === false ? "2px solid var(--color-danger)" : "2px solid var(--color-border)",
                  fontWeight: hasSafetyProgram === false ? 600 : 400,
                }}
              >
                No
              </button>
            </div>
          </div>

          {/* Safety Program Components (Conditional) */}
          {hasSafetyProgram === true && (
            <div className="form-group" style={{ marginLeft: "1.5rem", paddingLeft: "1rem", borderLeft: "3px solid var(--color-border)" }}>
              <label className="form-label">What components does your safety program include?</label>
              <div className="form-sublabel">Select all that apply</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                {safetyProgramOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      border: safetyProgramComponents?.includes(option.value)
                        ? "2px solid var(--color-accent)"
                        : "2px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      background: safetyProgramComponents?.includes(option.value)
                        ? "rgba(34, 197, 94, 0.05)"
                        : "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={safetyProgramComponents?.includes(option.value)}
                      onChange={() => toggleSafetyComponent(option.value)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: 500 }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Program */}
          <div className="form-group">
            <label className="form-label">
              Do you have a vehicle maintenance program? <span className="field-required">*</span>
            </label>
            <div className="yes-no-grid">
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.hasMaintenanceProgram", true)}
                style={{
                  background: hasMaintenanceProgram === true ? "var(--color-accent)" : "white",
                  color: hasMaintenanceProgram === true ? "white" : "var(--color-text)",
                  border: hasMaintenanceProgram === true ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                  fontWeight: hasMaintenanceProgram === true ? 600 : 400,
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.hasMaintenanceProgram", false)}
                style={{
                  background: hasMaintenanceProgram === false ? "var(--color-danger)" : "white",
                  color: hasMaintenanceProgram === false ? "white" : "var(--color-text)",
                  border: hasMaintenanceProgram === false ? "2px solid var(--color-danger)" : "2px solid var(--color-border)",
                  fontWeight: hasMaintenanceProgram === false ? 600 : 400,
                }}
              >
                No
              </button>
            </div>
          </div>

          {/* Telematics/ELD */}
          <div className="form-group">
            <label className="form-label">
              Do you use telematics or ELD systems? <span className="field-required">*</span>
            </label>
            <div className="form-sublabel">Electronic Logging Devices or fleet management systems</div>
            <div className="yes-no-grid">
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.hasTelematics", true)}
                style={{
                  background: hasTelematics === true ? "var(--color-accent)" : "white",
                  color: hasTelematics === true ? "white" : "var(--color-text)",
                  border: hasTelematics === true ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                  fontWeight: hasTelematics === true ? 600 : 400,
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => {
                  setValue("operations.hasTelematics", false);
                  setValue("operations.telematicsFeatures", []);
                  setValue("operations.telematicsFleetPercentage", null);
                }}
                style={{
                  background: hasTelematics === false ? "var(--color-danger)" : "white",
                  color: hasTelematics === false ? "white" : "var(--color-text)",
                  border: hasTelematics === false ? "2px solid var(--color-danger)" : "2px solid var(--color-border)",
                  fontWeight: hasTelematics === false ? 600 : 400,
                }}
              >
                No
              </button>
            </div>
          </div>

          {/* Telematics Features (Conditional) */}
          {hasTelematics === true && (
            <>
              <div className="form-group" style={{ marginLeft: "1.5rem", paddingLeft: "1rem", borderLeft: "3px solid var(--color-border)" }}>
                <label className="form-label">What features do you use?</label>
                <div className="form-sublabel">Select all that apply</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {telematicsOptions.map((option) => (
                    <label
                      key={option.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        border: telematicsFeatures?.includes(option.value)
                          ? "2px solid var(--color-accent)"
                          : "2px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        background: telematicsFeatures?.includes(option.value)
                          ? "rgba(34, 197, 94, 0.05)"
                          : "white",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={telematicsFeatures?.includes(option.value)}
                        onChange={() => toggleTelematicsFeature(option.value)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <span style={{ fontWeight: 500 }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fleet Percentage Slider */}
              <div className="form-group" style={{ marginLeft: "1.5rem", paddingLeft: "1rem", borderLeft: "3px solid var(--color-border)" }}>
                <label className="form-label">
                  What percentage of your fleet has telematics? <span className="field-required">*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={telematicsFleetPercentage || 0}
                    onChange={(e) => setValue("operations.telematicsFleetPercentage", parseInt(e.target.value))}
                    style={{ flex: 1, cursor: "pointer" }}
                  />
                  <div
                    style={{
                      minWidth: "60px",
                      padding: "0.5rem 1rem",
                      background: "var(--color-accent)",
                      color: "white",
                      borderRadius: "var(--radius-md)",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {telematicsFleetPercentage || 0}%
                  </div>
                </div>
              </div>
            </>
          )}

          {/* MVR Checks */}
          <div className="form-group">
            <label className="form-label">
              Do you check Motor Vehicle Records (MVRs) before hiring drivers? <span className="field-required">*</span>
            </label>
            <div className="yes-no-grid">
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.checksMVRs", true)}
                style={{
                  background: checksMVRs === true ? "var(--color-accent)" : "white",
                  color: checksMVRs === true ? "white" : "var(--color-text)",
                  border: checksMVRs === true ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                  fontWeight: checksMVRs === true ? 600 : 400,
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="yes-no-btn"
                onClick={() => setValue("operations.checksMVRs", false)}
                style={{
                  background: checksMVRs === false ? "var(--color-danger)" : "white",
                  color: checksMVRs === false ? "white" : "var(--color-text)",
                  border: checksMVRs === false ? "2px solid var(--color-danger)" : "2px solid var(--color-border)",
                  fontWeight: checksMVRs === false ? 600 : 400,
                }}
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
