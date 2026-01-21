"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, Driver, ViolationType, defaultDriver, USState } from "@/types/intake";
import { useState } from "react";

interface DriverSectionProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 3.4: Driver Section
 *
 * Collapsible section for adding drivers with full name, DOB, license info,
 * CDL experience, date hired, accidents, and moving violations.
 *
 * Based on US-010 acceptance criteria.
 */
export function DriverSection({ form }: DriverSectionProps) {
  const { watch, setValue } = form;
  const [isOpen, setIsOpen] = useState(true);

  // Watch drivers array
  const drivers = watch("drivers") || [];

  // Add new driver
  const addDriver = () => {
    setValue("drivers", [...drivers, { ...defaultDriver }]);
  };

  // Remove driver at index
  const removeDriver = (index: number) => {
    const updated = drivers.filter((_, i) => i !== index);
    setValue("drivers", updated);
  };

  // Update specific driver field
  const updateDriver = (index: number, field: keyof Driver, value: any) => {
    const updated = [...drivers];
    updated[index] = { ...updated[index], [field]: value };
    setValue("drivers", updated);
  };

  // Add accident to driver
  const addAccident = (driverIndex: number) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    updated[driverIndex] = {
      ...driver,
      accidents: [
        ...driver.accidents,
        { date: "", description: "", atFault: false }
      ]
    };
    setValue("drivers", updated);
  };

  // Remove accident from driver
  const removeAccident = (driverIndex: number, accidentIndex: number) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    updated[driverIndex] = {
      ...driver,
      accidents: driver.accidents.filter((_, i) => i !== accidentIndex)
    };
    setValue("drivers", updated);
  };

  // Update accident field
  const updateAccident = (driverIndex: number, accidentIndex: number, field: string, value: any) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    const accidents = [...driver.accidents];
    accidents[accidentIndex] = { ...accidents[accidentIndex], [field]: value };
    updated[driverIndex] = { ...driver, accidents };
    setValue("drivers", updated);
  };

  // Add violation to driver
  const addViolation = (driverIndex: number) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    updated[driverIndex] = {
      ...driver,
      violations: [
        ...driver.violations,
        { date: "", type: "speeding", description: "", location: "" }
      ]
    };
    setValue("drivers", updated);
  };

  // Remove violation from driver
  const removeViolation = (driverIndex: number, violationIndex: number) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    updated[driverIndex] = {
      ...driver,
      violations: driver.violations.filter((_, i) => i !== violationIndex)
    };
    setValue("drivers", updated);
  };

  // Update violation field
  const updateViolation = (driverIndex: number, violationIndex: number, field: string, value: any) => {
    const updated = [...drivers];
    const driver = updated[driverIndex];
    const violations = [...driver.violations];
    violations[violationIndex] = { ...violations[violationIndex], [field]: value };
    updated[driverIndex] = { ...driver, violations };
    setValue("drivers", updated);
  };

  const violationTypeOptions: { value: ViolationType; label: string }[] = [
    { value: "speeding", label: "Speeding" },
    { value: "reckless_driving", label: "Reckless Driving" },
    { value: "dui_dwi", label: "DUI/DWI" },
    { value: "logbook_violation", label: "Logbook Violation" },
    { value: "other", label: "Other" }
  ];

  const usStates: USState[] = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
  ];

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
          Your Drivers
          {drivers.length > 0 && (
            <span style={{ marginLeft: "0.5rem", color: "var(--color-accent)", fontSize: "0.8em", fontWeight: "normal" }}>
              ({drivers.length} {drivers.length === 1 ? "driver" : "drivers"} added)
            </span>
          )}
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
          {drivers.map((driver, driverIndex) => (
            <div key={driverIndex} className="card" style={{ marginBottom: "1.5rem", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h4>Driver #{driverIndex + 1}</h4>
                {drivers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDriver(driverIndex)}
                    className="btn-secondary"
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.9rem",
                      backgroundColor: "var(--color-danger)",
                      color: "white"
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Full Legal Name <span className="field-required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={driver.fullName || ""}
                  onChange={(e) => updateDriver(driverIndex, "fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              {/* DOB and License Number */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    Date of Birth <span className="field-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={driver.dateOfBirth || ""}
                    onChange={(e) => updateDriver(driverIndex, "dateOfBirth", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Driver's License Number <span className="field-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={driver.licenseNumber || ""}
                    onChange={(e) => updateDriver(driverIndex, "licenseNumber", e.target.value)}
                    placeholder="License number"
                  />
                </div>
              </div>

              {/* License State */}
              <div className="form-group">
                <label className="form-label">
                  License State <span className="field-required">*</span>
                </label>
                <select
                  className="form-input"
                  value={driver.licenseState || ""}
                  onChange={(e) => updateDriver(driverIndex, "licenseState", e.target.value as USState)}
                >
                  <option value="">Select state...</option>
                  {usStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Years of Experience and Date Hired */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    Years of CDL Experience <span className="field-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={driver.yearsExperience ?? ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? null : parseInt(e.target.value);
                      updateDriver(driverIndex, "yearsExperience", val);
                    }}
                    min="0"
                    max="60"
                    placeholder="Years"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date Hired <span className="field-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={driver.dateHired || ""}
                    onChange={(e) => updateDriver(driverIndex, "dateHired", e.target.value)}
                  />
                </div>
              </div>

              {/* Accidents in Last 3 Years */}
              <div className="form-group">
                <label className="form-label">Accidents in Last 3 Years</label>
                <div className="yes-no-grid">
                  <button
                    type="button"
                    className={`yes-no-btn ${driver.hasAccidents === true ? "active" : ""}`}
                    onClick={() => {
                      updateDriver(driverIndex, "hasAccidents", true);
                      if (driver.accidents.length === 0) {
                        addAccident(driverIndex);
                      }
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`yes-no-btn ${driver.hasAccidents === false ? "active" : ""}`}
                    onClick={() => {
                      updateDriver(driverIndex, "hasAccidents", false);
                      updateDriver(driverIndex, "accidents", []);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Accident Details */}
              {driver.hasAccidents && (
                <div style={{ marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "3px solid var(--color-accent)" }}>
                  {driver.accidents.map((accident, accidentIndex) => (
                    <div key={accidentIndex} className="card" style={{ marginBottom: "1rem", backgroundColor: "#f9f9f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <h5 style={{ margin: 0 }}>Accident #{accidentIndex + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeAccident(driverIndex, accidentIndex)}
                          className="btn-secondary"
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem" }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={accident.date || ""}
                          onChange={(e) => updateAccident(driverIndex, accidentIndex, "date", e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-input"
                          value={accident.description || ""}
                          onChange={(e) => updateAccident(driverIndex, accidentIndex, "description", e.target.value)}
                          placeholder="Describe what happened..."
                          rows={3}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">At Fault?</label>
                        <div className="yes-no-grid">
                          <button
                            type="button"
                            className={`yes-no-btn ${accident.atFault === true ? "active" : ""}`}
                            onClick={() => updateAccident(driverIndex, accidentIndex, "atFault", true)}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            className={`yes-no-btn ${accident.atFault === false ? "active" : ""}`}
                            onClick={() => updateAccident(driverIndex, accidentIndex, "atFault", false)}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addAccident(driverIndex)}
                    className="btn-secondary"
                    style={{ marginTop: "0.5rem" }}
                  >
                    + Add Another Accident
                  </button>
                </div>
              )}

              {/* Moving Violations in Last 3 Years */}
              <div className="form-group">
                <label className="form-label">Moving Violations in Last 3 Years</label>
                <div className="yes-no-grid">
                  <button
                    type="button"
                    className={`yes-no-btn ${driver.hasViolations === true ? "active" : ""}`}
                    onClick={() => {
                      updateDriver(driverIndex, "hasViolations", true);
                      if (driver.violations.length === 0) {
                        addViolation(driverIndex);
                      }
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`yes-no-btn ${driver.hasViolations === false ? "active" : ""}`}
                    onClick={() => {
                      updateDriver(driverIndex, "hasViolations", false);
                      updateDriver(driverIndex, "violations", []);
                    }}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Violation Details */}
              {driver.hasViolations && (
                <div style={{ marginLeft: "1rem", paddingLeft: "1rem", borderLeft: "3px solid var(--color-accent)" }}>
                  {driver.violations.map((violation, violationIndex) => (
                    <div key={violationIndex} className="card" style={{ marginBottom: "1rem", backgroundColor: "#f9f9f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <h5 style={{ margin: 0 }}>Violation #{violationIndex + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeViolation(driverIndex, violationIndex)}
                          className="btn-secondary"
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem" }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-input"
                          value={violation.date || ""}
                          onChange={(e) => updateViolation(driverIndex, violationIndex, "date", e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                          className="form-input"
                          value={violation.type || "speeding"}
                          onChange={(e) => updateViolation(driverIndex, violationIndex, "type", e.target.value as ViolationType)}
                        >
                          {violationTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-input"
                          value={violation.location || ""}
                          onChange={(e) => updateViolation(driverIndex, violationIndex, "location", e.target.value)}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addViolation(driverIndex)}
                    className="btn-secondary"
                    style={{ marginTop: "0.5rem" }}
                  >
                    + Add Another Violation
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Driver Button */}
          <button
            type="button"
            onClick={addDriver}
            style={{
              width: "100%",
              padding: "1rem",
              background: "var(--color-accent)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>+</span>
            Add Driver
          </button>
        </div>
      )}
    </div>
  );
}
