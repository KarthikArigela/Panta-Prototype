# PRD: Smart Intake for Trucking Owners

## Introduction

### Problem Statement
90% of E&S (Excess & Surplus) insurance deals die because of "dirty submissions" — applications with missing or incorrect data. When a trucking business owner fills out a generic 40-page ACORD form, they leave critical fields blank (like "Radius of Operation") because they don't understand the insurance jargon. The underwriter sees blank fields, assumes the worst, and rejects the application.

The result: a 3-day email ping-pong between the broker, wholesaler, and business owner just to answer simple questions that should have been captured upfront.

### Solution
Build a **Smart Intake** system — a 4-stage conditional logic form that:
1. Asks questions in plain English (5th-grade reading level)
2. Uses conditional logic to show only relevant questions
3. Collects 100% of the data underwriters need
4. Auto-generates ACORD 125, 127, and 137 CA PDFs
5. Outputs a submission-ready packet (ZIP file with PDFs + uploaded documents)

### Value Proposition
**What used to take 3 days of back-and-forth now takes 15 minutes.**

The trucking owner gets a simple, fast experience. The underwriter gets a perfect, typed application with zero missing fields. Panta gets to the top of the underwriter's stack because our submissions are always clean.

---

## Goals

- **G1**: Eliminate "dirty submissions" — capture 100% of required ACORD fields for trucking
- **G2**: Reduce form completion time to under 15 minutes
- **G3**: Translate insurance jargon into 5th-grade readable questions
- **G4**: Auto-generate ACORD 125, 127, and 137 CA PDFs from user inputs
- **G5**: Create downloadable submission packet (ZIP) ready to forward to carriers
- **G6**: Support all trucking owners (new ventures and established, any fleet size)
- **G7**: Flag E&S market risks automatically based on answers

---

## User Stories

### US-001: Stage 1 - Hard Knockout Questions
**Description:** As a broker, I want to immediately filter out uninsurable applicants so that I don't waste time on applications that will be declined.

**Acceptance Criteria:**
- [ ] Form starts with 6 knockout questions before collecting any other data
- [ ] Questions are displayed one at a time with Yes/No toggle buttons
- [ ] If user answers "Yes" to any knockout question, show immediate decline message: "Based on your answers, we cannot provide an online quote. Please call us at [phone] to discuss your options."
- [ ] Knockout questions include:
  - "Has your operating authority (DOT/MC) ever been revoked or suspended?"
  - "Is your current FMCSA Safety Rating 'Unsatisfactory'?"
  - "Has any insurance policy been cancelled for non-payment in the last 3 years?"
  - "Have you filed for bankruptcy in the last 5 years?"
  - "Have you or any owner been convicted of fraud, arson, or bribery?"
  - "Do you perform major body modifications on trucks (cut-and-stretch, chassis lengthening)?"
- [ ] If all answers are "No", proceed to Stage 2
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-002: Stage 2 - Risk Classifier Questions
**Description:** As a broker, I want to classify the risk profile early so that I can show relevant follow-up questions and determine if this is a Standard or E&S market submission.

**Acceptance Criteria:**
- [ ] Display 8 risk classifier questions with conditional follow-ups
- [ ] Questions use multiple-choice buttons (not dropdowns) for faster input
- [ ] Conditional logic triggers:

| Question | If Answer | Then Show |
|----------|-----------|-----------|
| "Do you haul hazardous materials?" | Yes | Hazmat type selector (Flammables, Corrosives, Explosives, Radioactive, Other) |
| "Where is the farthest your trucks travel?" | >500 miles | Flag as "Long Haul" in system |
| "How many trucks do you operate?" | >10 | Show fleet discount eligibility note |
| "Do you operate under your own authority or lease to another carrier?" | Lease-on | Show "Motor Carrier you lease to" field |
| "What type of cargo do you primarily haul?" | Refrigerated | Ask "Do you need reefer breakdown coverage?" |
| "What type of cargo do you primarily haul?" | Hazmat | Already captured above |
| "Do you use trailer interchange agreements?" | Yes | Show # trailers, zones, radius fields |
| "Are you a new venture (less than 3 years)?" | Yes | Flag for E&S market |
| "Have you had more than 2 accidents in the past 3 years?" | Yes | Flag for E&S market |

