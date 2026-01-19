/**
 * ACORD Form Field Mappings
 * Maps SmartIntakeData to ACORD 125, 127, and 129 PDF field names
 *
 * ACORD 125: Commercial Insurance Application
 * ACORD 127: Trucking Application Supplement
 * ACORD 129: Vehicle Schedule Continuation
 */

import type {
  SmartIntakeData,
  Business,
  Driver,
  Vehicle,
  Claim,
  EntityType,
  VehicleBodyType,
  RadiusOfOperation,
  ClaimType,
  ViolationType,
} from '@/types/intake';

// ===========================
// TYPE DEFINITIONS
// ===========================

/**
 * Field mapping result - maps ACORD PDF field name to value
 */
export interface FieldMapping {
  [fieldName: string]: string | number | boolean | undefined;
}

// ===========================
// ACORD 125 FIELD MAP
// ===========================

/**
 * ACORD 125 field name mappings
 * Maps SmartIntakeData paths to ACORD 125 PDF field names
 */
export const ACORD_125_FIELD_MAP = {
  // Named Insured Section
  'NamedInsured': 'business.legalName',
  'DBA': 'business.dba',
  'MailingAddress': 'business.mailingAddress.street',
  'City': 'business.mailingAddress.city',
  'State': 'business.mailingAddress.state',
  'ZIP': 'business.mailingAddress.zip',
  'Phone': 'business.phone',
  'Website': 'business.website',
  'FEIN': 'business.fein',

  // Entity Type Checkboxes
  'Individual': 'business.entityType=individual',
  'Partnership': 'business.entityType=partnership',
  'Corporation': 'business.entityType=corporation',
  'LLC': 'business.entityType=llc',
  'Other': 'business.entityType=other',

  // Business Information
  'YearsInBusiness': 'business.dateStarted',
  'AnnualRevenue': 'business.annualRevenue',
  'FullTimeEmployees': 'business.fullTimeEmployees',
  'PartTimeEmployees': 'business.partTimeEmployees',

  // Operations Description
  'DescriptionOfOperations': 'operations.cargoDescription',
  'DOTNumber': 'business.dotNumber',
  'MCNumber': 'business.mcNumber',

  // Prior Insurance Section
  'CurrentlyInsured': 'priorInsurance.currentlyInsured',
  'PriorCarrier': 'priorInsurance.carrierName',
  'PolicyNumber': 'priorInsurance.policyNumber',
  'EffectiveDate': 'priorInsurance.effectiveDate',
  'ExpirationDate': 'priorInsurance.expirationDate',
  'AnnualPremium': 'priorInsurance.annualPremium',

  // Coverage Requested Section
  'LiabilityLimit': 'coveragePreferences.liabilityLimit',
  'ComprehensiveDeductible': 'coveragePreferences.comprehensiveDeductible',
  'CollisionDeductible': 'coveragePreferences.collisionDeductible',
  'HiredAuto': 'coveragePreferences.hiredAutoCoverage',
  'NonOwnedAuto': 'coveragePreferences.nonOwnedAutoCoverage',

  // Lines of Business Checkboxes
  'Truckers': true, // Always checked for this application
  'MotorCarrier': true, // Always checked for this application

  // Loss History - Up to 5 claims
  'LossClaim1_Date': 'lossHistory.claims[0].dateOfLoss',
  'LossClaim1_Type': 'lossHistory.claims[0].type',
  'LossClaim1_AmountPaid': 'lossHistory.claims[0].amountPaid',
  'LossClaim1_AmountReserved': 'lossHistory.claims[0].amountReserved',
  'LossClaim1_Description': 'lossHistory.claims[0].description',

  'LossClaim2_Date': 'lossHistory.claims[1].dateOfLoss',
  'LossClaim2_Type': 'lossHistory.claims[1].type',
  'LossClaim2_AmountPaid': 'lossHistory.claims[1].amountPaid',
  'LossClaim2_AmountReserved': 'lossHistory.claims[1].amountReserved',
  'LossClaim2_Description': 'lossHistory.claims[1].description',

  'LossClaim3_Date': 'lossHistory.claims[2].dateOfLoss',
  'LossClaim3_Type': 'lossHistory.claims[2].type',
  'LossClaim3_AmountPaid': 'lossHistory.claims[2].amountPaid',
  'LossClaim3_AmountReserved': 'lossHistory.claims[2].amountReserved',
  'LossClaim3_Description': 'lossHistory.claims[2].description',

  'LossClaim4_Date': 'lossHistory.claims[3].dateOfLoss',
  'LossClaim4_Type': 'lossHistory.claims[3].type',
  'LossClaim4_AmountPaid': 'lossHistory.claims[3].amountPaid',
  'LossClaim4_AmountReserved': 'lossHistory.claims[3].amountReserved',
  'LossClaim4_Description': 'lossHistory.claims[3].description',

  'LossClaim5_Date': 'lossHistory.claims[4].dateOfLoss',
  'LossClaim5_Type': 'lossHistory.claims[4].type',
  'LossClaim5_AmountPaid': 'lossHistory.claims[4].amountPaid',
  'LossClaim5_AmountReserved': 'lossHistory.claims[4].amountReserved',
  'LossClaim5_Description': 'lossHistory.claims[4].description',

  // Knockout Questions (all should be "No" since applicant passed screening)
  'AuthorityRevoked': false,
  'SafetyRatingUnsatisfactory': false,
  'DriverLicenseRevoked': false,
  'FraudConviction': false,
  'BankruptcyFiled': false,
  'InsuranceCancelled': false,
} as const;

