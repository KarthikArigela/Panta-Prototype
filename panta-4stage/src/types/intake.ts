/**
 * TypeScript interfaces for Panta Smart Intake Form
 * Maps to ACORD 125, 127, and 129 insurance forms
 */

// ===========================
// SHARED / REUSABLE INTERFACES
// ===========================

/**
 * Address interface for reuse across business, vehicles, and lienholders
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
}

/**
 * Violation types for driver records
 */
export type ViolationType =
  | 'speeding'
  | 'reckless_driving'
  | 'dui_dwi'
  | 'logbook_violation'
  | 'other';

/**
 * Moving violation record for driver
 */
export interface Violation {
  date: string;
  type: ViolationType;
  description?: string;
  location?: string;
}

/**
 * Accident record for driver
 */
export interface Accident {
  date: string;
  description: string;
  atFault: boolean;
  amountPaid?: number;
}

/**
 * Claim types for loss history
 */
export type ClaimType =
  | 'collision'
  | 'cargo_damage'
  | 'bodily_injury_liability'
  | 'property_damage_liability'
  | 'comprehensive'
  | 'other';

/**
 * Individual claim record
 */
export interface Claim {
  dateOfLoss: string;
  type: ClaimType;
  description: string;
  amountPaid: number;
  amountReserved: number;
  stillOpen: boolean;
}

// ===========================
// KNOCKOUT INTERFACE
// ===========================

/**
 * Knockout questions - if any are true, applicant cannot proceed
 */
export interface Knockout {
  /** Has operating authority (DOT/MC) ever been revoked or suspended? */
  authorityRevoked: boolean | null;
  /** Is current DOT Safety Rating 'Unsatisfactory'? */
  safetyRatingUnsatisfactory: boolean | null;
  /** Any driver had license revoked in last 5 years? */
  driverLicenseRevoked: boolean | null;
  /** Business been convicted of fraud? */
  fraudConviction: boolean | null;
  /** Filed for bankruptcy in last 5 years? */
  bankruptcyFiled: boolean | null;
  /** Had insurance cancelled for non-payment in last 3 years? */
  insuranceCancelledNonPayment: boolean | null;
}

// ===========================
// RISK PROFILE INTERFACE
// ===========================

/**
 * Hazmat types that require special coverage
 */
export type HazmatType =
  | 'flammables'
  | 'corrosives'
  | 'explosives'
  | 'radioactive'
  | 'other';

/**
 * Cargo types the trucking company hauls
 */
export type CargoType =
  | 'general_freight'
  | 'refrigerated'
  | 'dry_van'
  | 'flatbed'
  | 'tanker'
  | 'auto_hauler'
  | 'household_goods'
  | 'intermodal'
  | 'oversized'
  | 'other';

/**
 * Radius of operation categories
 */
export type RadiusOfOperation = 'local' | 'regional' | 'long_regional' | 'long_haul';

/**
 * Risk classifier data - determines Standard vs E&S market
 */
export interface RiskProfile {
  /** Does applicant haul hazardous materials? */
  hazmat: boolean | null;
  /** Types of hazmat if applicable */
  hazmatTypes: HazmatType[];
  /** Farthest distance trucks travel from home base */
  radius: RadiusOfOperation | null;
  /** Total number of power units (trucks/tractors) */
  fleetSize: number | null;
  /** Primary cargo types */
  cargoTypes: CargoType[];
  /** Does applicant lease on to another carrier? */
  leasesOnToCarrier: boolean | null;
  /** Motor carrier leased to (if applicable) */
  motorCarrierLeasedTo?: string;
  /** Hauls refrigerated cargo requiring reefer coverage? */
  refrigeratedCargo: boolean | null;
  /** Needs reefer breakdown coverage? */
  reeferBreakdownCoverage: boolean | null;
  /** Uses trailer interchange? */
  trailerInterchange: boolean | null;
  /** Number of trailers in interchange (if applicable) */
  trailerInterchangeCount?: number;
  /** Trailer interchange zones */
  trailerInterchangeZones?: string;
  /** Trailer interchange radius in miles */
  trailerInterchangeRadius?: number;
  /** Is this a new venture (less than 3 years in business)? */
  newVenture: boolean | null;
  /** Number of accidents in last 3 years */
  accidentsLast3Years: number | null;
  /** Flags for E&S market placement */
  esMarketFlags: string[];
}