- [ ] Cargo type options: General Freight, Refrigerated/Reefer, Dry Van, Flatbed, Tanker, Auto Hauler, Household Goods, Intermodal/Containers, Oversized/Heavy Haul, Other
- [ ] E&S flags are stored in form state for later use
- [ ] Progress indicator shows "Step 2 of 4"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-003: Stage 3 - Skeleton Questions (Business & Operations Details)
**Description:** As a trucking owner, I want to enter my business details in plain English so that I don't get confused by insurance terminology.

**Acceptance Criteria:**
- [ ] Organize questions into collapsible sections:
  1. Business Information
  2. Operations & Safety
  3. Your Trucks (Vehicle Schedule)
  4. Your Drivers
  5. Prior Insurance & Claims History
  6. Coverage Preferences

**Section 3.1: Business Information**
- [ ] Legal business name (text input, required)
- [ ] DBA / "Doing Business As" (text input, optional)
- [ ] Business mailing address (address autocomplete)
- [ ] Business phone number (tel input with formatting)
- [ ] FEIN / Tax ID (text input with format validation: XX-XXXXXXX)
- [ ] Entity type (radio buttons): LLC, Corporation, Sole Proprietor, Partnership, Other
- [ ] Website (url input, optional)
- [ ] When did you start this business? (date picker, required)
- [ ] USDOT Number (text input, required, 7 digits)
- [ ] MC Number (text input, optional, format MC-XXXXXX)
- [ ] Annual gross revenue (currency input with $ formatting)
- [ ] Number of full-time employees (number input)
- [ ] Number of part-time employees (number input)
- [ ] Is your garaging address different from mailing? (Yes/No toggle)
  - If Yes: Show garaging address fields

**Section 3.2: Operations & Safety**
- [ ] Describe what you haul in your own words (textarea, required, placeholder: "Example: We haul refrigerated produce from California farms to distribution centers across the Western states")
- [ ] What states do you operate in? (multi-select checkboxes for US states)
- [ ] Do you have a formal safety program? (Yes/No)
  - If Yes: Checkboxes for Safety Manual, Safety Director Position, Monthly Safety Meetings, OSHA Compliance
- [ ] Do you have a vehicle maintenance program? (Yes/No)
- [ ] Do you use telematics or ELDs in your trucks? (Yes/No)
  - If Yes: Checkboxes for what it's used for (Driver Safety Monitoring, Fuel Tracking, Maintenance Alerts, Mileage Tracking, GPS Location)
  - If Yes: What percentage of your fleet is monitored? (slider 0-100%)
- [ ] Do you check driver MVRs (driving records) before hiring? (Yes/No)

**Section 3.3: Your Trucks (Vehicle Schedule)**
- [ ] "Add Truck" button to add vehicles dynamically
- [ ] Per truck, capture:
  - Year (dropdown: 1990-2026)
  - Make (text input with autocomplete: Freightliner, Peterbilt, Kenworth, Volvo, International, Mack, Western Star, Other)
  - Model (text input)
  - VIN (text input, 17 characters, required)
  - Body type (dropdown): Tractor, Straight Truck, Box Truck, Flatbed, Tanker, Dump Truck, Other
  - Gross Vehicle Weight (GVW) in pounds (number input)
  - "What is this truck worth?" (currency input for Stated Value)
  - "Where is this truck parked overnight?" (address input for Garaging Address, can default to business address)
  - "How far does this truck typically travel one-way?" (radio buttons): Local (<50 miles), Regional (50-200 miles), Long Regional (200-500 miles), Long Haul (500+ miles)
  - "Is this truck used for hire (hauling for others)?" (Yes/No)
  - "Does anyone have a loan or lien on this truck?" (Yes/No)
    - If Yes: Lienholder name and address
