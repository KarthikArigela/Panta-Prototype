/**
 * Central hook for managing the Smart Intake form state across all 4 stages.
 * Uses React Hook Form with Zod validation and localStorage persistence.
 */

'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SmartIntakeData,
  defaultSmartIntakeData,
} from '@/types/intake';
import {
  smartIntakeSchema,
  knockoutSchema,
  riskProfileSchema,
  businessSchema,
  operationsSchema,
  validateKnockoutStage,
} from '@/lib/validators';
import { useLocalStorageState, clearLocalStorageKey, hasLocalStorageKey } from './useLocalStorage';

/**
 * Storage key for persisting intake form data
 */
const STORAGE_KEY = 'panta-smart-intake';

/**
 * Total number of stages in the intake form
 */
const TOTAL_STAGES = 4;

/**
 * Stage definitions for display
 */
export const STAGE_CONFIG = [
  { id: 1, label: 'Quick Questions', description: 'A few screening questions' },
  { id: 2, label: 'Your Risk Profile', description: 'Tell us about your operations' },
  { id: 3, label: 'Business Details', description: 'Company and coverage information' },
  { id: 4, label: 'Upload Documents', description: 'Required documents for your quote' },
] as const;

/**
 * Return type for the useIntakeForm hook
 */
export interface UseIntakeFormReturn {
  /** React Hook Form methods */
  form: UseFormReturn<SmartIntakeData>;
  /** Current stage (1-4) */
  currentStage: number;
  /** Total number of stages */
  totalStages: number;
  /** Whether form has been restored from localStorage */
  hasRestoredState: boolean;
  /** Whether the applicant has been knocked out */
  isKnockedOut: boolean;
  /** Navigate to next stage */
  goToNextStage: () => boolean;
  /** Navigate to previous stage */
  goToPrevStage: () => boolean;
  /** Go to a specific stage (must be <= current progress) */
  goToStage: (stage: number) => boolean;
  /** Check if user can proceed from current stage */
  canProceed: () => boolean;
  /** Get validation errors for current stage */
  getStageErrors: () => string[];
  /** Reset the entire form with optional confirmation */
  resetForm: (skipConfirmation?: boolean) => boolean;
  /** Save current state immediately (bypasses debounce) */
  saveNow: () => void;
  /** Check if there's saved progress */
  hasSavedProgress: () => boolean;
  /** Continue from saved progress */
  continueFromSaved: () => void;
  /** Start fresh (discard saved progress) */
  startFresh: () => void;
}

/**
 * Hook for managing the Smart Intake form state across all 4 stages.
 *
 * Features:
 * - React Hook Form integration with Zod validation
 * - Automatic localStorage persistence
 * - Stage-based validation
 * - Navigation between stages
 * - Knockout logic for screening
 * - Form reset with confirmation
 *
 * @example
 * ```tsx
 * function IntakeForm() {
 *   const {
 *     form,
 *     currentStage,
 *     goToNextStage,
 *     goToPrevStage,
 *     canProceed,
 *   } = useIntakeForm();
 *
 *   return (
 *     <form>
 *       {currentStage === 1 && <KnockoutStage form={form} />}
 *       {currentStage === 2 && <RiskProfileStage form={form} />}
 *       // ...etc
 *     </form>
 *   );
 * }
 * ```
 */