// ===========================
// ACORD 127 FIELD MAP
// ===========================

/**
 * ACORD 127 field name mappings (Trucking Application Supplement)
 * Includes operations, safety programs, driver schedule, and vehicle schedule
 */
export const ACORD_127_FIELD_MAP = {
  // Named Insured
  'NamedInsured': 'business.legalName',
  'DOTNumber': 'business.dotNumber',
  'MCNumber': 'business.mcNumber',

  // Garaging Address
  'GaragingAddress': 'business.garagingAddress.street',
  'GaragingCity': 'business.garagingAddress.city',
  'GaragingState': 'business.garagingAddress.state',
  'GaragingZIP': 'business.garagingAddress.zip',

  // Operations Questions
  'Q1_InterstateCommerce': 'operations.crossesStateLines',
  'Q2_RadiusOfOperation': 'riskProfile.radius',
  'Q3_MaintenanceProgram': 'operations.hasMaintenanceProgram',
  'Q4_StatesOfOperation': 'operations.statesOfOperation',
  'Q5_CargoTypes': 'riskProfile.cargoTypes',
  'Q6_FleetSize': 'riskProfile.fleetSize',
  'Q7_HazmatCargo': 'riskProfile.hazmat',
  'Q7a_HazmatTypes': 'riskProfile.hazmatTypes',
  'Q8_RefrigeratedCargo': 'riskProfile.refrigeratedCargo',
  'Q8a_ReeferBreakdown': 'riskProfile.reeferBreakdownCoverage',
  'Q9_TrailerInterchange': 'riskProfile.trailerInterchange',
  'Q9a_TrailerCount': 'riskProfile.trailerInterchangeCount',
  'Q9b_TrailerZones': 'riskProfile.trailerInterchangeZones',
  'Q9c_TrailerRadius': 'riskProfile.trailerInterchangeRadius',
  'Q10_ChecksMVRs': 'operations.checksMVRs',
  'Q11_FamilyDrivers': 'operations.familyDrivers',
  'Q12_LeasesOn': 'riskProfile.leasesOnToCarrier',
  'Q12a_MotorCarrier': 'riskProfile.motorCarrierLeasedTo',
  'Q13_NewVenture': 'riskProfile.newVenture',
  'Q14_Accidents3Years': 'riskProfile.accidentsLast3Years',
  'Q15_SafetyProgram': 'operations.hasSafetyProgram',
  'Q15a_SafetyComponents': 'operations.safetyProgramComponents',
  'Q16_SafetyManual': 'operations.safetyProgramComponents',
  'Q17_Telematics': 'operations.hasTelematics',
  'Q17a_TelematicsFeatures': 'operations.telematicsFeatures',
  'Q17b_FleetPercentage': 'operations.telematicsFleetPercentage',

  // Driver Schedule (up to 4 drivers on main form)
  'Driver1_Name': 'drivers[0].fullName',
  'Driver1_DOB': 'drivers[0].dateOfBirth',
  'Driver1_License': 'drivers[0].licenseNumber',
  'Driver1_State': 'drivers[0].licenseState',
  'Driver1_Experience': 'drivers[0].yearsExperience',
  'Driver1_DateHired': 'drivers[0].dateHired',
  'Driver1_Violations': 'drivers[0].violations',
  'Driver1_Accidents': 'drivers[0].accidents',

  'Driver2_Name': 'drivers[1].fullName',
  'Driver2_DOB': 'drivers[1].dateOfBirth',
  'Driver2_License': 'drivers[1].licenseNumber',
  'Driver2_State': 'drivers[1].licenseState',
  'Driver2_Experience': 'drivers[1].yearsExperience',
  'Driver2_DateHired': 'drivers[1].dateHired',
  'Driver2_Violations': 'drivers[1].violations',
  'Driver2_Accidents': 'drivers[1].accidents',

  'Driver3_Name': 'drivers[2].fullName',
  'Driver3_DOB': 'drivers[2].dateOfBirth',
  'Driver3_License': 'drivers[2].licenseNumber',
  'Driver3_State': 'drivers[2].licenseState',
  'Driver3_Experience': 'drivers[2].yearsExperience',
  'Driver3_DateHired': 'drivers[2].dateHired',
  'Driver3_Violations': 'drivers[2].violations',
  'Driver3_Accidents': 'drivers[2].accidents',

  'Driver4_Name': 'drivers[3].fullName',
  'Driver4_DOB': 'drivers[3].dateOfBirth',
  'Driver4_License': 'drivers[3].licenseNumber',
  'Driver4_State': 'drivers[3].licenseState',
  'Driver4_Experience': 'drivers[3].yearsExperience',
  'Driver4_DateHired': 'drivers[3].dateHired',
  'Driver4_Violations': 'drivers[3].violations',
  'Driver4_Accidents': 'drivers[3].accidents',

  // Vehicle Schedule (up to 4 vehicles on main form)
  'Vehicle1_Year': 'vehicles[0].year',
  'Vehicle1_Make': 'vehicles[0].make',
  'Vehicle1_Model': 'vehicles[0].model',
  'Vehicle1_VIN': 'vehicles[0].vin',
  'Vehicle1_BodyType': 'vehicles[0].bodyType',
  'Vehicle1_GVW': 'vehicles[0].gvw',
  'Vehicle1_Value': 'vehicles[0].statedValue',
  'Vehicle1_Radius': 'vehicles[0].radius',
  'Vehicle1_ForHire': 'vehicles[0].forHire',
  'Vehicle1_Garaging': 'vehicles[0].garagingAddress',
  'Vehicle1_Lienholder': 'vehicles[0].lienholder',

  'Vehicle2_Year': 'vehicles[1].year',
  'Vehicle2_Make': 'vehicles[1].make',
  'Vehicle2_Model': 'vehicles[1].model',
  'Vehicle2_VIN': 'vehicles[1].vin',
  'Vehicle2_BodyType': 'vehicles[1].bodyType',
  'Vehicle2_GVW': 'vehicles[1].gvw',
  'Vehicle2_Value': 'vehicles[1].statedValue',
  'Vehicle2_Radius': 'vehicles[1].radius',
  'Vehicle2_ForHire': 'vehicles[1].forHire',
  'Vehicle2_Garaging': 'vehicles[1].garagingAddress',
  'Vehicle2_Lienholder': 'vehicles[1].lienholder',

  'Vehicle3_Year': 'vehicles[2].year',
  'Vehicle3_Make': 'vehicles[2].make',
  'Vehicle3_Model': 'vehicles[2].model',
  'Vehicle3_VIN': 'vehicles[2].vin',
  'Vehicle3_BodyType': 'vehicles[2].bodyType',
  'Vehicle3_GVW': 'vehicles[2].gvw',
  'Vehicle3_Value': 'vehicles[2].statedValue',
  'Vehicle3_Radius': 'vehicles[2].radius',
  'Vehicle3_ForHire': 'vehicles[2].forHire',
  'Vehicle3_Garaging': 'vehicles[2].garagingAddress',
  'Vehicle3_Lienholder': 'vehicles[2].lienholder',

  'Vehicle4_Year': 'vehicles[3].year',
  'Vehicle4_Make': 'vehicles[3].make',
  'Vehicle4_Model': 'vehicles[3].model',
  'Vehicle4_VIN': 'vehicles[3].vin',
  'Vehicle4_BodyType': 'vehicles[3].bodyType',
  'Vehicle4_GVW': 'vehicles[3].gvw',
  'Vehicle4_Value': 'vehicles[3].statedValue',
  'Vehicle4_Radius': 'vehicles[3].radius',
  'Vehicle4_ForHire': 'vehicles[3].forHire',
  'Vehicle4_Garaging': 'vehicles[3].garagingAddress',
  'Vehicle4_Lienholder': 'vehicles[3].lienholder',
} as const;