- [ ] Show running count: "3 trucks added"
- [ ] Allow removing trucks
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Section 3.4: Your Drivers**
- [ ] "Add Driver" button to add drivers dynamically
- [ ] Per driver, capture:
  - Full legal name (text input, required)
  - Date of birth (date picker, required)
  - Driver's license number (text input, required)
  - License state (dropdown: US states)
  - Years of CDL driving experience (number input)
  - Date hired (date picker)
  - "Has this driver had any accidents in the last 3 years?" (Yes/No)
    - If Yes: For each accident - Date, Description, At-fault? (Yes/No)
  - "Has this driver had any moving violations in the last 3 years?" (Yes/No)
    - If Yes: For each violation - Date, Type (dropdown: Speeding, Reckless Driving, DUI/DWI, Logbook Violation, Other), Location (City, State)
- [ ] Show running count: "4 drivers added"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

**Section 3.5: Prior Insurance & Claims History**
- [ ] "Do you currently have trucking insurance?" (Yes/No)
  - If Yes:
    - Current carrier name (text input)
    - Policy number (text input)
    - Annual premium (currency input)
    - Policy effective date (date picker)
    - Policy expiration date (date picker)
    - Why are you shopping? (dropdown): Renewal coming up, Want better rates, Need higher limits, Current carrier non-renewed, Current carrier cancelled, Other
- [ ] "Have you had any claims in the last 5 years?" (Yes/No)
  - If Yes: For each claim:
    - Date of loss (date picker)
    - Type (dropdown): Collision, Cargo Damage, Bodily Injury Liability, Property Damage Liability, Comprehensive (Theft/Fire/Weather), Other
    - Amount paid (currency input)
    - Amount still reserved (currency input)
    - Is claim still open? (Yes/No)
    - Brief description (textarea)
- [ ] Typecheck passes

**Section 3.6: Coverage Preferences**
- [ ] "What liability limit do you need?" (radio buttons with descriptions):
  - $1,000,000 CSL (Most Common - Required by most brokers)
  - $750,000 CSL (Minimum for some operations)
  - $500,000 CSL (May limit broker contracts)
  - Other (text input)
- [ ] "What comprehensive deductible do you prefer?" (radio buttons): $1,000, $2,500, $5,000, Other
- [ ] "What collision deductible do you prefer?" (radio buttons): $1,000, $2,500, $5,000, Other
- [ ] "Do you need hired auto coverage?" (Yes/No with tooltip: "Covers vehicles you rent or borrow")
- [ ] "Do you need non-owned auto coverage?" (Yes/No with tooltip: "Covers employees driving their own vehicles on company business")
- [ ] Progress indicator shows "Step 3 of 4"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-004: Stage 4 - Document Upload Gate
**Description:** As a broker, I want to require certain documents before submission so that the application is complete and ready for underwriting.

**Acceptance Criteria:**
- [ ] Display document upload section with clear requirements
- [ ] Required documents (cannot submit without):
  - Loss Runs / Claims History Letter (from current/prior insurer, last 3-5 years)
    - Tooltip: "Contact your current insurance company and request 'loss runs' - this shows your claims history"
    - Accept: PDF, JPG, PNG
  - MC/DOT Authority Letter
    - Tooltip: "Your operating authority letter from FMCSA"
    - Accept: PDF, JPG, PNG
- [ ] Optional but recommended documents:
  - Vehicle Schedule (if you have a list)
  - Driver List (if you have a list)
  - Current Insurance Dec Page (declarations page)
  - IFTA Credentials
- [ ] Drag-and-drop upload zone for each document type
- [ ] Show upload progress and success confirmation
- [ ] File size limit: 10MB per file
- [ ] Validate file types on upload
- [ ] Show "All required documents uploaded" checkmark when complete
- [ ] "Submit Application" button only enabled when all required docs uploaded
- [ ] Progress indicator shows "Step 4 of 4"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-005: Form Progress & State Management
**Description:** As a trucking owner, I want to see my progress and be able to come back later so that I don't lose my work if I need to step away.