// ===========================
// BUSINESS INTERFACE
// ===========================

/**
 * Entity/tax structure types
 */
export type EntityType =
  | 'individual'
  | 'partnership'
  | 'corporation'
  | 'llc'
  | 'other';

/**
 * Business information - maps to ACORD 125 named insured section
 */
export interface Business {
  /** Legal business name as on tax documents */
  legalName: string;
  /** DBA (Doing Business As) name if different */
  dba?: string;
  /** Business mailing address */
  mailingAddress: Address;
  /** Primary business phone number */
  phone: string;
  /** Federal Employer Identification Number (XX-XXXXXXX) */
  fein: string;
  /** Business entity type */
  entityType: EntityType | null;
  /** Business website (optional) */
  website?: string;
  /** Date business started operations */
  dateStarted: string;
  /** USDOT Number (7 digits) */
  dotNumber: string;
  /** MC Number (optional, format MC-XXXXXX) */
  mcNumber?: string;
  /** Annual gross revenue in dollars */
  annualRevenue: number | null;
  /** Number of full-time employees */
  fullTimeEmployees: number | null;
  /** Number of part-time employees */
  partTimeEmployees: number | null;
  /** Is garaging address different from mailing? */
  garagingAddressDifferent: boolean;
  /** Garaging address if different from mailing */
  garagingAddress?: Address;
}

// ===========================
// OPERATIONS INTERFACE
// ===========================

/**
 * Safety program components
 */
export type SafetyProgramComponent =
  | 'safety_manual'
  | 'safety_director'
  | 'monthly_meetings'
  | 'osha_compliance';

/**
 * Telematics/ELD features in use
 */
export type TelematicsFeature =
  | 'driver_safety'
  | 'fuel_tracking'
  | 'maintenance_alerts'
  | 'mileage_tracking'
  | 'gps_tracking';

/**
 * US States for operations
 */
export type USState =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY'
  | 'DC';

/**
 * Operations and safety information - maps to ACORD 127 questions
 */
export interface Operations {
  /** Description of cargo/operations */
  cargoDescription: string;
  /** States where vehicles operate */
  statesOfOperation: USState[];
  /** Crosses state lines (interstate commerce)? */
  crossesStateLines: boolean | null;
  /** Has written safety program? */
  hasSafetyProgram: boolean | null;
  /** Components of safety program if applicable */
  safetyProgramComponents: SafetyProgramComponent[];
  /** Has vehicle maintenance program? */
  hasMaintenanceProgram: boolean | null;
  /** Uses telematics/ELD? */
  hasTelematics: boolean | null;
  /** Telematics features in use */
  telematicsFeatures: TelematicsFeature[];
  /** Percentage of fleet with telematics (0-100) */
  telematicsFleetPercentage: number | null;
  /** Checks MVRs before hiring? */
  checksMVRs: boolean | null;
  /** Has family members as drivers? */
  familyDrivers: boolean | null;
}

// ===========================
// VEHICLE INTERFACE
// ===========================

/**
 * Vehicle body types
 */
export type VehicleBodyType =
  | 'tractor'
  | 'straight_truck'
  | 'box_truck'
  | 'flatbed'
  | 'tanker'
  | 'dump_truck'
  | 'other';

/**
 * Vehicle radius categories (for individual vehicle)
 */
export type VehicleRadius = 'local' | 'regional' | 'long_regional' | 'long_haul';

/**
 * Lienholder information
 */
export interface Lienholder {
  name: string;
  address: Address;
}

/**
 * Individual vehicle record - maps to ACORD 127 vehicle schedule
 */