// ===========================
// ACORD 129 FIELD MAP
// ===========================

/**
 * ACORD 129 field name mappings (Vehicle Schedule Continuation)
 * Used when there are more than 4 vehicles
 */
export const ACORD_129_FIELD_MAP = {
  'NamedInsured': 'business.legalName',
  'PolicyNumber': 'priorInsurance.policyNumber',

  // Continuation vehicles (vehicles 5+)
  // Each page typically holds 10 vehicles
  // Field names follow pattern: VehicleN_FieldName
} as const;

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Format entity type for display
 */
export function formatEntityType(entityType: EntityType | null): string {
  if (!entityType) return '';

  const labels: Record<EntityType, string> = {
    individual: 'Individual/Sole Proprietor',
    partnership: 'Partnership',
    corporation: 'Corporation',
    llc: 'Limited Liability Company (LLC)',
    other: 'Other',
  };

  return labels[entityType] || '';
}

/**
 * Format claim type for display
 */
export function formatClaimType(claimType: ClaimType): string {
  const labels: Record<ClaimType, string> = {
    collision: 'Collision',
    cargo_damage: 'Cargo Damage',
    bodily_injury_liability: 'Bodily Injury Liability',
    property_damage_liability: 'Property Damage Liability',
    comprehensive: 'Comprehensive',
    other: 'Other',
  };

  return labels[claimType] || claimType;
}