**Acceptance Criteria:**
- [ ] Progress indicator visible at all times showing current stage (1 of 4, 2 of 4, etc.)
- [ ] Stage names displayed: "Quick Questions" → "Your Risk Profile" → "Business Details" → "Upload Documents"
- [ ] Form state persisted to localStorage on every field change
- [ ] "Save & Continue Later" button that shows confirmation
- [ ] On return, detect saved state and prompt "Welcome back! Continue where you left off?"
- [ ] "Start Over" button with confirmation dialog
- [ ] Mobile-responsive design (works on phone)
- [ ] Form validates each section before allowing progression
- [ ] Back button allows returning to previous stages
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### US-006: JSON Data Model for ACORD Mapping
**Description:** As a developer, I want a structured JSON data model so that I can reliably map user inputs to ACORD form fields.

**Acceptance Criteria:**
- [ ] Define TypeScript interfaces for all form data
- [ ] JSON structure maps to ACORD fields as documented in the Field Mapping section below
- [ ] All required ACORD fields have corresponding form inputs
- [ ] Validate that no critical fields are missing before PDF generation
- [ ] Store E&S flags in metadata for broker routing
- [ ] Example JSON structure:

```typescript
interface SmartIntakeData {
  // Knockout flags
  knockout: {
    authorityRevoked: boolean;
    unsatisfactorySafetyRating: boolean;
    cancelledForNonPayment: boolean;
    bankruptcyFiled: boolean;
    convictedOfFraud: boolean;
    majorBodyModifications: boolean;
  };

  // Risk classification
  riskProfile: {
    hazmat: boolean;
    hazmatTypes?: string[];
    radiusMiles: number;
    fleetSize: number;
    operatesOwnAuthority: boolean;
    leaseCarrier?: string;
    primaryCargoType: string;
    trailerInterchange: boolean;
    trailerInterchangeDetails?: { count: number; zones: string; radius: number };
    newVenture: boolean;
    multipleAccidents: boolean;
    esFlags: string[]; // Array of reasons for E&S routing
  };

  // Business information (ACORD 125)
  business: {
    legalName: string;
    dba?: string;
    mailingAddress: Address;
    phone: string;
    fein: string;
    entityType: 'LLC' | 'Corporation' | 'SoleProprietor' | 'Partnership' | 'Other';
    website?: string;
    dateStarted: string; // ISO date
    dotNumber: string;
    mcNumber?: string;
    annualRevenue: number;
    fullTimeEmployees: number;
    partTimeEmployees: number;
    garagingAddress?: Address;
  };

  // Operations (ACORD 125 + 127)
  operations: {
    description: string;
    statesOfOperation: string[];
    hasSafetyProgram: boolean;
    safetyProgramDetails?: string[];
    hasMaintenanceProgram: boolean;
    hasTelematics: boolean;
    telematicsDetails?: { uses: string[]; percentFleet: number };
    checksMVRs: boolean;
  };

  // Vehicles (ACORD 127 + 129)
  vehicles: Vehicle[];

  // Drivers (ACORD 127)
  drivers: Driver[];

  // Prior insurance (ACORD 125)
  priorInsurance: {
    currentlyInsured: boolean;
    carrier?: string;
    policyNumber?: string;
    premium?: number;
    effectiveDate?: string;
    expirationDate?: string;
    reasonForShopping?: string;
  };

  // Loss history (ACORD 125)
  lossHistory: {
    hasClaims: boolean;
    claims: Claim[];
  };

  // Coverage preferences (ACORD 137 CA)
  coveragePreferences: {
    liabilityLimit: string;
    compDeductible: string;
    collisionDeductible: string;
    hiredAuto: boolean;
    nonOwnedAuto: boolean;
  };

  // Documents
  documents: {
    lossRuns: File | null;
    authorityLetter: File | null;
    vehicleSchedule?: File | null;
    driverList?: File | null;
    currentDecPage?: File | null;
    iftaCredentials?: File | null;
  };
}
```

- [ ] Typecheck passes

---

### US-007: ACORD 125 PDF Generation
**Description:** As a broker, I want the system to auto-generate a filled ACORD 125 PDF so that I don't have to manually transfer data.

**Acceptance Criteria:**
- [ ] Use pdf-lib or similar library to fill ACORD 125 template
- [ ] Map form data to ACORD 125 fields:

| Form Field | ACORD 125 Location |
|------------|-------------------|
| business.legalName | Page 1 - Named Insured |
| business.mailingAddress | Page 1 - Mailing Address |
| business.phone | Page 1 - Business Phone # |
| business.fein | Page 1 - FEIN |
| business.entityType | Page 1 - Entity checkboxes |
| business.website | Page 1 - Website Address |
| business.dateStarted | Page 2 - Date Business Started |
| business.annualRevenue | Page 2 - Annual Revenues |
| business.fullTimeEmployees | Page 2 - # Full Time Empl |
| business.partTimeEmployees | Page 2 - # Part Time Empl |
| business.garagingAddress | Page 2 - Premises Info |
| operations.description | Page 2 - Description of Primary Operations |
| operations.hasSafetyProgram | Page 3 - Q2 |
| knockout.cancelledForNonPayment | Page 3 - Q5 (mark No) |
| knockout.convictedOfFraud | Page 3 - Q7 (mark No) |
| knockout.bankruptcyFiled | Page 3 - Q9 (mark No) |
| priorInsurance.* | Page 3-4 - Prior Carrier Information |
| lossHistory.claims | Page 4 - Loss History table |

- [ ] Check "Truckers" and/or "Motor Carrier" under Lines of Business
- [ ] Add DOT/MC numbers to Description of Operations
- [ ] Generate PDF that matches original form layout
- [ ] Typecheck passes

---

### US-008: ACORD 127 PDF Generation
**Description:** As a broker, I want the system to auto-generate a filled ACORD 127 PDF with all driver and vehicle information.

**Acceptance Criteria:**
- [ ] Map form data to ACORD 127 fields:

| Form Field | ACORD 127 Location |
|------------|-------------------|
| drivers[].name | Page 1 - Driver table - Name |
| drivers[].dob | Page 1 - Driver table - Date of Birth |
| drivers[].licenseNumber | Page 1 - Driver table - Drivers License Number |
| drivers[].licenseState | Page 1 - Driver table - State |
| drivers[].yearsExperience | Page 1 - Driver table - Yrs Exp |
| drivers[].dateHired | Page 1 - Driver table - Date Hire |
| drivers[].violations | Page 2 - Q14 detail section |
| riskProfile.hazmat | Page 1 - Q7 |
| operations.hasMaintenanceProgram | Page 2 - Q3 |
| operations.checksMVRs | Page 2 - Q10 |
| operations.hasTelematics | Page 2 - Q17 |
| vehicles[].year | Page 3 - Vehicle table - Year |
| vehicles[].make | Page 3 - Vehicle table - Make |
| vehicles[].model | Page 3 - Vehicle table - Model |
| vehicles[].vin | Page 3 - Vehicle table - V.I.N. |
| vehicles[].bodyType | Page 3 - Vehicle table - Body Type |
| vehicles[].gvw | Page 3 - Vehicle table - GVW/GCW |
| vehicles[].statedValue | Page 3 - Vehicle table - Cost New |
| vehicles[].garagingAddress | Page 3 - Vehicle table - Garaging Address |
| vehicles[].radius | Page 3 - Vehicle table - Radius |
| vehicles[].forHire | Page 3 - Vehicle table - For Hire checkbox |
| vehicles[].lienholder | Page 2 - Additional Interest section |

- [ ] If more than 4 vehicles, generate ACORD 129 (Vehicle Schedule) attachment
- [ ] Fill Q1-Q17 based on form answers (mark "No" for all knockout-passed questions)
- [ ] Typecheck passes

---

### US-009: Submission Packet Download (ZIP)
**Description:** As a broker, I want to download a complete submission packet ZIP file so that I can forward it to underwriters immediately.

**Acceptance Criteria:**
- [ ] On form completion, generate ZIP file containing:
  1. ACORD_125_[BusinessName].pdf
  2. ACORD_127_[BusinessName].pdf
  3. ACORD_137_CA_[BusinessName].pdf (if California)
  4. Uploaded documents (renamed clearly):
     - Loss_Runs_[BusinessName].pdf
     - Authority_Letter_[BusinessName].pdf
     - (Other uploaded docs with clear names)
  5. Submission_Summary_[BusinessName].pdf (optional - human-readable summary)