export interface Vehicle {
  /** Vehicle year (1990-current) */
  year: number | null;
  /** Vehicle make (e.g., Freightliner, Peterbilt) */
  make: string;
  /** Vehicle model */
  model: string;
  /** Vehicle Identification Number (17 characters) */
  vin: string;
  /** Body type */
  bodyType: VehicleBodyType | null;
  /** Gross Vehicle Weight in pounds */
  gvw: number | null;
  /** Stated/insured value in dollars */
  statedValue: number | null;
  /** Operating radius for this vehicle */
  radius: VehicleRadius | null;
  /** Vehicle is used for hire? */
  forHire: boolean | null;
  /** Does vehicle have a lienholder? */
  hasLienholder: boolean;
  /** Lienholder information if applicable */
  lienholder?: Lienholder;
  /** Garaging address (defaults to business address) */
  garagingAddress?: Address;
  /** Use business garaging address? */
  useBusinessGaragingAddress: boolean;
  /** VIN pending - will provide later? */
  vinPending?: boolean;
}

// ===========================
// DRIVER INTERFACE
// ===========================

/**
 * Individual driver record - maps to ACORD 127 driver schedule
 */
export interface Driver {
  /** Driver's full legal name */
  fullName: string;
  /** Date of birth (YYYY-MM-DD) */
  dateOfBirth: string;
  /** Driver's license number */
  licenseNumber: string;
  /** State that issued the license */
  licenseState: USState | null;
  /** Years of CDL experience */
  yearsExperience: number | null;
  /** Date hired by this company */
  dateHired: string;
  /** Has had accidents in last 3 years? */
  hasAccidents: boolean;
  /** Accident records if applicable */
  accidents: Accident[];
  /** Has had moving violations in last 3 years? */
  hasViolations: boolean;
  /** Violation records if applicable */
  violations: Violation[];
}

// ===========================
// PRIOR INSURANCE INTERFACE
// ===========================

/**
 * Reason for shopping for new insurance
 */
export type ShoppingReason =
  | 'renewal_coming_up'
  | 'want_better_rates'
  | 'need_higher_limits'
  | 'non_renewed'
  | 'cancelled'
  | 'other';

/**
 * Prior insurance information - maps to ACORD 125 prior carrier section
 */
export interface PriorInsurance {
  /** Currently has insurance? */
  currentlyInsured: boolean | null;
  /** Current/prior carrier name */
  carrierName?: string;
  /** Policy number */
  policyNumber?: string;
  /** Annual premium in dollars */
  annualPremium?: number;
  /** Policy effective date */
  effectiveDate?: string;
  /** Policy expiration date */
  expirationDate?: string;
  /** Reason for shopping */
  shoppingReason?: ShoppingReason;
}

// ===========================
// LOSS HISTORY INTERFACE
// ===========================

/**
 * Loss/claims history - maps to ACORD 125 loss history section
 */
export interface LossHistory {
  /** Has had claims in last 5 years? */
  hasClaims: boolean | null;
  /** Individual claim records */
  claims: Claim[];
}

// ===========================
// COVERAGE PREFERENCES INTERFACE
// ===========================

/**
 * Standard liability limit options
 */
export type LiabilityLimit =
  | '500000'
  | '750000'
  | '1000000'
  | 'other';

/**
 * Standard deductible options
 */
export type DeductibleAmount =
  | '1000'
  | '2500'
  | '5000'
  | 'other';

/**
 * Coverage preferences - what coverage limits and options the applicant wants
 */
export interface CoveragePreferences {
  /** Desired liability limit (CSL) */
  liabilityLimit: LiabilityLimit | null;
  /** Custom liability limit if 'other' selected */
  liabilityLimitOther?: number;
  /** Comprehensive deductible */
  comprehensiveDeductible: DeductibleAmount | null;
  /** Custom comprehensive deductible if 'other' selected */
  comprehensiveDeductibleOther?: number;
  /** Collision deductible */
  collisionDeductible: DeductibleAmount | null;
  /** Custom collision deductible if 'other' selected */
  collisionDeductibleOther?: number;
  /** Wants hired auto coverage? */
  hiredAutoCoverage: boolean | null;
  /** Wants non-owned auto coverage? */
  nonOwnedAutoCoverage: boolean | null;
}

