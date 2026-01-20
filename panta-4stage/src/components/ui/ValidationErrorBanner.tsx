/**
 * ValidationErrorBanner Component
 * Displays specific validation errors when user cannot proceed to next stage
 */

'use client';

import React from 'react';

export interface ValidationErrorBannerProps {
  /** Array of error messages to display */
  errors: string[];
  /** Whether to show the banner */
  show: boolean;
}

/**
 * Banner that displays validation errors in plain English
 * Helps users understand which required fields are missing
 */
export function ValidationErrorBanner({ errors, show }: ValidationErrorBannerProps) {
  if (!show || errors.length === 0) {
    return null;
  }

  return (
    <div className="validation-error-banner">
      <div className="validation-error-header">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
            fill="currentColor"
          />
        </svg>
        <strong>Please complete the following:</strong>
      </div>
      <ul className="validation-error-list">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export default ValidationErrorBanner;
