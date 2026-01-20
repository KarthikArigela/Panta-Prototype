"use client";

import { useState } from "react";

interface InfoTooltipProps {
  content: string;
}

/**
 * InfoTooltip Component
 *
 * Displays a small (i) info icon that shows a tooltip on hover.
 * Used to explain insurance jargon in plain English.
 *
 * Based on US-025 acceptance criteria.
 */
export function InfoTooltip({ content }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        marginLeft: "0.5rem",
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Info icon */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: "2px solid var(--color-text-secondary)",
          color: "var(--color-text-secondary)",
          fontSize: "0.75rem",
          fontWeight: "bold",
          cursor: "help",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.color = "var(--color-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-text-secondary)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
        }}
      >
        i
      </span>

      {/* Tooltip box */}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            color: "var(--color-text-primary)",
            padding: "0.75rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            maxWidth: "300px",
            width: "max-content",
            minWidth: "200px",
            zIndex: 1000,
            fontSize: "0.875rem",
            lineHeight: "1.4",
            whiteSpace: "normal",
            pointerEvents: "none",
          }}
        >
          {content}
          {/* Arrow pointer */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid white",
            }}
          />
        </div>
      )}
    </span>
  );
}