/**
 * Format violation type for display
 */
export function formatViolationType(violationType: ViolationType): string {
  const labels: Record<ViolationType, string> = {
    speeding: 'Speeding',
    reckless_driving: 'Reckless Driving',
    dui_dwi: 'DUI/DWI',
    logbook_violation: 'Logbook Violation',
    other: 'Other',
  };

  return labels[violationType] || violationType;
}

/**
 * Format vehicle body type for display
 */
export function formatBodyType(bodyType: VehicleBodyType | null): string {
  if (!bodyType) return '';

  const labels: Record<VehicleBodyType, string> = {
    tractor: 'Tractor',
    straight_truck: 'Straight Truck',
    box_truck: 'Box Truck',
    flatbed: 'Flatbed',
    tanker: 'Tanker',
    dump_truck: 'Dump Truck',
    other: 'Other',
  };

  return labels[bodyType] || '';
}

/**
 * Format radius of operation for display
 */
export function formatRadius(radius: RadiusOfOperation | null): string {
  if (!radius) return '';

  const labels: Record<RadiusOfOperation, string> = {
    local: 'Local (<50 miles)',
    regional: 'Regional (50-200 miles)',
    long_regional: 'Long Regional (200-500 miles)',
    long_haul: 'Long Haul (500+ miles)',
  };

  return labels[radius] || '';
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format liability limit
 */
export function formatLiabilityLimit(limit: string | null, customAmount?: number): string {
  if (!limit) return '';

  if (limit === 'other' && customAmount) {
    return formatCurrency(customAmount);
  }

  const amount = parseInt(limit, 10);
  if (isNaN(amount)) return '';

  // Convert to millions or thousands
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

/**
 * Format deductible amount
 */
export function formatDeductible(deductible: string | null, customAmount?: number): string {
  if (!deductible) return '';

  if (deductible === 'other' && customAmount) {
    return formatCurrency(customAmount);
  }

  return `$${parseInt(deductible, 10).toLocaleString('en-US')}`;
}

/**
 * Format address as single line
 */
export function formatAddress(address: { street: string; city: string; state: string; zip: string } | undefined): string {
  if (!address) return '';
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
}

/**
 * Calculate years in business from date started
 */
export function calculateYearsInBusiness(dateStarted: string): number {
  if (!dateStarted) return 0;

  const startDate = new Date(dateStarted);
  const now = new Date();
  const years = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < startDate.getDate())) {
    return years - 1;
  }

  return years;
}