- [ ] ZIP filename: Panta_Submission_[BusinessName]_[Date].zip
- [ ] Show download button after all PDFs generated
- [ ] Show "Your submission packet is ready!" success message
- [ ] Include count of documents: "5 documents in packet"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

### Stage 1: Hard Knockout
- **FR-1**: System MUST display 6 knockout questions before any other data collection
- **FR-2**: System MUST halt intake immediately if any knockout question is answered "Yes"
- **FR-3**: Decline message MUST include phone number for manual assistance

### Stage 2: Risk Classification
- **FR-4**: System MUST capture hazmat status with type selection if "Yes"
- **FR-5**: System MUST capture farthest travel distance and classify as Local/Regional/Long Haul
- **FR-6**: System MUST flag E&S market triggers and store in form state
- **FR-7**: System MUST show conditional follow-up questions based on cargo type

### Stage 3: Business Details
- **FR-8**: System MUST capture all ACORD 125 required fields for trucking
- **FR-9**: System MUST capture all ACORD 127 required fields for trucking
- **FR-10**: System MUST support dynamic addition/removal of vehicles
- **FR-11**: System MUST support dynamic addition/removal of drivers
- **FR-12**: System MUST capture violation and accident details with date, type, and location
- **FR-13**: System MUST validate VIN format (17 characters)
- **FR-14**: System MUST validate FEIN format (XX-XXXXXXX)
- **FR-15**: System MUST validate DOT number format (7 digits)

### Stage 4: Document Upload
- **FR-16**: System MUST require Loss Runs document before submission
- **FR-17**: System MUST require MC/DOT Authority Letter before submission
- **FR-18**: System MUST validate file types (PDF, JPG, PNG only)
- **FR-19**: System MUST enforce 10MB file size limit
- **FR-20**: System MUST show upload progress and confirmation

### PDF Generation
- **FR-21**: System MUST generate ACORD 125 PDF with all captured data
- **FR-22**: System MUST generate ACORD 127 PDF with driver and vehicle data
- **FR-23**: System MUST generate ACORD 129 if vehicle count exceeds 4
- **FR-24**: System MUST generate ACORD 137 CA for California operations

### Output
- **FR-25**: System MUST generate ZIP file containing all PDFs and uploaded documents
- **FR-26**: System MUST use consistent file naming convention
- **FR-27**: System MUST allow immediate download after generation

### State Management
- **FR-28**: System MUST persist form state to localStorage
- **FR-29**: System MUST restore form state on page reload
- **FR-30**: System MUST validate each stage before allowing progression

---

## Non-Goals (Out of Scope)

- **NG-1**: No FMCSA API integration to auto-populate from DOT number (manual entry for MVP)
- **NG-2**: No carrier routing or submission to carriers (human broker handles submission)
- **NG-3**: No quoting engine or premium calculation
- **NG-4**: No policy dashboard or policy management
- **NG-5**: No MVR (Motor Vehicle Record) verification API integration
- **NG-6**: No real-time safety score lookup
- **NG-7**: No VIN decoder API integration
- **NG-8**: No payment processing
- **NG-9**: No user authentication (single-session form for MVP)
- **NG-10**: No multi-user collaboration on same application

---

## Design Considerations

### Brand Guidelines (Panta)
Follow Panta Brand Guidelines strictly:
- **Primary Color**: Forest Green `#0A3F2F`
- **CTA Color**: Vibrant Green `#22C55E`
- **Background**: Cream White `#F9F7F2`
- **Card Background**: Pure White `#FFFFFE`
- **Borders**: Muted Gold/Beige `#D4C5A6`
- **Typography**: Playfair Display (headings), Inter (body)

### UI Components (ShadCN)
- Use ShadCN UI components exclusively
- Custom-style components to match Panta brand colors
- Buttons: Vibrant Green `#22C55E` for primary actions
- Cards: White with beige borders
- Inputs: White background, beige borders, green focus ring

### User Experience Principles (ICP: "Heavy Haul Hank")
- **Language**: 5th-grade reading level, avoid insurance jargon
- **Speed**: Must complete in under 15 minutes
- **Progress**: Always show progress indicator
- **Mobile**: Must work on phone (truckers are often on the road)
- **Forgiving**: Auto-save, allow going back, "Save & Continue Later"
- **Trust**: Show Panta logo, explain why each question is asked

