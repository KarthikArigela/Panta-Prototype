"use client";

import { useState, useEffect } from "react";

// ===========================
// TYPE DEFINITIONS
// ===========================
interface FormData {
  // Stage 1: Knockout
  authorityRevoked: boolean | null;
  safetyRatingUnsatisfactory: boolean | null;

  // Stage 2: Basics
  legalName: string;
  taxStructure: string;
  taxId: string;
  parkingAddress: string;
  parkingCity: string;
  parkingState: string;
  parkingZip: string;

  // Stage 3: Operations
  haulsHazmat: boolean | null;
  radiusOfOperation: string;
  crossesStateLines: boolean | null;
  fleetSize: string;

  // Stage 4: Safety
  hasSafetyProgram: boolean | null;
  hasMaintenancePlan: boolean | null;
  checksMVR: boolean | null;
  familyDrivers: boolean | null;

  // Stage 5: Documents
  lossRunsFile: File | null;
  driverListFile: File | null;
  vehicleListFile: File | null;
}

const initialFormData: FormData = {
  authorityRevoked: null,
  safetyRatingUnsatisfactory: null,
  legalName: "",
  taxStructure: "",
  taxId: "",
  parkingAddress: "",
  parkingCity: "",
  parkingState: "",
  parkingZip: "",
  haulsHazmat: null,
  radiusOfOperation: "",
  crossesStateLines: null,
  fleetSize: "",
  hasSafetyProgram: null,
  hasMaintenancePlan: null,
  checksMVR: null,
  familyDrivers: null,
  lossRunsFile: null,
  driverListFile: null,
  vehicleListFile: null,
};

// ===========================
// STAGE DEFINITIONS
// ===========================
const STAGES = [
  { id: 1, label: "Quick Check", icon: "🔍" },
  { id: 2, label: "Your Business", icon: "🏢" },
  { id: 3, label: "Operations", icon: "🛣️" },
  { id: 4, label: "Safety", icon: "🛡️" },
  { id: 5, label: "Documents", icon: "📄" },
];