// ===========================
// DOCUMENT UPLOADS INTERFACE
// ===========================

/**
 * Document type identifiers
 */
export type DocumentType =
  | 'loss_runs'
  | 'authority_letter'
  | 'vehicle_schedule'
  | 'driver_list'
  | 'current_dec_page'
  | 'ifta_credentials';

/**
 * Uploaded document metadata
 */
export interface UploadedDocument {
  /** Document type */
  type: DocumentType;
  /** Original filename */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type */
  mimeType: string;
  /** Upload timestamp */
  uploadedAt: string;
  /** File reference (for storage) */
  fileReference?: string;
}

// ===========================
// MAIN SMART INTAKE DATA INTERFACE
// ===========================

/**
 * Complete Smart Intake form data structure
 * This is the main interface combining all form sections
 */
export interface SmartIntakeData {
  /** Knockout screening questions */
  knockout: Knockout;
  /** Risk classification profile */
  riskProfile: RiskProfile;
  /** Business/company information */
  business: Business;
  /** Operations and safety information */
  operations: Operations;
  /** List of vehicles to be insured */
  vehicles: Vehicle[];
  /** List of drivers */
  drivers: Driver[];
  /** Prior insurance information */
  priorInsurance: PriorInsurance;
  /** Loss/claims history */
  lossHistory: LossHistory;
  /** Coverage preferences */
  coveragePreferences: CoveragePreferences;
  /** Uploaded documents */
  documents: UploadedDocument[];
}

// ===========================
// FORM STATE HELPERS
// ===========================

/**
 * Stage configuration for the multi-step form
 */
export interface StageConfig {
  id: number;
  label: string;
  icon: string;
}

/**
 * Props for stage components
 */
export interface StageProps<T> {
  data: T;
  onChange: (data: T) => void;
}

/**
 * Demo default values for prototype - Pre-filled with Heavy Haul Hank's data
 * This allows founders to navigate the prototype without entering data
 */

// Stage 1: Knockout - All "No" (passing answers)
export const defaultKnockout: Knockout = {
  authorityRevoked: false,
  safetyRatingUnsatisfactory: false,
  driverLicenseRevoked: false,
  fraudConviction: false,
  bankruptcyFiled: false,
  insuranceCancelledNonPayment: false,
};

export const defaultAddress: Address = {
  street: '2847 Industrial Blvd',
  city: 'Fresno',
  state: 'CA',
  zip: '93650',
};

// Stage 2: Risk Profile - Heavy Haul Hank's profile
export const defaultRiskProfile: RiskProfile = {
  hazmat: false,
  hazmatTypes: [],
  radius: 'long_haul',
  fleetSize: 3,
  cargoTypes: ['flatbed', 'oversized'],
  leasesOnToCarrier: false,
  refrigeratedCargo: false,
  reeferBreakdownCoverage: false,
  trailerInterchange: false,
  newVenture: false,
  accidentsLast3Years: 2,
  esMarketFlags: [],
};

// Stage 3: Business Information
export const defaultBusiness: Business = {
  legalName: "Heavy Haul Hank's Trucking LLC",
  mailingAddress: { ...defaultAddress },
  phone: '(559) 234-5678',
  fein: '45-6789123',
  entityType: 'llc',
  dateStarted: '2015-03-15',
  dotNumber: '3847591',
  mcNumber: 'MC-847591',
  annualRevenue: 525000,
  fullTimeEmployees: 2,
  partTimeEmployees: 0,
  garagingAddressDifferent: false,
};

// Stage 3: Operations & Safety
export const defaultOperations: Operations = {
  cargoDescription: 'Heavy machinery, industrial equipment, construction equipment. Oversized loads over 80,000 lbs.',
  statesOfOperation: ['CA', 'AZ', 'OR'],
  crossesStateLines: true,
  hasSafetyProgram: false,
  safetyProgramComponents: [],
  hasMaintenanceProgram: true,
  hasTelematics: true,
  telematicsFeatures: ['gps_tracking', 'maintenance_alerts'],
  telematicsFleetPercentage: 100,
  checksMVRs: true,
  familyDrivers: false,
};

