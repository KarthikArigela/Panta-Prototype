/**
 * Zod validation schemas for Panta Smart Intake Form
 * Provides runtime validation with descriptive error messages
 */

import { z } from 'zod';

// ===========================
// SHARED / REUSABLE SCHEMAS
// ===========================

/**
 * US States enum for validation
 */
export const usStateSchema = z.enum([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC'
], {
  errorMap: () => ({ message: 'Please select a valid US state' })
});

/**
 * Address schema with required fields
 */
export const addressSchema = z.object({
  street: z.string()
    .min(1, 'Street address is required')
    .max(200, 'Street address must be less than 200 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z.string()
    .min(2, 'State is required')
    .max(2, 'State must be a 2-letter code'),
  zip: z.string()
    .min(5, 'ZIP code is required')
    .max(10, 'ZIP code must be 10 characters or less')
    .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format 12345 or 12345-6789'),
  county: z.string().optional(),
});

/**
 * Violation type enum
 */
export const violationTypeSchema = z.enum([
  'speeding',
  'reckless_driving',
  'dui_dwi',
  'logbook_violation',
  'other'
], {
  errorMap: () => ({ message: 'Please select a violation type' })
});

/**
 * Moving violation record schema
 */
export const violationSchema = z.object({
  date: z.string()
    .min(1, 'Violation date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: violationTypeSchema,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  location: z.string().max(200, 'Location must be less than 200 characters').optional(),
});

/**
 * Accident record schema
 */
export const accidentSchema = z.object({
  date: z.string()
    .min(1, 'Accident date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  description: z.string()
    .min(1, 'Accident description is required')
    .max(500, 'Description must be less than 500 characters'),
  atFault: z.boolean({
    required_error: 'Please indicate if driver was at fault',
  }),
  amountPaid: z.number()
    .min(0, 'Amount paid cannot be negative')
    .optional(),
});

/**
 * Claim type enum
 */
export const claimTypeSchema = z.enum([
  'collision',
  'cargo_damage',
  'bodily_injury_liability',
  'property_damage_liability',
  'comprehensive',
  'other'
], {
  errorMap: () => ({ message: 'Please select a claim type' })
});

/**
 * Individual claim record schema
 */
export const claimSchema = z.object({
  dateOfLoss: z.string()
    .min(1, 'Date of loss is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: claimTypeSchema,
  description: z.string()
    .min(1, 'Claim description is required')
    .max(500, 'Description must be less than 500 characters'),
  amountPaid: z.number()
    .min(0, 'Amount paid cannot be negative'),
  amountReserved: z.number()
    .min(0, 'Amount reserved cannot be negative'),
  stillOpen: z.boolean({
    required_error: 'Please indicate if claim is still open',
  }),
});

// ===========================
// KNOCKOUT SCHEMA
// ===========================

/**
 * Knockout questions schema - all 6 boolean fields
 * null values allowed for "not yet answered" state
 */
export const knockoutSchema = z.object({
  authorityRevoked: z.boolean({
    required_error: 'Please answer: Has your operating authority (DOT/MC) ever been revoked or suspended?',
  }).nullable(),
  safetyRatingUnsatisfactory: z.boolean({
    required_error: 'Please answer: Is your current DOT Safety Rating "Unsatisfactory"?',
  }).nullable(),
  driverLicenseRevoked: z.boolean({
    required_error: 'Please answer: Has any driver had their license revoked in the last 5 years?',
  }).nullable(),
  fraudConviction: z.boolean({
    required_error: 'Please answer: Has your business been convicted of fraud?',
  }).nullable(),
  bankruptcyFiled: z.boolean({
    required_error: 'Please answer: Has your business filed for bankruptcy in the last 5 years?',
  }).nullable(),
  insuranceCancelledNonPayment: z.boolean({
    required_error: 'Please answer: Has your insurance been cancelled for non-payment in the last 3 years?',
  }).nullable(),
});

// ===========================
// RISK PROFILE SCHEMA
// ===========================

/**
 * Hazmat type enum
 */
export const hazmatTypeSchema = z.enum([
  'flammables',
  'corrosives',
  'explosives',
  'radioactive',
  'other'
], {
  errorMap: () => ({ message: 'Please select a hazmat type' })
});

/**
 * Cargo type enum
 */
export const cargoTypeSchema = z.enum([
  'general_freight',
  'refrigerated',
  'dry_van',
  'flatbed',
  'tanker',
  'auto_hauler',
  'household_goods',
  'intermodal',
  'oversized',
  'other'
], {
  errorMap: () => ({ message: 'Please select a cargo type' })
});

/**
 * Radius of operation enum
 */
export const radiusOfOperationSchema = z.enum([
  'local',
  'regional',
  'long_regional',
  'long_haul'
], {
  errorMap: () => ({ message: 'Please select a radius of operation' })
});

/**
 * Risk profile schema with conditional hazmatTypes validation
 */
export const riskProfileSchema = z.object({
  hazmat: z.boolean({
    required_error: 'Please indicate if you haul hazardous materials',
  }).nullable(),
  hazmatTypes: z.array(hazmatTypeSchema)
    .default([]),
  radius: radiusOfOperationSchema.nullable(),
  fleetSize: z.number()
    .int('Fleet size must be a whole number')
    .min(1, 'Fleet size must be at least 1')
    .max(1000, 'Fleet size cannot exceed 1000')
    .nullable(),
  cargoTypes: z.array(cargoTypeSchema)
    .default([]),
  leasesOnToCarrier: z.boolean().nullable(),
  motorCarrierLeasedTo: z.string()
    .max(200, 'Motor carrier name must be less than 200 characters')
    .optional(),
  refrigeratedCargo: z.boolean().nullable(),
  reeferBreakdownCoverage: z.boolean().nullable(),
  trailerInterchange: z.boolean().nullable(),
  trailerInterchangeCount: z.number()
    .int('Trailer count must be a whole number')
    .min(1, 'Trailer count must be at least 1')
    .max(100, 'Trailer count cannot exceed 100')
    .optional(),
  trailerInterchangeZones: z.string()
    .max(500, 'Zones must be less than 500 characters')
    .optional(),
  trailerInterchangeRadius: z.number()
    .min(1, 'Radius must be at least 1 mile')
    .max(3000, 'Radius cannot exceed 3000 miles')
    .optional(),
  newVenture: z.boolean().nullable(),
  accidentsLast3Years: z.number()
    .int('Accident count must be a whole number')
    .min(0, 'Accident count cannot be negative')
    .max(100, 'Accident count cannot exceed 100')
    .nullable(),
  esMarketFlags: z.array(z.string())
    .default([]),
}).refine(
  (data) => {
    // If hazmat is true, hazmatTypes should have at least one item
    if (data.hazmat === true) {
      return data.hazmatTypes.length > 0;
    }
    return true;
  },
  {
    message: 'Please select at least one hazmat type when hauling hazardous materials',
    path: ['hazmatTypes'],
  }
).refine(
  (data) => {
    // If leasesOnToCarrier is true, motorCarrierLeasedTo should be provided
    if (data.leasesOnToCarrier === true) {
      return data.motorCarrierLeasedTo && data.motorCarrierLeasedTo.length > 0;
    }
    return true;
  },
  {
    message: 'Please provide the motor carrier you lease to',
    path: ['motorCarrierLeasedTo'],
  }
);

// ===========================
// BUSINESS SCHEMA
// ===========================

/**
 * Entity type enum
 */
export const entityTypeSchema = z.enum([
  'individual',
  'partnership',
  'corporation',
  'llc',
  'other'
], {
  errorMap: () => ({ message: 'Please select a business entity type' })
});

/**
 * FEIN format validation (XX-XXXXXXX)
 */
const feinRegex = /^\d{2}-\d{7}$/;

/**
 * DOT number validation (7 digits)
 */
const dotNumberRegex = /^\d{7}$/;

/**
 * MC number format validation (MC-XXXXXX or XXXXXX)
 */
const mcNumberRegex = /^(MC-?)?\d{1,7}$/;

/**
 * Phone number validation
 */
const phoneRegex = /^[\d\s\-\(\)\.]+$/;

/**
 * Business information schema with format validations
 */
export const businessSchema = z.object({
  legalName: z.string()
    .min(1, 'Legal business name is required')
    .max(200, 'Legal business name must be less than 200 characters'),
  dba: z.string()
    .max(200, 'DBA name must be less than 200 characters')
    .optional(),
  mailingAddress: addressSchema,
  phone: z.string()
    .min(10, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  fein: z.string()
    .min(1, 'Federal Employer Identification Number (FEIN) is required')
    .regex(feinRegex, 'FEIN must be in format XX-XXXXXXX (e.g., 12-3456789)'),
  entityType: entityTypeSchema.nullable(),
  website: z.string()
    .url('Please enter a valid website URL')
    .max(200, 'Website URL must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  dateStarted: z.string()
    .min(1, 'Date business started is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  dotNumber: z.string()
    .min(1, 'USDOT Number is required')
    .regex(dotNumberRegex, 'USDOT Number must be exactly 7 digits'),
  mcNumber: z.string()
    .regex(mcNumberRegex, 'MC Number must be in format MC-XXXXXX or XXXXXX')
    .optional()
    .or(z.literal('')),
  annualRevenue: z.number()
    .min(0, 'Annual revenue cannot be negative')
    .max(1000000000, 'Annual revenue cannot exceed $1 billion')
    .nullable(),
  fullTimeEmployees: z.number()
    .int('Employee count must be a whole number')
    .min(0, 'Employee count cannot be negative')
    .max(10000, 'Employee count cannot exceed 10,000')
    .nullable(),
  partTimeEmployees: z.number()
    .int('Employee count must be a whole number')
    .min(0, 'Employee count cannot be negative')
    .max(10000, 'Employee count cannot exceed 10,000')
    .nullable(),
  garagingAddressDifferent: z.boolean(),
  garagingAddress: addressSchema.optional(),
}).refine(
  (data) => {
    // If garagingAddressDifferent is true, garagingAddress should be provided
    if (data.garagingAddressDifferent === true) {
      return data.garagingAddress !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide the garaging address',
    path: ['garagingAddress'],
  }
);

// ===========================
// OPERATIONS SCHEMA
// ===========================

/**
 * Safety program component enum
 */
export const safetyProgramComponentSchema = z.enum([
  'safety_manual',
  'safety_director',
  'monthly_meetings',
  'osha_compliance'
], {
  errorMap: () => ({ message: 'Please select a valid safety program component' })
});

/**
 * Telematics feature enum
 */
export const telematicsFeatureSchema = z.enum([
  'driver_safety',
  'fuel_tracking',
  'maintenance_alerts',
  'mileage_tracking',
  'gps_tracking'
], {
  errorMap: () => ({ message: 'Please select a valid telematics feature' })
});

/**
 * Operations and safety schema
 */
export const operationsSchema = z.object({
  cargoDescription: z.string()
    .max(1000, 'Cargo description must be less than 1000 characters'),
  statesOfOperation: z.array(usStateSchema)
    .default([]),
  crossesStateLines: z.boolean().nullable(),
  hasSafetyProgram: z.boolean().nullable(),
  safetyProgramComponents: z.array(safetyProgramComponentSchema)
    .default([]),
  hasMaintenanceProgram: z.boolean().nullable(),
  hasTelematics: z.boolean().nullable(),
  telematicsFeatures: z.array(telematicsFeatureSchema)
    .default([]),
  telematicsFleetPercentage: z.number()
    .min(0, 'Fleet percentage cannot be negative')
    .max(100, 'Fleet percentage cannot exceed 100%')
    .nullable(),
  checksMVRs: z.boolean().nullable(),
  familyDrivers: z.boolean().nullable(),
}).refine(
  (data) => {
    // If hasSafetyProgram is true, at least one component should be selected
    if (data.hasSafetyProgram === true) {
      return data.safetyProgramComponents.length > 0;
    }
    return true;
  },
  {
    message: 'Please select at least one safety program component',
    path: ['safetyProgramComponents'],
  }
).refine(
  (data) => {
    // If hasTelematics is true, at least one feature should be selected
    if (data.hasTelematics === true) {
      return data.telematicsFeatures.length > 0;
    }
    return true;
  },
  {
    message: 'Please select at least one telematics feature',
    path: ['telematicsFeatures'],
  }
);

// ===========================
// VEHICLE SCHEMA
// ===========================

/**
 * Vehicle body type enum
 */
export const vehicleBodyTypeSchema = z.enum([
  'tractor',
  'straight_truck',
  'box_truck',
  'flatbed',
  'tanker',
  'dump_truck',
  'other'
], {
  errorMap: () => ({ message: 'Please select a vehicle body type' })
});

/**
 * Vehicle radius enum
 */
export const vehicleRadiusSchema = z.enum([
  'local',
  'regional',
  'long_regional',
  'long_haul'
], {
  errorMap: () => ({ message: 'Please select a vehicle radius' })
});

/**
 * Lienholder schema
 */
export const lienholderSchema = z.object({
  name: z.string()
    .min(1, 'Lienholder name is required')
    .max(200, 'Lienholder name must be less than 200 characters'),
  address: addressSchema,
});

/**
 * VIN validation (17 characters, alphanumeric excluding I, O, Q)
 */
const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;

/**
 * Vehicle schema with VIN validation
 */
export const vehicleSchema = z.object({
  year: z.number()
    .int('Year must be a whole number')
    .min(1990, 'Vehicle year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Vehicle year cannot be in the far future')
    .nullable(),
  make: z.string()
    .max(100, 'Make must be less than 100 characters'),
  model: z.string()
    .max(100, 'Model must be less than 100 characters'),
  vin: z.string()
    .length(17, 'VIN must be exactly 17 characters')
    .regex(vinRegex, 'VIN must be 17 alphanumeric characters (excluding I, O, Q)')
    .or(z.literal('')),
  bodyType: vehicleBodyTypeSchema.nullable(),
  gvw: z.number()
    .min(0, 'GVW cannot be negative')
    .max(200000, 'GVW cannot exceed 200,000 lbs')
    .nullable(),
  statedValue: z.number()
    .min(0, 'Stated value cannot be negative')
    .max(2000000, 'Stated value cannot exceed $2,000,000')
    .nullable(),
  radius: vehicleRadiusSchema.nullable(),
  forHire: z.boolean().nullable(),
  hasLienholder: z.boolean(),
  lienholder: lienholderSchema.optional(),
  garagingAddress: addressSchema.optional(),
  useBusinessGaragingAddress: z.boolean(),
}).refine(
  (data) => {
    // If hasLienholder is true, lienholder info should be provided
    if (data.hasLienholder === true) {
      return data.lienholder !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide lienholder information',
    path: ['lienholder'],
  }
).refine(
  (data) => {
    // If not using business garaging address, custom address should be provided
    if (data.useBusinessGaragingAddress === false) {
      return data.garagingAddress !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide the vehicle garaging address',
    path: ['garagingAddress'],
  }
);

// ===========================
// DRIVER SCHEMA
// ===========================

/**
 * Driver schema with date validations
 */
export const driverSchema = z.object({
  fullName: z.string()
    .min(1, 'Driver name is required')
    .max(200, 'Driver name must be less than 200 characters'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18 && age <= 100;
    }, 'Driver must be between 18 and 100 years old'),
  licenseNumber: z.string()
    .min(1, 'License number is required')
    .max(50, 'License number must be less than 50 characters'),
  licenseState: usStateSchema.nullable(),
  yearsExperience: z.number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(70, 'Years of experience cannot exceed 70')
    .nullable(),
  dateHired: z.string()
    .min(1, 'Date hired is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  hasAccidents: z.boolean(),
  accidents: z.array(accidentSchema)
    .default([]),
  hasViolations: z.boolean(),
  violations: z.array(violationSchema)
    .default([]),
}).refine(
  (data) => {
    // If hasAccidents is true, at least one accident should be provided
    if (data.hasAccidents === true) {
      return data.accidents.length > 0;
    }
    return true;
  },
  {
    message: 'Please provide accident details',
    path: ['accidents'],
  }
).refine(
  (data) => {
    // If hasViolations is true, at least one violation should be provided
    if (data.hasViolations === true) {
      return data.violations.length > 0;
    }
    return true;
  },
  {
    message: 'Please provide violation details',
    path: ['violations'],
  }
);

// ===========================
// PRIOR INSURANCE SCHEMA
// ===========================

/**
 * Shopping reason enum
 */
export const shoppingReasonSchema = z.enum([
  'renewal_coming_up',
  'want_better_rates',
  'need_higher_limits',
  'non_renewed',
  'cancelled',
  'other'
], {
  errorMap: () => ({ message: 'Please select a reason for shopping' })
});

/**
 * Prior insurance schema
 */
export const priorInsuranceSchema = z.object({
  currentlyInsured: z.boolean().nullable(),
  carrierName: z.string()
    .max(200, 'Carrier name must be less than 200 characters')
    .optional(),
  policyNumber: z.string()
    .max(50, 'Policy number must be less than 50 characters')
    .optional(),
  annualPremium: z.number()
    .min(0, 'Annual premium cannot be negative')
    .max(10000000, 'Annual premium cannot exceed $10 million')
    .optional(),
  effectiveDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  expirationDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  shoppingReason: shoppingReasonSchema.optional(),
}).refine(
  (data) => {
    // If currentlyInsured is true, carrier name should be provided
    if (data.currentlyInsured === true) {
      return data.carrierName && data.carrierName.length > 0;
    }
    return true;
  },
  {
    message: 'Please provide your current insurance carrier name',
    path: ['carrierName'],
  }
);

// ===========================
// LOSS HISTORY SCHEMA
// ===========================

/**
 * Loss history schema
 */
export const lossHistorySchema = z.object({
  hasClaims: z.boolean().nullable(),
  claims: z.array(claimSchema)
    .default([]),
}).refine(
  (data) => {
    // If hasClaims is true, at least one claim should be provided
    if (data.hasClaims === true) {
      return data.claims.length > 0;
    }
    return true;
  },
  {
    message: 'Please provide claim details',
    path: ['claims'],
  }
);

// ===========================
// COVERAGE PREFERENCES SCHEMA
// ===========================

/**
 * Liability limit enum
 */
export const liabilityLimitSchema = z.enum([
  '500000',
  '750000',
  '1000000',
  'other'
], {
  errorMap: () => ({ message: 'Please select a liability limit' })
});

/**
 * Deductible amount enum
 */
export const deductibleAmountSchema = z.enum([
  '1000',
  '2500',
  '5000',
  'other'
], {
  errorMap: () => ({ message: 'Please select a deductible amount' })
});

/**
 * Coverage preferences schema
 */
export const coveragePreferencesSchema = z.object({
  liabilityLimit: liabilityLimitSchema.nullable(),
  liabilityLimitOther: z.number()
    .min(100000, 'Liability limit must be at least $100,000')
    .max(10000000, 'Liability limit cannot exceed $10 million')
    .optional(),
  comprehensiveDeductible: deductibleAmountSchema.nullable(),
  comprehensiveDeductibleOther: z.number()
    .min(0, 'Deductible cannot be negative')
    .max(50000, 'Deductible cannot exceed $50,000')
    .optional(),
  collisionDeductible: deductibleAmountSchema.nullable(),
  collisionDeductibleOther: z.number()
    .min(0, 'Deductible cannot be negative')
    .max(50000, 'Deductible cannot exceed $50,000')
    .optional(),
  hiredAutoCoverage: z.boolean().nullable(),
  nonOwnedAutoCoverage: z.boolean().nullable(),
}).refine(
  (data) => {
    // If liabilityLimit is 'other', custom value should be provided
    if (data.liabilityLimit === 'other') {
      return data.liabilityLimitOther !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide a custom liability limit',
    path: ['liabilityLimitOther'],
  }
).refine(
  (data) => {
    // If comprehensiveDeductible is 'other', custom value should be provided
    if (data.comprehensiveDeductible === 'other') {
      return data.comprehensiveDeductibleOther !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide a custom comprehensive deductible',
    path: ['comprehensiveDeductibleOther'],
  }
).refine(
  (data) => {
    // If collisionDeductible is 'other', custom value should be provided
    if (data.collisionDeductible === 'other') {
      return data.collisionDeductibleOther !== undefined;
    }
    return true;
  },
  {
    message: 'Please provide a custom collision deductible',
    path: ['collisionDeductibleOther'],
  }
);

// ===========================
// DOCUMENT UPLOAD SCHEMA
// ===========================

/**
 * Document type enum
 */
export const documentTypeSchema = z.enum([
  'loss_runs',
  'authority_letter',
  'vehicle_schedule',
  'driver_list',
  'current_dec_page',
  'ifta_credentials'
], {
  errorMap: () => ({ message: 'Please select a document type' })
});

/**
 * Uploaded document schema
 */
export const uploadedDocumentSchema = z.object({
  type: documentTypeSchema,
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name must be less than 255 characters'),
  fileSize: z.number()
    .min(1, 'File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size cannot exceed 10MB'),
  mimeType: z.string()
    .refine(
      (type) => ['application/pdf', 'image/jpeg', 'image/png'].includes(type),
      'File must be PDF, JPG, or PNG'
    ),
  uploadedAt: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, 'Invalid timestamp format'),
  fileReference: z.string().optional(),
});

// ===========================
// MAIN SMART INTAKE SCHEMA
// ===========================

/**
 * Complete Smart Intake form schema
 * Combines all sub-schemas for full form validation
 */
export const smartIntakeSchema = z.object({
  knockout: knockoutSchema,
  riskProfile: riskProfileSchema,
  business: businessSchema,
  operations: operationsSchema,
  vehicles: z.array(vehicleSchema)
    .default([]),
  drivers: z.array(driverSchema)
    .default([]),
  priorInsurance: priorInsuranceSchema,
  lossHistory: lossHistorySchema,
  coveragePreferences: coveragePreferencesSchema,
  documents: z.array(uploadedDocumentSchema)
    .default([]),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type AddressInput = z.infer<typeof addressSchema>;
export type ViolationInput = z.infer<typeof violationSchema>;
export type AccidentInput = z.infer<typeof accidentSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type KnockoutInput = z.infer<typeof knockoutSchema>;
export type RiskProfileInput = z.infer<typeof riskProfileSchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
export type OperationsInput = z.infer<typeof operationsSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type DriverInput = z.infer<typeof driverSchema>;
export type PriorInsuranceInput = z.infer<typeof priorInsuranceSchema>;
export type LossHistoryInput = z.infer<typeof lossHistorySchema>;
export type CoveragePreferencesInput = z.infer<typeof coveragePreferencesSchema>;
export type UploadedDocumentInput = z.infer<typeof uploadedDocumentSchema>;
export type SmartIntakeInput = z.infer<typeof smartIntakeSchema>;

// ===========================
// STAGE VALIDATION HELPERS
// ===========================

/**
 * Validates knockout stage - returns true if all questions answered and none are "yes"
 */
export function validateKnockoutStage(data: KnockoutInput): { valid: boolean; knockedOut: boolean; errors: string[] } {
  const result = knockoutSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      knockedOut: false,
      errors: result.error.errors.map(e => e.message),
    };
  }

  const knockout = result.data;
  const allAnswered = Object.values(knockout).every(v => v !== null);

  if (!allAnswered) {
    return {
      valid: false,
      knockedOut: false,
      errors: ['Please answer all screening questions'],
    };
  }

  const knockedOut = Object.values(knockout).some(v => v === true);

  return {
    valid: !knockedOut,
    knockedOut,
    errors: knockedOut ? ['Based on your answers, we cannot provide an online quote. Please call us to discuss your options.'] : [],
  };
}

/**
 * Validates risk profile stage
 */
export function validateRiskProfileStage(data: RiskProfileInput): { valid: boolean; errors: string[] } {
  const result = riskProfileSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => e.message),
    };
  }

  // Check required fields for stage completion
  const profile = result.data;
  const requiredFields = [
    profile.hazmat !== null,
    profile.radius !== null,
    profile.fleetSize !== null,
    profile.cargoTypes.length > 0,
  ];

  if (!requiredFields.every(Boolean)) {
    return {
      valid: false,
      errors: ['Please complete all risk profile questions'],
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Validates business details stage
 */
export function validateBusinessStage(data: BusinessInput): { valid: boolean; errors: string[] } {
  const result = businessSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => e.message),
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Validates full form for submission
 */
export function validateSmartIntake(data: SmartIntakeInput): { valid: boolean; errors: z.ZodError | null } {
  const result = smartIntakeSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error,
    };
  }

  return { valid: true, errors: null };
}