// ===========================
// MAIN COMPONENT
// ===========================
export default function SmartIntake() {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isKnockedOut, setIsKnockedOut] = useState(false);
  const [knockoutReason, setKnockoutReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check for knockout conditions
  useEffect(() => {
    if (formData.authorityRevoked === true) {
      setIsKnockedOut(true);
      setKnockoutReason(
        "Sorry, we cannot provide a quote because your trucking authority has been revoked."
      );
    } else if (formData.safetyRatingUnsatisfactory === true) {
      setIsKnockedOut(true);
      setKnockoutReason(
        "Sorry, we cannot provide a quote because your DOT Safety Rating is 'Unsatisfactory'."
      );
    } else {
      setIsKnockedOut(false);
      setKnockoutReason("");
    }
  }, [formData.authorityRevoked, formData.safetyRatingUnsatisfactory]);

  const handleNext = () => {
    if (currentStage < 5) {
      setCurrentStage(currentStage + 1);
    } else {
      // Final submit
      setIsSubmitted(true);
      console.log("Final Form Data:", formData);
      console.log("ACORD 125 Mapping:", mapToACORD125(formData));
      console.log("ACORD 127 Mapping:", mapToACORD127(formData));
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const canProceed = (): boolean => {
    if (isKnockedOut) return false;

    switch (currentStage) {
      case 1:
        return (
          formData.authorityRevoked !== null &&
          formData.safetyRatingUnsatisfactory !== null
        );
      case 2:
        return (
          formData.legalName.trim() !== "" &&
          formData.taxStructure !== "" &&
          formData.taxId.trim() !== "" &&
          formData.parkingAddress.trim() !== ""
        );
      case 3:
        return (
          formData.haulsHazmat !== null &&
          formData.radiusOfOperation !== "" &&
          formData.crossesStateLines !== null &&
          formData.fleetSize.trim() !== ""
        );
      case 4:
        return (
          formData.hasSafetyProgram !== null &&
          formData.hasMaintenancePlan !== null &&
          formData.checksMVR !== null &&
          formData.familyDrivers !== null
        );
      case 5:
        return (
          formData.lossRunsFile !== null &&
          formData.driverListFile !== null &&
          formData.vehicleListFile !== null
        );
      default:
        return false;
    }
  };

  // ===========================
  // ACORD MAPPING FUNCTIONS
  // ===========================
  const mapToACORD125 = (data: FormData) => {
    return {
      applicant: {
        legalName: data.legalName,
        entityType: data.taxStructure,
        fein: data.taxId,
      },
      premisesInformation: {
        streetAddress: data.parkingAddress,
        city: data.parkingCity,
        state: data.parkingState,
        zip: data.parkingZip,
      },
      generalInformation: {
        formalSafetyProgram: data.hasSafetyProgram ? "Y" : "N",
      },
    };
  };

  const mapToACORD127 = (data: FormData) => {
    const radiusMap: Record<string, string> = {
      local: "L",
      intermediate: "I",
      longhaul: "LH",
    };

    return {
      vehicleSection: {
        radius: radiusMap[data.radiusOfOperation] || "",
        numberOfAutos: data.fleetSize,
      },
      generalInformation: {
        transportsHazmat: data.haulsHazmat ? "Y" : "N",
        iccFilingsRequired: data.crossesStateLines ? "Y" : "N",
        vehicleMaintenanceProgram: data.hasMaintenancePlan ? "Y" : "N",
        mvrVerification: data.checksMVR ? "Y" : "N",
        familyMembersUseVehicles: data.familyDrivers ? "Y" : "N",
      },
    };
  };

  // ===========================
  // RENDER SUCCESS
  // ===========================
  if (isSubmitted) {
    return (
      <div className="card success-card">
        <div className="success-icon">✓</div>
        <h2>Application Submitted!</h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
          We have received your information. Our team will review it and get back to you within 24 hours.
        </p>
        <div className="summary-section">
          <h4>What happens next?</h4>
          <ol style={{ textAlign: "left", lineHeight: 2 }}>
            <li>Our underwriters review your submission</li>
            <li>We match you with the best carriers for your needs</li>
            <li>You receive your quote via email</li>
          </ol>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Start New Application
        </button>
      </div>
    );
  }

  // ===========================
  // RENDER FORM
  // ===========================
  return (
    <>
      {/* Progress Bar */}
      <div className="progress-container">
        {STAGES.map((stage) => (
          <div
            key={stage.id}
            className={`progress-step ${currentStage === stage.id
                ? "active"
                : currentStage > stage.id
                  ? "completed"
                  : ""
              }`}
          >
            <div className="progress-circle">
              {currentStage > stage.id ? "✓" : stage.icon}
            </div>
            <span className="progress-label">{stage.label}</span>
          </div>
        ))}
      </div>

      {/* Card Content */}
      <div className="card">
        {/* Knockout Alert */}
        {isKnockedOut && (
          <div className="knockout-alert">
            <h3>⚠️ We Cannot Continue</h3>
            <p>{knockoutReason}</p>
          </div>
        )}

        {/* Stage Content */}
        {!isKnockedOut && (
          <>
            {currentStage === 1 && (
              <Stage1Knockout formData={formData} setFormData={setFormData} />
            )}
            {currentStage === 2 && (
              <Stage2Basics formData={formData} setFormData={setFormData} />
            )}
            {currentStage === 3 && (
              <Stage3Operations formData={formData} setFormData={setFormData} />
            )}
            {currentStage === 4 && (
              <Stage4Safety formData={formData} setFormData={setFormData} />
            )}
            {currentStage === 5 && (
              <Stage5Documents formData={formData} setFormData={setFormData} />
            )}
          </>
        )}

        {/* Navigation */}
        {!isKnockedOut && (
          <div className="button-row">
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={currentStage === 1}
              style={{ opacity: currentStage === 1 ? 0 : 1 }}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStage === 5 ? "Submit Application" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ===========================
// STAGE 1: KNOCKOUT
// ===========================
interface StageProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function Stage1Knockout({ formData, setFormData }: StageProps) {
  return (
    <>
      <div className="card-header">
        <h2>🔍 Quick Check</h2>
        <p>Let&apos;s make sure we can help you before going further.</p>
      </div>

      {/* Question 1 */}
      <div className="form-group">
        <label className="form-label">
          Has the government ever taken away your trucking authority?
        </label>
        <span className="form-sublabel">
          (This means you were &quot;shut down&quot; and couldn&apos;t operate)
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.authorityRevoked === true ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, authorityRevoked: true })}
          >
            ❌ Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.authorityRevoked === false ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, authorityRevoked: false })}
          >
            ✅ No
          </button>
        </div>
      </div>

      {/* Question 2 */}
      <div className="form-group" style={{ marginTop: "2rem" }}>
        <label className="form-label">
          Is your current DOT Safety Rating &quot;Unsatisfactory&quot;?
        </label>
        <span className="form-sublabel">
          (Check your FMCSA portal if you&apos;re not sure)
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.safetyRatingUnsatisfactory === true ? "selected-yes" : ""
              }`}
            onClick={() =>
              setFormData({ ...formData, safetyRatingUnsatisfactory: true })
            }
          >
            ❌ Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.safetyRatingUnsatisfactory === false ? "selected-no" : ""
              }`}
            onClick={() =>
              setFormData({ ...formData, safetyRatingUnsatisfactory: false })
            }
          >
            ✅ No
          </button>
        </div>
      </div>
    </>
  );
}