// Default empty vehicle (for adding new ones)
export const defaultVehicle: Vehicle = {
  year: null,
  make: '',
  model: '',
  vin: '',
  bodyType: null,
  gvw: null,
  statedValue: null,
  radius: null,
  forHire: null,
  hasLienholder: false,
  useBusinessGaragingAddress: true,
};

// Demo vehicles - Hank's trucks
const demoVehicle1: Vehicle = {
  year: 2019,
  make: 'Peterbilt',
  model: '579',
  vin: '1XPFR8XK7PR123456',
  bodyType: 'tractor',
  gvw: 80000,
  statedValue: 180000,
  radius: 'long_haul',
  forHire: true,
  hasLienholder: false,
  useBusinessGaragingAddress: true,
};

const demoVehicle2: Vehicle = {
  year: 2017,
  make: 'Freightliner',
  model: 'Cascadia',
  vin: '1XPFR8XK7PR789012',
  bodyType: 'tractor',
  gvw: 80000,
  statedValue: 150000,
  radius: 'long_haul',
  forHire: true,
  hasLienholder: false,
  useBusinessGaragingAddress: true,
};

// Default empty driver (for adding new ones)
export const defaultDriver: Driver = {
  fullName: '',
  dateOfBirth: '',
  licenseNumber: '',
  licenseState: null,
  yearsExperience: null,
  dateHired: '',
  hasAccidents: false,
  accidents: [],
  hasViolations: false,
  violations: [],
};

// Demo driver - Mike Johnson
const demoDriver1: Driver = {
  fullName: 'Mike Johnson',
  dateOfBirth: '1985-06-15',
  licenseNumber: 'D1234567',
  licenseState: 'CA',
  yearsExperience: 8,
  dateHired: '2018-01-10',
  hasAccidents: false,
  accidents: [],
  hasViolations: false,
  violations: [],
};

// Stage 3: Prior Insurance
export const defaultPriorInsurance: PriorInsurance = {
  currentlyInsured: true,
  carrierName: 'Progressive Commercial',
  policyNumber: 'PC-987654321',
  annualPremium: 28000,
  effectiveDate: '2024-01-15',
  expirationDate: '2025-01-15',
  shoppingReason: 'non_renewed',
};

// Stage 3: Loss History with 2 claims
export const defaultLossHistory: LossHistory = {
  hasClaims: true,
  claims: [
    {
      dateOfLoss: '2024-03-15',
      type: 'collision',
      description: 'Rear-end collision at intersection. Other driver ran red light. Not our fault. Minor damage to trailer. Claim resolved.',
      amountPaid: 5000,
      amountReserved: 0,
      stillOpen: false,
    },
    {
      dateOfLoss: '2024-06-22',
      type: 'collision',
      description: 'Side-swipe collision on highway. Other vehicle changed lanes into us. Not at fault. Minor damage to cab. Resolved.',
      amountPaid: 3500,
      amountReserved: 0,
      stillOpen: false,
    },
  ],
};

// Stage 3: Coverage Preferences
export const defaultCoveragePreferences: CoveragePreferences = {
  liabilityLimit: '1000000',
  comprehensiveDeductible: '2500',
  collisionDeductible: '2500',
  hiredAutoCoverage: false,
  nonOwnedAutoCoverage: false,
};

// Complete demo data for the prototype
export const defaultSmartIntakeData: SmartIntakeData = {
  knockout: { ...defaultKnockout },
  riskProfile: { ...defaultRiskProfile },
  business: { ...defaultBusiness },
  operations: { ...defaultOperations },
  vehicles: [demoVehicle1, demoVehicle2],
  drivers: [demoDriver1],
  priorInsurance: { ...defaultPriorInsurance },
  lossHistory: { ...defaultLossHistory },
  coveragePreferences: { ...defaultCoveragePreferences },
  documents: [],
};