// ===========================
// MAPPING FUNCTIONS
// ===========================

/**
 * Map SmartIntakeData to ACORD 125 field values
 * Returns object with PDF field names as keys and form values as values
 */
export function mapToAcord125(data: SmartIntakeData): FieldMapping {
  const mapping: FieldMapping = {};

  // Named Insured Section
  mapping['NamedInsured'] = data.business.legalName;
  mapping['DBA'] = data.business.dba || '';
  mapping['MailingAddress'] = data.business.mailingAddress.street;
  mapping['City'] = data.business.mailingAddress.city;
  mapping['State'] = data.business.mailingAddress.state;
  mapping['ZIP'] = data.business.mailingAddress.zip;
  mapping['Phone'] = data.business.phone;
  mapping['Website'] = data.business.website || '';
  mapping['FEIN'] = data.business.fein;

  // Entity Type Checkboxes
  mapping['Individual'] = data.business.entityType === 'individual';
  mapping['Partnership'] = data.business.entityType === 'partnership';
  mapping['Corporation'] = data.business.entityType === 'corporation';
  mapping['LLC'] = data.business.entityType === 'llc';
  mapping['Other'] = data.business.entityType === 'other';

  // Business Information
  mapping['YearsInBusiness'] = calculateYearsInBusiness(data.business.dateStarted);
  mapping['AnnualRevenue'] = formatCurrency(data.business.annualRevenue);
  mapping['FullTimeEmployees'] = data.business.fullTimeEmployees ?? 0;
  mapping['PartTimeEmployees'] = data.business.partTimeEmployees ?? 0;

  // Operations Description
  mapping['DescriptionOfOperations'] = `${data.operations.cargoDescription}\nDOT: ${data.business.dotNumber}${data.business.mcNumber ? ` | MC: ${data.business.mcNumber}` : ''}`;
  mapping['DOTNumber'] = data.business.dotNumber;
  mapping['MCNumber'] = data.business.mcNumber || '';

  // Prior Insurance Section
  mapping['CurrentlyInsured'] = data.priorInsurance.currentlyInsured ? 'Yes' : 'No';
  mapping['PriorCarrier'] = data.priorInsurance.carrierName || '';
  mapping['PolicyNumber'] = data.priorInsurance.policyNumber || '';
  mapping['EffectiveDate'] = data.priorInsurance.effectiveDate || '';
  mapping['ExpirationDate'] = data.priorInsurance.expirationDate || '';
  mapping['AnnualPremium'] = formatCurrency(data.priorInsurance.annualPremium);

  // Coverage Requested Section
  mapping['LiabilityLimit'] = formatLiabilityLimit(
    data.coveragePreferences.liabilityLimit,
    data.coveragePreferences.liabilityLimitOther
  );
  mapping['ComprehensiveDeductible'] = formatDeductible(
    data.coveragePreferences.comprehensiveDeductible,
    data.coveragePreferences.comprehensiveDeductibleOther
  );
  mapping['CollisionDeductible'] = formatDeductible(
    data.coveragePreferences.collisionDeductible,
    data.coveragePreferences.collisionDeductibleOther
  );
  mapping['HiredAuto'] = data.coveragePreferences.hiredAutoCoverage ? 'Yes' : 'No';
  mapping['NonOwnedAuto'] = data.coveragePreferences.nonOwnedAutoCoverage ? 'Yes' : 'No';

  // Lines of Business
  mapping['Truckers'] = true;
  mapping['MotorCarrier'] = true;

  // Loss History (up to 5 claims)
  data.lossHistory.claims.slice(0, 5).forEach((claim: Claim, index: number) => {
    const num = index + 1;
    mapping[`LossClaim${num}_Date`] = claim.dateOfLoss;
    mapping[`LossClaim${num}_Type`] = formatClaimType(claim.type);
    mapping[`LossClaim${num}_AmountPaid`] = formatCurrency(claim.amountPaid);
    mapping[`LossClaim${num}_AmountReserved`] = formatCurrency(claim.amountReserved);
    mapping[`LossClaim${num}_Description`] = claim.description;
  });

  // Knockout Questions (all "No" since applicant passed screening)
  mapping['AuthorityRevoked'] = 'No';
  mapping['SafetyRatingUnsatisfactory'] = 'No';
  mapping['DriverLicenseRevoked'] = 'No';
  mapping['FraudConviction'] = 'No';
  mapping['BankruptcyFiled'] = 'No';
  mapping['InsuranceCancelled'] = 'No';

  return mapping;
}