### Jargon Translation Table

| Insurance Term | Plain English Question |
|---------------|------------------------|
| Radius of Operation | "How far does your truck typically travel one-way?" |
| Loss Runs | "Claims history from your current/last insurance company" |
| Named Insured | "Legal business name" |
| GVW/GCW | "Gross Vehicle Weight (in pounds)" |
| CSL | "Combined Single Limit (total coverage per accident)" |
| Hazmat | "Hazardous materials (chemicals, fuel, explosives)" |
| Telematics | "GPS tracking or electronic logging devices (ELDs)" |
| MVR | "Driving record" |
| Dec Page | "Declarations page (summary page from your current policy)" |

---

## Technical Considerations

### Tech Stack
- **Frontend**: React 18+ with TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS with Panta brand colors
- **Form Management**: React Hook Form with Zod validation
- **State Persistence**: localStorage
- **PDF Generation**: pdf-lib (for filling existing PDF templates)
- **ZIP Generation**: JSZip
- **File Upload**: react-dropzone

### Architecture
```
src/
├── components/
│   ├── ui/                    # ShadCN components
│   ├── intake/
│   │   ├── KnockoutStage.tsx
│   │   ├── RiskClassifierStage.tsx
│   │   ├── SkeletonStage.tsx
│   │   ├── DocumentGateStage.tsx
│   │   ├── VehicleForm.tsx
│   │   ├── DriverForm.tsx
│   │   └── ProgressIndicator.tsx
│   └── pdf/
│       ├── PDFGenerator.tsx
│       └── ZIPPackager.tsx
├── hooks/
│   ├── useIntakeForm.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── acord-mappings.ts      # Field mappings
│   ├── pdf-templates/         # ACORD PDF templates
│   └── validators.ts
├── types/
│   └── intake.ts              # TypeScript interfaces
└── pages/
    └── intake.tsx
```

### ACORD PDF Templates Required
- ACORD 125 (2016/03) - Commercial Insurance Application
- ACORD 127 (2015/12) - Business Auto Section
- ACORD 129 (2009/11) - Vehicle Schedule
- ACORD 137 CA (2015/12) - California Commercial Auto

### Performance Considerations
- Lazy load PDF generation code
- Compress uploaded images before storing
- Debounce localStorage saves (every 2 seconds)
- Show loading states during PDF generation

---

## Success Metrics

- **SM-1**: 90% of users who start the form complete it (measure drop-off by stage)
- **SM-2**: Average completion time under 15 minutes
- **SM-3**: 100% of required ACORD fields populated in generated PDFs
- **SM-4**: Zero "dirty submissions" (missing required data)
- **SM-5**: Underwriter follow-up questions reduced by 80% vs. manual process
- **SM-6**: User satisfaction score > 4.0/5.0 on post-submission survey

---

## Open Questions

1. **File Storage**: Where are uploaded documents stored temporarily during form completion? (localStorage has size limits)
2. **PDF Templates**: Do we have editable ACORD PDF templates, or need to recreate form layout?
3. **E&S Routing**: Should the system display "This will likely be placed in the E&S market" messaging to users?
4. **Cargo Coverage**: Should we include Motor Truck Cargo (ACORD 80) questions in this intake?
5. **California-Specific**: Should we include CARB VIN compliance checking in a future version?

---

## Appendix: Complete ACORD Field Mapping

### ACORD 125 Field Map