// ===========================
// STAGE 2: BASICS
// ===========================
function Stage2Basics({ formData, setFormData }: StageProps) {
  const taxOptions = [
    { value: "individual", label: "Individual / Sole Owner", desc: "Just me" },
    { value: "partnership", label: "Partnership", desc: "2+ owners" },
    { value: "corporation", label: "Corporation", desc: "Inc. or Corp." },
    { value: "llc", label: "LLC", desc: "Limited Liability" },
  ];

  return (
    <>
      <div className="card-header">
        <h2>🏢 Your Business</h2>
        <p>Tell us about your trucking company.</p>
      </div>

      {/* Legal Name */}
      <div className="form-group">
        <label className="form-label">
          What is the official legal name of your business?
        </label>
        <span className="form-sublabel">
          (Exactly as it appears on your tax documents)
        </span>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Bob's Trucking LLC"
          value={formData.legalName}
          onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
        />
      </div>

      {/* Tax Structure */}
      <div className="form-group">
        <label className="form-label">How is your company set up?</label>
        <div className="options-grid">
          {taxOptions.map((opt) => (
            <div
              key={opt.value}
              className={`option-card ${formData.taxStructure === opt.value ? "selected" : ""
                }`}
              onClick={() => setFormData({ ...formData, taxStructure: opt.value })}
            >
              <input
                type="radio"
                name="taxStructure"
                value={opt.value}
                checked={formData.taxStructure === opt.value}
                readOnly
              />
              <div className="option-title">{opt.label}</div>
              <div className="option-desc">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax ID */}
      <div className="form-group">
        <label className="form-label">What is your Tax ID Number?</label>
        <span className="form-sublabel">
          (Your FEIN or Social Security Number)
        </span>
        <input
          type="text"
          className="form-input"
          placeholder="XX-XXXXXXX"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
        />
      </div>

      {/* Parking Address */}
      <div className="form-group">
        <label className="form-label">Where do you park your trucks at night?</label>
        <span className="form-sublabel">(Your main garaging location)</span>
        <input
          type="text"
          className="form-input"
          placeholder="Street Address"
          value={formData.parkingAddress}
          onChange={(e) =>
            setFormData({ ...formData, parkingAddress: e.target.value })
          }
          style={{ marginBottom: "0.75rem" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem" }}>
          <input
            type="text"
            className="form-input"
            placeholder="City"
            value={formData.parkingCity}
            onChange={(e) => setFormData({ ...formData, parkingCity: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="State"
            value={formData.parkingState}
            onChange={(e) => setFormData({ ...formData, parkingState: e.target.value })}
          />
          <input
            type="text"
            className="form-input"
            placeholder="ZIP"
            value={formData.parkingZip}
            onChange={(e) => setFormData({ ...formData, parkingZip: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}

// ===========================
// STAGE 3: OPERATIONS
// ===========================
function Stage3Operations({ formData, setFormData }: StageProps) {
  const radiusOptions = [
    { value: "local", label: "Local", desc: "Less than 50 miles from home" },
    { value: "intermediate", label: "Regional", desc: "50 - 200 miles from home" },
    { value: "longhaul", label: "Long Haul", desc: "Over 200 miles from home" },
  ];

  return (
    <>
      <div className="card-header">
        <h2>🛣️ Your Operations</h2>
        <p>Help us understand what your trucks do.</p>
      </div>

      {/* Hazmat */}
      <div className="form-group">
        <label className="form-label">
          Do you haul any dangerous chemicals or hazardous materials?
        </label>
        <span className="form-sublabel">
          (Hazmat, explosives, flammables, etc.)
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.haulsHazmat === true ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, haulsHazmat: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.haulsHazmat === false ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, haulsHazmat: false })}
          >
            No
          </button>
        </div>
      </div>

      {/* Radius */}
      <div className="form-group">
        <label className="form-label">
          How far does your furthest truck drive from home?
        </label>
        <div className="options-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {radiusOptions.map((opt) => (
            <div
              key={opt.value}
              className={`option-card ${formData.radiusOfOperation === opt.value ? "selected" : ""
                }`}
              onClick={() => setFormData({ ...formData, radiusOfOperation: opt.value })}
            >
              <input
                type="radio"
                name="radius"
                value={opt.value}
                checked={formData.radiusOfOperation === opt.value}
                readOnly
              />
              <div className="option-title">{opt.label}</div>
              <div className="option-desc">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* State Lines */}
      <div className="form-group">
        <label className="form-label">Do your trucks cross state lines?</label>
        <span className="form-sublabel">
          (This affects federal filing requirements)
        </span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.crossesStateLines === true ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, crossesStateLines: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.crossesStateLines === false ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, crossesStateLines: false })}
          >
            No
          </button>
        </div>
      </div>

      {/* Fleet Size */}
      <div className="form-group">
        <label className="form-label">
          How many power units (trucks/tractors) do you have?
        </label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 10"
          value={formData.fleetSize}
          onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
          min="1"
          style={{ maxWidth: "200px" }}
        />
      </div>
    </>
  );
}

// ===========================
// STAGE 4: SAFETY
// ===========================
function Stage4Safety({ formData, setFormData }: StageProps) {
  return (
    <>
      <div className="card-header">
        <h2>🛡️ Safety & Drivers</h2>
        <p>A few questions about how you manage risk.</p>
      </div>

      {/* Safety Program */}
      <div className="form-group">
        <label className="form-label">
          Do you have a written safety meeting or training program for your drivers?
        </label>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.hasSafetyProgram === true ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, hasSafetyProgram: true })}
          >
            ✅ Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.hasSafetyProgram === false ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, hasSafetyProgram: false })}
          >
            No
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div className="form-group">
        <label className="form-label">
          Do you have a regular plan for checking and fixing your trucks?
        </label>
        <span className="form-sublabel">(Preventive maintenance program)</span>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.hasMaintenancePlan === true ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, hasMaintenancePlan: true })}
          >
            ✅ Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.hasMaintenancePlan === false ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, hasMaintenancePlan: false })}
          >
            No
          </button>
        </div>
      </div>

      {/* MVR Check */}
      <div className="form-group">
        <label className="form-label">
          Do you check a new driver&apos;s past driving record (MVR) before hiring them?
        </label>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.checksMVR === true ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, checksMVR: true })}
          >
            ✅ Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.checksMVR === false ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, checksMVR: false })}
          >
            No
          </button>
        </div>
      </div>

      {/* Family Drivers */}
      <div className="form-group">
        <label className="form-label">
          Will any family members drive the trucks?
        </label>
        <div className="yes-no-grid">
          <button
            type="button"
            className={`yes-no-btn ${formData.familyDrivers === true ? "selected-yes" : ""
              }`}
            onClick={() => setFormData({ ...formData, familyDrivers: true })}
          >
            Yes
          </button>
          <button
            type="button"
            className={`yes-no-btn ${formData.familyDrivers === false ? "selected-no" : ""
              }`}
            onClick={() => setFormData({ ...formData, familyDrivers: false })}
          >
            No
          </button>
        </div>
      </div>
    </>
  );
}