export function useIntakeForm(): UseIntakeFormReturn {
  // Stage state
  const [currentStage, setCurrentStage] = useState(1);
  const [hasRestoredState, setHasRestoredState] = useState(false);
  const [isKnockedOut, setIsKnockedOut] = useState(false);

  // localStorage persistence for form data
  const [storedData, setStoredData] = useLocalStorageState<SmartIntakeData>(
    STORAGE_KEY,
    defaultSmartIntakeData
  );

  // React Hook Form setup with Zod resolver
  // Using SmartIntakeData type which aligns with our TypeScript interfaces
  // The zodResolver will validate against smartIntakeSchema
  const form = useForm<SmartIntakeData>({
    resolver: zodResolver(smartIntakeSchema) as never,
    defaultValues: storedData,
    mode: 'onChange',
  });

  // Watch form values for persistence
  const watchedValues = form.watch();

  // Track last saved values to prevent infinite loops
  const lastSavedRef = useRef<string>(JSON.stringify(storedData));

  // Persist form values to localStorage when they change
  useEffect(() => {
    // Only persist if we have meaningful changes (not just initial render)
    if (hasRestoredState || currentStage > 1) {
      const currentSerialized = JSON.stringify(watchedValues);
      // Only save if values actually changed
      if (currentSerialized !== lastSavedRef.current) {
        lastSavedRef.current = currentSerialized;
        setStoredData(watchedValues);
      }
    }
  }, [watchedValues, setStoredData, hasRestoredState, currentStage]);

  // Restore saved state on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && hasLocalStorageKey(STORAGE_KEY)) {
      // Reset form with stored values
      form.reset(storedData);
      setHasRestoredState(true);

      // Check knockout status
      const knockoutResult = validateKnockoutStage(storedData.knockout);
      setIsKnockedOut(knockoutResult.knockedOut);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Monitor knockout state changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only check knockout when knockout fields change
      if (name?.startsWith('knockout')) {
        const knockout = value.knockout;
        if (knockout) {
          const hasKnockout = Object.values(knockout).some(v => v === true);
          setIsKnockedOut(hasKnockout);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  /**
   * Validate current stage fields
   */
  const validateCurrentStage = useCallback((): { valid: boolean; errors: string[] } => {
    const values = form.getValues();

    switch (currentStage) {
      case 1: {
        // Stage 1: Knockout questions
        const result = knockoutSchema.safeParse(values.knockout);
        if (!result.success) {
          return {
            valid: false,
            errors: result.error.errors.map(e => e.message),
          };
        }

        // All knockout questions must be answered
        const knockout = values.knockout;
        const allAnswered = Object.values(knockout).every(v => v !== null);
        if (!allAnswered) {
          return {
            valid: false,
            errors: ['Please answer all screening questions'],
          };
        }

        // Check if any knockout conditions are met (applicant is knocked out)
        const knockedOut = Object.values(knockout).some(v => v === true);
        if (knockedOut) {
          return {
            valid: false,
            errors: ['Based on your answers, we cannot provide an online quote. Please call us to discuss your options.'],
          };
        }

        return { valid: true, errors: [] };
      }

      case 2: {
        // Stage 2: Risk Profile
        const result = riskProfileSchema.safeParse(values.riskProfile);
        if (!result.success) {
          return {
            valid: false,
            errors: result.error.errors.map(e => e.message),
          };
        }

        // Check required fields for stage completion
        const profile = values.riskProfile;
        const missingFields: string[] = [];

        if (profile.hazmat === null) missingFields.push('hazmat question');
        if (profile.radius === null) missingFields.push('radius of operation');
        if (profile.fleetSize === null) missingFields.push('fleet size');
        if (profile.cargoTypes.length === 0) missingFields.push('cargo types');

        if (missingFields.length > 0) {
          return {
            valid: false,
            errors: [`Please complete: ${missingFields.join(', ')}`],
          };
        }

        return { valid: true, errors: [] };
      }

      case 3: {
        // Stage 3: Business Details + Operations + Vehicles + Drivers + Prior Insurance + Coverage
        const businessResult = businessSchema.safeParse(values.business);
        const operationsResult = operationsSchema.safeParse(values.operations);

        const errors: string[] = [];

        if (!businessResult.success) {
          errors.push(...businessResult.error.errors.map(e => e.message));
        }

        if (!operationsResult.success) {
          errors.push(...operationsResult.error.errors.map(e => e.message));
        }

        // Require at least one vehicle
        if (values.vehicles.length === 0) {
          errors.push('Please add at least one vehicle');
        }

        // Require at least one driver
        if (values.drivers.length === 0) {
          errors.push('Please add at least one driver');
        }

        if (errors.length > 0) {
          return { valid: false, errors };
        }

        return { valid: true, errors: [] };
      }

      case 4: {
        // Stage 4: Document uploads
        const docs = values.documents;
        const requiredDocTypes = ['authority_letter'];
        const uploadedTypes = docs.map(d => d.type);

        const missingDocs = requiredDocTypes.filter(t => !uploadedTypes.includes(t as typeof uploadedTypes[number]));

        if (missingDocs.length > 0) {
          return {
            valid: false,
            errors: [`Please upload required documents: ${missingDocs.map(d => d.replace('_', ' ')).join(', ')}`],
          };
        }

        return { valid: true, errors: [] };
      }

      default:
        return { valid: true, errors: [] };
    }
  }, [currentStage, form]);

  /**
   * Check if user can proceed from current stage
   */
  const canProceed = useCallback((): boolean => {
    return validateCurrentStage().valid;
  }, [validateCurrentStage]);

  /**
   * Get validation errors for current stage
   */
  const getStageErrors = useCallback((): string[] => {
    return validateCurrentStage().errors;
  }, [validateCurrentStage]);

  /**
   * Navigate to next stage
   */
  const goToNextStage = useCallback((): boolean => {
    if (!canProceed()) {
      return false;
    }

    if (currentStage < TOTAL_STAGES) {
      setCurrentStage(prev => prev + 1);
      return true;
    }

    return false;
  }, [canProceed, currentStage]);

  /**
   * Navigate to previous stage
   */
  const goToPrevStage = useCallback((): boolean => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentStage]);

  /**
   * Go to a specific stage
   */
  const goToStage = useCallback((stage: number): boolean => {
    if (stage >= 1 && stage <= TOTAL_STAGES && stage <= currentStage) {
      setCurrentStage(stage);
      return true;
    }
    return false;
  }, [currentStage]);

  /**
   * Reset the form to default values
   */
  const resetForm = useCallback((skipConfirmation = false): boolean => {
    if (!skipConfirmation && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Are you sure you want to start over? All your progress will be lost.'
      );
      if (!confirmed) {
        return false;
      }
    }

    // Clear localStorage
    clearLocalStorageKey(STORAGE_KEY);

    // Reset form to defaults
    form.reset(defaultSmartIntakeData);

    // Reset stage
    setCurrentStage(1);
    setIsKnockedOut(false);
    setHasRestoredState(false);

    return true;
  }, [form]);

  /**
   * Save current state immediately
   */
  const saveNow = useCallback((): void => {
    const values = form.getValues();
    setStoredData(values);
  }, [form, setStoredData]);

  /**
   * Check if there's saved progress
   */
  const hasSavedProgress = useCallback((): boolean => {
    return typeof window !== 'undefined' && hasLocalStorageKey(STORAGE_KEY);
  }, []);

  /**
   * Continue from saved progress
   */
  const continueFromSaved = useCallback((): void => {
    if (hasLocalStorageKey(STORAGE_KEY)) {
      form.reset(storedData);
      setHasRestoredState(true);
    }
  }, [form, storedData]);

  /**
   * Start fresh (discard saved progress)
   */
  const startFresh = useCallback((): void => {
    clearLocalStorageKey(STORAGE_KEY);
    form.reset(defaultSmartIntakeData);
    setCurrentStage(1);
    setIsKnockedOut(false);
    setHasRestoredState(false);
  }, [form]);

  return {
    form,
    currentStage,
    totalStages: TOTAL_STAGES,
    hasRestoredState,
    isKnockedOut,
    goToNextStage,
    goToPrevStage,
    goToStage,
    canProceed,
    getStageErrors,
    resetForm,
    saveNow,
    hasSavedProgress,
    continueFromSaved,
    startFresh,
  };
}

export default useIntakeForm;