/**
 * Map SmartIntakeData to ACORD 127 field values
 * Returns object with PDF field names as keys and form values as values
 */
export function mapToAcord127(data: SmartIntakeData): FieldMapping {
  const mapping: FieldMapping = {};

  // Named Insured
  mapping['NamedInsured'] = data.business.legalName;
  mapping['DOTNumber'] = data.business.dotNumber;
  mapping['MCNumber'] = data.business.mcNumber || '';

  // Garaging Address
  const garagingAddress = data.business.garagingAddressDifferent && data.business.garagingAddress
    ? data.business.garagingAddress
    : data.business.mailingAddress;

  mapping['GaragingAddress'] = garagingAddress.street;
  mapping['GaragingCity'] = garagingAddress.city;
  mapping['GaragingState'] = garagingAddress.state;
  mapping['GaragingZIP'] = garagingAddress.zip;

  // Operations Questions
  mapping['Q1_InterstateCommerce'] = data.operations.crossesStateLines ? 'Yes' : 'No';
  mapping['Q2_RadiusOfOperation'] = formatRadius(data.riskProfile.radius);
  mapping['Q3_MaintenanceProgram'] = data.operations.hasMaintenanceProgram ? 'Yes' : 'No';
  mapping['Q4_StatesOfOperation'] = data.operations.statesOfOperation.join(', ');
  mapping['Q5_CargoTypes'] = data.riskProfile.cargoTypes.map(c => c.replace(/_/g, ' ')).join(', ');
  mapping['Q6_FleetSize'] = data.riskProfile.fleetSize ?? 0;
  mapping['Q7_HazmatCargo'] = data.riskProfile.hazmat ? 'Yes' : 'No';
  mapping['Q7a_HazmatTypes'] = data.riskProfile.hazmatTypes.map(h => h.replace(/_/g, ' ')).join(', ');
  mapping['Q8_RefrigeratedCargo'] = data.riskProfile.refrigeratedCargo ? 'Yes' : 'No';
  mapping['Q8a_ReeferBreakdown'] = data.riskProfile.reeferBreakdownCoverage ? 'Yes' : 'No';
  mapping['Q9_TrailerInterchange'] = data.riskProfile.trailerInterchange ? 'Yes' : 'No';
  mapping['Q9a_TrailerCount'] = data.riskProfile.trailerInterchangeCount ?? '';
  mapping['Q9b_TrailerZones'] = data.riskProfile.trailerInterchangeZones ?? '';
  mapping['Q9c_TrailerRadius'] = data.riskProfile.trailerInterchangeRadius ?? '';
  mapping['Q10_ChecksMVRs'] = data.operations.checksMVRs ? 'Yes' : 'No';
  mapping['Q11_FamilyDrivers'] = data.operations.familyDrivers ? 'Yes' : 'No';
  mapping['Q12_LeasesOn'] = data.riskProfile.leasesOnToCarrier ? 'Yes' : 'No';
  mapping['Q12a_MotorCarrier'] = data.riskProfile.motorCarrierLeasedTo ?? '';
  mapping['Q13_NewVenture'] = data.riskProfile.newVenture ? 'Yes' : 'No';
  mapping['Q14_Accidents3Years'] = data.riskProfile.accidentsLast3Years ?? 0;
  mapping['Q15_SafetyProgram'] = data.operations.hasSafetyProgram ? 'Yes' : 'No';
  mapping['Q15a_SafetyComponents'] = data.operations.safetyProgramComponents.map(c => c.replace(/_/g, ' ')).join(', ');
  mapping['Q17_Telematics'] = data.operations.hasTelematics ? 'Yes' : 'No';
  mapping['Q17a_TelematicsFeatures'] = data.operations.telematicsFeatures.map(f => f.replace(/_/g, ' ')).join(', ');
  mapping['Q17b_FleetPercentage'] = data.operations.telematicsFleetPercentage ?? '';

  // Driver Schedule (up to 4 drivers)
  data.drivers.slice(0, 4).forEach((driver: Driver, index: number) => {
    const num = index + 1;
    mapping[`Driver${num}_Name`] = driver.fullName;
    mapping[`Driver${num}_DOB`] = driver.dateOfBirth;
    mapping[`Driver${num}_License`] = driver.licenseNumber;
    mapping[`Driver${num}_State`] = driver.licenseState ?? '';
    mapping[`Driver${num}_Experience`] = driver.yearsExperience ?? '';
    mapping[`Driver${num}_DateHired`] = driver.dateHired;

    // Violations summary
    if (driver.violations.length > 0) {
      const violationsSummary = driver.violations
        .map(v => `${v.date}: ${formatViolationType(v.type)}`)
        .join('; ');
      mapping[`Driver${num}_Violations`] = violationsSummary;
    } else {
      mapping[`Driver${num}_Violations`] = 'None';
    }

    // Accidents summary
    if (driver.accidents.length > 0) {
      const accidentsSummary = driver.accidents
        .map(a => `${a.date}: ${a.description} (${a.atFault ? 'At-Fault' : 'Not At-Fault'})`)
        .join('; ');
      mapping[`Driver${num}_Accidents`] = accidentsSummary;
    } else {
      mapping[`Driver${num}_Accidents`] = 'None';
    }
  });

  // Vehicle Schedule (up to 4 vehicles)
  data.vehicles.slice(0, 4).forEach((vehicle: Vehicle, index: number) => {
    const num = index + 1;
    mapping[`Vehicle${num}_Year`] = vehicle.year ?? '';
    mapping[`Vehicle${num}_Make`] = vehicle.make;
    mapping[`Vehicle${num}_Model`] = vehicle.model;
    mapping[`Vehicle${num}_VIN`] = vehicle.vin;
    mapping[`Vehicle${num}_BodyType`] = formatBodyType(vehicle.bodyType);
    mapping[`Vehicle${num}_GVW`] = vehicle.gvw?.toLocaleString('en-US') ?? '';
    mapping[`Vehicle${num}_Value`] = formatCurrency(vehicle.statedValue);
    mapping[`Vehicle${num}_Radius`] = formatRadius(vehicle.radius);
    mapping[`Vehicle${num}_ForHire`] = vehicle.forHire ? 'Yes' : 'No';

    // Garaging address
    const vehicleGaraging = vehicle.useBusinessGaragingAddress
      ? garagingAddress
      : vehicle.garagingAddress;
    mapping[`Vehicle${num}_Garaging`] = vehicleGaraging ? formatAddress(vehicleGaraging) : '';

    // Lienholder
    if (vehicle.hasLienholder && vehicle.lienholder) {
      mapping[`Vehicle${num}_Lienholder`] = `${vehicle.lienholder.name}, ${formatAddress(vehicle.lienholder.address)}`;
    } else {
      mapping[`Vehicle${num}_Lienholder`] = 'None';
    }
  });

  return mapping;
}