| ACORD 125 Field | Page | JSON Path |
|-----------------|------|-----------|
| Named Insured - Name | 1 | business.legalName |
| Named Insured - Mailing Address | 1 | business.mailingAddress |
| Business Phone # | 1 | business.phone |
| FEIN or SOC SEC # | 1 | business.fein |
| Entity Type (checkboxes) | 1 | business.entityType |
| Website Address | 1 | business.website |
| Lines of Business - Truckers | 1 | ✓ (always checked) |
| Lines of Business - Motor Carrier | 1 | ✓ (if own authority) |
| Date Business Started | 2 | business.dateStarted |
| Nature of Business - Service | 2 | ✓ (always checked) |
| Description of Primary Operations | 2 | operations.description + DOT/MC numbers |
| Premises - Street | 2 | business.garagingAddress.street |
| Premises - City, State, ZIP | 2 | business.garagingAddress.* |
| # Full Time Empl | 2 | business.fullTimeEmployees |
| # Part Time Empl | 2 | business.partTimeEmployees |
| Annual Revenues | 2 | business.annualRevenue |
| Q2 - Safety Program | 3 | operations.hasSafetyProgram |
| Q3 - Exposure to chemicals | 3 | riskProfile.hazmat |
| Q5 - Policy cancelled | 3 | knockout.cancelledForNonPayment (No) |
| Q7 - Fraud conviction | 3 | knockout.convictedOfFraud (No) |
| Q9 - Bankruptcy | 3 | knockout.bankruptcyFiled (No) |
| Prior Carrier - Carrier | 3-4 | priorInsurance.carrier |
| Prior Carrier - Policy # | 3-4 | priorInsurance.policyNumber |
| Prior Carrier - Premium | 3-4 | priorInsurance.premium |
| Prior Carrier - Dates | 3-4 | priorInsurance.effectiveDate/expirationDate |
| Loss History - Date of Occurrence | 4 | lossHistory.claims[].dateOfLoss |
| Loss History - Type | 4 | lossHistory.claims[].type |
| Loss History - Amount Paid | 4 | lossHistory.claims[].amountPaid |
| Loss History - Amount Reserved | 4 | lossHistory.claims[].amountReserved |
| Loss History - Claim Open Y/N | 4 | lossHistory.claims[].isOpen |

### ACORD 127 Field Map

| ACORD 127 Field | Page | JSON Path |
|-----------------|------|-----------|
| Driver - Name | 1 | drivers[].name |
| Driver - City, State, ZIP | 1 | drivers[].address |
| Driver - Sex | 1 | drivers[].sex |
| Driver - DOB | 1 | drivers[].dob |
| Driver - Yrs Exp | 1 | drivers[].yearsExperience |
| Driver - Year Lic | 1 | Calculated from yearsExperience |
| Driver - License # | 1 | drivers[].licenseNumber |
| Driver - State | 1 | drivers[].licenseState |
| Driver - Date Hire | 1 | drivers[].dateHired |
| Q3 - Maintenance Program | 2 | operations.hasMaintenanceProgram |
| Q7 - Hazmat | 1 | riskProfile.hazmat |
| Q10 - MVR Verifications | 2 | operations.checksMVRs |
| Q14 - Traffic Violations | 2 | drivers[].violations[] |
| Q17 - Telematics | 2 | operations.hasTelematics |
| Vehicle - Year | 3 | vehicles[].year |
| Vehicle - Make | 3 | vehicles[].make |
| Vehicle - Model | 3 | vehicles[].model |
| Vehicle - V.I.N. | 3 | vehicles[].vin |
| Vehicle - Body Type | 3 | vehicles[].bodyType |
| Vehicle - GVW/GCW | 3 | vehicles[].gvw |
| Vehicle - Radius | 3 | vehicles[].radius |
| Vehicle - Farthest Terminal | 3 | Derived from states of operation |
| Vehicle - Cost New | 3 | vehicles[].statedValue |
| Vehicle - Garaging Address | 3 | vehicles[].garagingAddress |
| Vehicle - For Hire | 3 | vehicles[].forHire |
| Additional Interest - Lienholder | 2 | vehicles[].lienholder |

---

## Checklist

Before finalizing this PRD:

- [x] Asked clarifying questions with lettered options
- [x] Incorporated user's answers (Full E2E, Manual Entry, All Trucking, React+ShadCN)
- [x] User stories are small and specific
- [x] Functional requirements are numbered and unambiguous
- [x] Non-goals section defines clear boundaries
- [x] All ACORD 125 fields mapped
- [x] All ACORD 127 fields mapped
- [x] ACORD 137 CA considered for California
- [x] ICP behaviors incorporated (15-min max, plain language, progress indicator)
- [x] Brand guidelines specified