// ===========================
// STAGE 5: DOCUMENTS
// ===========================
function Stage5Documents({ formData, setFormData }: StageProps) {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "lossRunsFile" | "driverListFile" | "vehicleListFile"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [field]: file });
  };

  return (
    <>
      <div className="card-header">
        <h2>📄 Upload Your Documents</h2>
        <p>Almost done! We need these files to complete your application.</p>
      </div>

      {/* Loss Runs */}
      <div className="form-group">
        <label className="form-label">Loss Runs</label>
        <span className="form-sublabel">
          Your insurance claims history for the last 3-5 years. Ask your current insurance company for this.
        </span>
        <label
          className={`upload-zone ${formData.lossRunsFile ? "has-file" : ""}`}
        >
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "lossRunsFile")}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
          <div className="upload-icon">{formData.lossRunsFile ? "✅" : "📁"}</div>
          <div className="upload-label">
            {formData.lossRunsFile ? "File uploaded!" : "Click to upload"}
          </div>
          {formData.lossRunsFile && (
            <div className="upload-filename">{formData.lossRunsFile.name}</div>
          )}
          <div className="upload-hint">PDF, DOC, or Excel</div>
        </label>
      </div>

      {/* Driver List */}
      <div className="form-group">
        <label className="form-label">Driver List</label>
        <span className="form-sublabel">
          A list of all your drivers with their Name, Date of Birth, and License Number.
        </span>
        <label
          className={`upload-zone ${formData.driverListFile ? "has-file" : ""}`}
        >
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "driverListFile")}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
          />
          <div className="upload-icon">{formData.driverListFile ? "✅" : "👥"}</div>
          <div className="upload-label">
            {formData.driverListFile ? "File uploaded!" : "Click to upload"}
          </div>
          {formData.driverListFile && (
            <div className="upload-filename">{formData.driverListFile.name}</div>
          )}
          <div className="upload-hint">PDF, DOC, Excel, or CSV</div>
        </label>
      </div>

      {/* Vehicle List */}
      <div className="form-group">
        <label className="form-label">Vehicle List</label>
        <span className="form-sublabel">
          A list of all trucks/trailers with VIN, Make, Year, and Value.
        </span>
        <label
          className={`upload-zone ${formData.vehicleListFile ? "has-file" : ""}`}
        >
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "vehicleListFile")}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
          />
          <div className="upload-icon">{formData.vehicleListFile ? "✅" : "🚛"}</div>
          <div className="upload-label">
            {formData.vehicleListFile ? "File uploaded!" : "Click to upload"}
          </div>
          {formData.vehicleListFile && (
            <div className="upload-filename">{formData.vehicleListFile.name}</div>
          )}
          <div className="upload-hint">PDF, DOC, Excel, or CSV</div>
        </label>
      </div>
    </>
  );
}