/**
 * Map SmartIntakeData to ACORD 129 field values (Vehicle Schedule Continuation)
 * Only needed if vehicles.length > 4
 * Returns object with PDF field names as keys and form values as values
 */
export function mapToAcord129(data: SmartIntakeData): FieldMapping | null {
  // Only generate if more than 4 vehicles
  if (data.vehicles.length <= 4) {
    return null;
  }

  const mapping: FieldMapping = {};

  // Header information
  mapping['NamedInsured'] = data.business.legalName;
  mapping['PolicyNumber'] = data.priorInsurance.policyNumber || 'TBD';

  // Garaging address for reference
  const garagingAddress = data.business.garagingAddressDifferent && data.business.garagingAddress
    ? data.business.garagingAddress
    : data.business.mailingAddress;

  // Continuation vehicles (vehicles 5+)
  // ACORD 129 typically holds 10 vehicles per page
  const continuationVehicles = data.vehicles.slice(4);

  continuationVehicles.forEach((vehicle: Vehicle, index: number) => {
    const num = index + 5; // Start from vehicle 5
    mapping[`Vehicle${num}_Year`] = vehicle.year ?? '';
    mapping[`Vehicle${num}_Make`] = vehicle.make;
    mapping[`Vehicle${num}_Model`] = vehicle.model;
    mapping[`Vehicle${num}_VIN`] = vehicle.vin;
    mapping[`Vehicle${num}_BodyType`] = formatBodyType(vehicle.bodyType);
    mapping[`Vehicle${num}_GVW`] = vehicle.gvw?.toLocaleString('en-US') ?? '';
    mapping[`Vehicle${num}_Value`] = formatCurrency(vehicle.statedValue);
    mapping[`Vehicle${num}_Radius`] = formatRadius(vehicle.radius);
    mapping[`Vehicle${num}_ForHire`] = vehicle.forHire ? 'Yes' : 'No';

    // Garaging address
    const vehicleGaraging = vehicle.useBusinessGaragingAddress
      ? garagingAddress
      : vehicle.garagingAddress;
    mapping[`Vehicle${num}_Garaging`] = vehicleGaraging ? formatAddress(vehicleGaraging) : '';

    // Lienholder
    if (vehicle.hasLienholder && vehicle.lienholder) {
      mapping[`Vehicle${num}_Lienholder`] = `${vehicle.lienholder.name}, ${formatAddress(vehicle.lienholder.address)}`;
    } else {
      mapping[`Vehicle${num}_Lienholder`] = 'None';
    }
  });

  return mapping;
}

/**
 * Check if ACORD 129 is needed (more than 4 vehicles)
 */
export function needsAcord129(data: SmartIntakeData): boolean {
  return data.vehicles.length > 4;
}
