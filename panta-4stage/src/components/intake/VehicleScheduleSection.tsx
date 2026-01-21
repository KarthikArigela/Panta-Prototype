"use client";

import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, Vehicle, VehicleBodyType, VehicleRadius, defaultVehicle } from "@/types/intake";
import { useState } from "react";

interface VehicleScheduleSectionProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 3.3: Vehicle Schedule Section
 *
 * Collapsible section for adding trucks with year, make, model, VIN, body type,
 * GVW, stated value, garaging address, radius, for-hire status, and lienholder info.
 *
 * Based on US-009 acceptance criteria.
 */
export function VehicleScheduleSection({ form }: VehicleScheduleSectionProps) {
  const { watch, setValue } = form;
  const [isOpen, setIsOpen] = useState(true);

  // Watch vehicles array and fleet size from Stage 2
  const vehicles = watch("vehicles") || [];
  const fleetSize = watch("riskProfile.fleetSize") || 0;

  // Add new vehicle
  const addVehicle = () => {
    setValue("vehicles", [...vehicles, { ...defaultVehicle }]);
  };

  // Remove vehicle at index
  const removeVehicle = (index: number) => {
    const updated = vehicles.filter((_, i) => i !== index);
    setValue("vehicles", updated);
  };

  // Update specific vehicle field
  const updateVehicle = (index: number, field: keyof Vehicle, value: any) => {
    const updated = [...vehicles];
    updated[index] = { ...updated[index], [field]: value };
    setValue("vehicles", updated);
  };

  // Format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return "";
    return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  };

  // Format GVW with commas
  const formatGVW = (value: number | null) => {
    if (value === null) return "";
    return value.toLocaleString("en-US");
  };

  const bodyTypeOptions: { value: VehicleBodyType; label: string }[] = [
    { value: "tractor", label: "Tractor" },
    { value: "straight_truck", label: "Straight Truck" },
    { value: "box_truck", label: "Box Truck" },
    { value: "flatbed", label: "Flatbed" },
    { value: "tanker", label: "Tanker" },
    { value: "dump_truck", label: "Dump Truck" },
    { value: "other", label: "Other" },
  ];

  const radiusOptions: { value: VehicleRadius; label: string; desc: string }[] = [
    { value: "local", label: "Local", desc: "Under 50 miles" },
    { value: "regional", label: "Regional", desc: "50-200 miles" },
    { value: "long_regional", label: "Long Regional", desc: "200-500 miles" },
    { value: "long_haul", label: "Long Haul", desc: "Over 500 miles" },
  ];

  // Generate year options from 1990 to current year + 1
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1989 + 1 }, (_, i) => currentYear - i + 1);

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
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
            Your Trucks
          </h3>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--color-muted)" }}>
            {fleetSize > 0
              ? `${vehicles.length} of ${fleetSize} trucks added`
              : `${vehicles.length} ${vehicles.length === 1 ? "truck" : "trucks"} added`}
          </p>
          {fleetSize > 0 && (
            <div
              style={{
                marginTop: "0.5rem",
                width: "100%",
                maxWidth: "300px",
                height: "8px",
                backgroundColor: "#e5e5e5",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min((vehicles.length / fleetSize) * 100, 100)}%`,
                  backgroundColor: "var(--color-accent)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          )}
        </div>
        <span style={{ fontSize: "1.5rem", color: "var(--color-text-muted)" }}>
          {isOpen ? "−" : "+"}
        </span>
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
          {/* Vehicle List */}
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              style={{
                padding: "1.5rem",
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1.5rem",
              }}
            >
              {/* Vehicle Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                  Vehicle #{index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeVehicle(index)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--color-danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Remove
                </button>
              </div>

              {/* Year, Make, Model */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    Year <span className="field-required">*</span>
                  </label>
                  <select
                    value={vehicle.year || ""}
                    onChange={(e) => updateVehicle(index, "year", e.target.value ? Number(e.target.value) : null)}
                    className="form-input"
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Make <span className="field-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicle.make || ""}
                    onChange={(e) => updateVehicle(index, "make", e.target.value)}
                    placeholder="e.g., Freightliner, Peterbilt"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Model <span className="field-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicle.model || ""}
                    onChange={(e) => updateVehicle(index, "model", e.target.value)}
                    placeholder="e.g., Cascadia, 579"
                    className="form-input"
                  />
                </div>
              </div>

              {/* VIN */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">
                  VIN (Vehicle Identification Number) <span className="field-required">*</span>
                </label>
                <input
                  type="text"
                  value={vehicle.vin || ""}
                  onChange={(e) => updateVehicle(index, "vin", e.target.value.toUpperCase())}
                  placeholder="17-character VIN"
                  maxLength={17}
                  className="form-input"
                />
                <div className="form-sublabel">
                  {vehicle.vin?.length || 0}/17 characters
                </div>
              </div>

              {/* Body Type */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">
                  Body Type <span className="field-required">*</span>
                </label>
                <div className="options-grid">
                  {bodyTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateVehicle(index, "bodyType", option.value)}
                      className={`option-card ${vehicle.bodyType === option.value ? "selected" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GVW and Stated Value */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    GVW (Gross Vehicle Weight) <span className="field-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicle.gvw ? formatGVW(vehicle.gvw) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateVehicle(index, "gvw", value ? Number(value) : null);
                    }}
                    placeholder="e.g., 80,000"
                    className="form-input"
                  />
                  <div className="form-sublabel">In pounds</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Stated Value <span className="field-required">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicle.statedValue ? formatCurrency(vehicle.statedValue) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      updateVehicle(index, "statedValue", value ? Number(value) : null);
                    }}
                    placeholder="$50,000"
                    className="form-input"
                  />
                  <div className="form-sublabel">Insured value in dollars</div>
                </div>
              </div>

              {/* Radius of Operation */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">
                  Radius of Operation <span className="field-required">*</span>
                </label>
                <div className="yes-no-grid">
                  {radiusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateVehicle(index, "radius", option.value)}
                      className={`yes-no-btn ${vehicle.radius === option.value ? "yes" : ""}`}
                    >
                      <strong>{option.label}</strong>
                      <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* For Hire */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">
                  Is this vehicle used for hire? <span className="field-required">*</span>
                </label>
                <div className="yes-no-grid">
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "forHire", true)}
                    className={`yes-no-btn ${vehicle.forHire === true ? "yes" : ""}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "forHire", false)}
                    className={`yes-no-btn ${vehicle.forHire === false ? "no" : ""}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Garaging Address Toggle */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Garaging Address</label>
                <div className="yes-no-grid">
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "useBusinessGaragingAddress", true)}
                    className={`yes-no-btn ${vehicle.useBusinessGaragingAddress === true ? "yes" : ""}`}
                  >
                    Same as Business
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "useBusinessGaragingAddress", false)}
                    className={`yes-no-btn ${vehicle.useBusinessGaragingAddress === false ? "no" : ""}`}
                  >
                    Different Address
                  </button>
                </div>
              </div>

              {/* Conditional Garaging Address Fields */}
              {!vehicle.useBusinessGaragingAddress && (
                <div
                  style={{
                    marginLeft: "1rem",
                    paddingLeft: "1rem",
                    borderLeft: "3px solid var(--color-border)",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label className="form-label">
                      Street Address <span className="field-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicle.garagingAddress?.street || ""}
                      onChange={(e) =>
                        updateVehicle(index, "garagingAddress", {
                          ...vehicle.garagingAddress,
                          street: e.target.value,
                          city: vehicle.garagingAddress?.city || "",
                          state: vehicle.garagingAddress?.state || "",
                          zip: vehicle.garagingAddress?.zip || "",
                        })
                      }
                      placeholder="123 Main St"
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">
                        City <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.garagingAddress?.city || ""}
                        onChange={(e) =>
                          updateVehicle(index, "garagingAddress", {
                            ...vehicle.garagingAddress,
                            street: vehicle.garagingAddress?.street || "",
                            city: e.target.value,
                            state: vehicle.garagingAddress?.state || "",
                            zip: vehicle.garagingAddress?.zip || "",
                          })
                        }
                        placeholder="City"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        State <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.garagingAddress?.state || ""}
                        onChange={(e) =>
                          updateVehicle(index, "garagingAddress", {
                            ...vehicle.garagingAddress,
                            street: vehicle.garagingAddress?.street || "",
                            city: vehicle.garagingAddress?.city || "",
                            state: e.target.value.toUpperCase(),
                            zip: vehicle.garagingAddress?.zip || "",
                          })
                        }
                        placeholder="State"
                        maxLength={2}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        ZIP <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.garagingAddress?.zip || ""}
                        onChange={(e) =>
                          updateVehicle(index, "garagingAddress", {
                            ...vehicle.garagingAddress,
                            street: vehicle.garagingAddress?.street || "",
                            city: vehicle.garagingAddress?.city || "",
                            state: vehicle.garagingAddress?.state || "",
                            zip: e.target.value,
                          })
                        }
                        placeholder="ZIP"
                        maxLength={10}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Lienholder */}
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Does this vehicle have a lienholder?</label>
                <div className="yes-no-grid">
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "hasLienholder", true)}
                    className={`yes-no-btn ${vehicle.hasLienholder === true ? "yes" : ""}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVehicle(index, "hasLienholder", false)}
                    className={`yes-no-btn ${vehicle.hasLienholder === false ? "no" : ""}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Conditional Lienholder Fields */}
              {vehicle.hasLienholder && (
                <div
                  style={{
                    marginLeft: "1rem",
                    paddingLeft: "1rem",
                    borderLeft: "3px solid var(--color-border)",
                  }}
                >
                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label className="form-label">
                      Lienholder Name <span className="field-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicle.lienholder?.name || ""}
                      onChange={(e) =>
                        updateVehicle(index, "lienholder", {
                          name: e.target.value,
                          address: vehicle.lienholder?.address || {
                            street: "",
                            city: "",
                            state: "",
                            zip: "",
                          },
                        })
                      }
                      placeholder="Bank or financing company name"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "1rem" }}>
                    <label className="form-label">
                      Lienholder Street Address <span className="field-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicle.lienholder?.address?.street || ""}
                      onChange={(e) =>
                        updateVehicle(index, "lienholder", {
                          name: vehicle.lienholder?.name || "",
                          address: {
                            ...vehicle.lienholder?.address,
                            street: e.target.value,
                            city: vehicle.lienholder?.address?.city || "",
                            state: vehicle.lienholder?.address?.state || "",
                            zip: vehicle.lienholder?.address?.zip || "",
                          },
                        })
                      }
                      placeholder="123 Main St"
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">
                        City <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.lienholder?.address?.city || ""}
                        onChange={(e) =>
                          updateVehicle(index, "lienholder", {
                            name: vehicle.lienholder?.name || "",
                            address: {
                              ...vehicle.lienholder?.address,
                              street: vehicle.lienholder?.address?.street || "",
                              city: e.target.value,
                              state: vehicle.lienholder?.address?.state || "",
                              zip: vehicle.lienholder?.address?.zip || "",
                            },
                          })
                        }
                        placeholder="City"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        State <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.lienholder?.address?.state || ""}
                        onChange={(e) =>
                          updateVehicle(index, "lienholder", {
                            name: vehicle.lienholder?.name || "",
                            address: {
                              ...vehicle.lienholder?.address,
                              street: vehicle.lienholder?.address?.street || "",
                              city: vehicle.lienholder?.address?.city || "",
                              state: e.target.value.toUpperCase(),
                              zip: vehicle.lienholder?.address?.zip || "",
                            },
                          })
                        }
                        placeholder="State"
                        maxLength={2}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        ZIP <span className="field-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={vehicle.lienholder?.address?.zip || ""}
                        onChange={(e) =>
                          updateVehicle(index, "lienholder", {
                            name: vehicle.lienholder?.name || "",
                            address: {
                              ...vehicle.lienholder?.address,
                              street: vehicle.lienholder?.address?.street || "",
                              city: vehicle.lienholder?.address?.city || "",
                              state: vehicle.lienholder?.address?.state || "",
                              zip: e.target.value,
                            },
                          })
                        }
                        placeholder="ZIP"
                        maxLength={10}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Vehicle Button */}
          <button
            type="button"
            onClick={addVehicle}
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
            Add Truck
          </button>
        </div>
      )}
    </div>
  );
}
