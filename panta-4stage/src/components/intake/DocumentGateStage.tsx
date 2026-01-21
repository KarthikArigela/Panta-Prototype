"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { SmartIntakeData, DocumentType, UploadedDocument } from "@/types/intake";

interface DocumentGateStageProps {
  form: UseFormReturn<SmartIntakeData>;
}

/**
 * Stage 4: Document Upload Gate
 *
 * Requires certain documents before submission.
 * Uses react-dropzone for drag-and-drop upload.
 * Validates file type (PDF, JPG, PNG) and size (10MB limit).
 * Shows upload progress and success confirmation.
 *
 * Based on US-013 acceptance criteria.
 */
export function DocumentGateStage({ form }: DocumentGateStageProps) {
  const { watch, setValue } = form;

  const documents = watch("documents") || [];
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});

  // Helper function to check if a document type has been uploaded
  const hasDocument = (docType: DocumentType): boolean => {
    return documents.some((doc) => doc.type === docType);
  };

  // Check if all required documents are uploaded
  const hasAllRequiredDocs =
    hasDocument("loss_runs") && hasDocument("authority_letter");

  // Handle file drop/upload
  const onDrop = useCallback(
    async (acceptedFiles: File[], docType: DocumentType) => {
      for (const file of acceptedFiles) {
        // Simulate upload progress (in a real app, this would be an API call)
        const fileId = `${file.name}-${Date.now()}`;
        setUploadingFiles((prev) => ({ ...prev, [fileId]: 0 }));

        // Simulate progressive upload
        const uploadInterval = setInterval(() => {
          setUploadingFiles((prev) => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(uploadInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 100);

        // After "upload" completes, add to documents
        setTimeout(() => {
          const newDoc: UploadedDocument = {
            type: docType,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date().toISOString(),
          };

          const updatedDocs = [...documents, newDoc];
          setValue("documents", updatedDocs);

          // Remove from uploading state
          setUploadingFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
        }, 1200);
      }
    },
    [documents, setValue]
  );

  // Remove document
  const removeDocument = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setValue("documents", updatedDocs);
  };

  // Document sections configuration
  const requiredDocs: Array<{
    type: DocumentType;
    label: string;
    tooltip: string;
  }> = [
    {
      type: "loss_runs",
      label: "Loss Runs",
      tooltip:
        "A report from your current or prior insurance carrier showing your claims history for the last 5 years. If you don't have claims, a letter stating 'No Loss Runs' works.",
    },
    {
      type: "authority_letter",
      label: "MC/DOT Authority Letter",
      tooltip:
        "Official document from FMCSA showing your Motor Carrier (MC) and DOT numbers. You can download this from the FMCSA website.",
    },
  ];

  const optionalDocs: Array<{
    type: DocumentType;
    label: string;
    tooltip: string;
  }> = [
    {
      type: "vehicle_schedule",
      label: "Vehicle Schedule",
      tooltip:
        "List of all vehicles with VINs, makes, models, and values. Only needed if you prefer to upload instead of entering manually.",
    },
    {
      type: "driver_list",
      label: "Driver List",
      tooltip:
        "List of all drivers with license numbers and dates of birth. Only needed if you prefer to upload instead of entering manually.",
    },
    {
      type: "current_dec_page",
      label: "Current Dec Page",
      tooltip:
        "Declarations page from your current insurance policy showing coverage limits and deductibles.",
    },
    {
      type: "ifta_credentials",
      label: "IFTA Credentials",
      tooltip:
        "International Fuel Tax Agreement credentials if you operate in multiple states/provinces.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h2 className="stage-title">Upload Your Documents</h2>
        <p className="stage-description">
          We need a few documents to complete your application. Required documents are marked
          with an asterisk (*).
        </p>
      </div>

      {/* Required Documents Section */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
          Required Documents{" "}
          <span style={{ color: "var(--color-danger)" }}>*</span>
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {requiredDocs.map((doc) => (
            <DocumentUploadZone
              key={doc.type}
              docType={doc.type}
              label={doc.label}
              tooltip={doc.tooltip}
              onDrop={onDrop}
              documents={documents.filter((d) => d.type === doc.type)}
              removeDocument={(fileName) => {
                const index = documents.findIndex(
                  (d) => d.type === doc.type && d.fileName === fileName
                );
                if (index !== -1) removeDocument(index);
              }}
              uploadingFiles={uploadingFiles}
              required
            />
          ))}
        </div>
      </div>

      {/* Optional Documents Section */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
          Optional Documents
        </h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
          These documents are helpful but not required. Upload if you have them available.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {optionalDocs.map((doc) => (
            <DocumentUploadZone
              key={doc.type}
              docType={doc.type}
              label={doc.label}
              tooltip={doc.tooltip}
              onDrop={onDrop}
              documents={documents.filter((d) => d.type === doc.type)}
              removeDocument={(fileName) => {
                const index = documents.findIndex(
                  (d) => d.type === doc.type && d.fileName === fileName
                );
                if (index !== -1) removeDocument(index);
              }}
              uploadingFiles={uploadingFiles}
            />
          ))}
        </div>
      </div>

      {/* Success indicator when all required docs uploaded */}
      {hasAllRequiredDocs && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "24px", color: "#155724" }}>✓</span>
          <div>
            <strong style={{ color: "#155724" }}>All required documents uploaded</strong>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#155724" }}>
              You can now submit your application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual document upload zone component
 */
interface DocumentUploadZoneProps {
  docType: DocumentType;
  label: string;
  tooltip: string;
  onDrop: (files: File[], docType: DocumentType) => void;
  documents: UploadedDocument[];
  removeDocument: (fileName: string) => void;
  uploadingFiles: Record<string, number>;
  required?: boolean;
}

function DocumentUploadZone({
  docType,
  label,
  tooltip,
  onDrop,
  documents,
  removeDocument,
  uploadingFiles,
  required = false,
}: DocumentUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, docType),
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false, // One file per document type
  });

  const hasFile = documents.length > 0;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#fff",
      }}
      data-doc-required={required ? "true" : "false"}
      data-doc-type={docType}
    >
      {/* Document label and tooltip */}
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <strong style={{ fontSize: "16px" }}>
          {label}
          {required && <span style={{ color: "var(--color-danger)" }}> *</span>}
        </strong>
        <span
          title={tooltip}
          style={{
            cursor: "help",
            fontSize: "14px",
            color: "#666",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #999",
          }}
        >
          ⓘ
        </span>
      </div>

      {/* Show upload zone if no file uploaded yet */}
      {!hasFile && (
        <div
          {...getRootProps()}
          style={{
            border: isDragActive ? "2px dashed var(--color-accent)" : "2px dashed #ccc",
            borderRadius: "8px",
            padding: "32px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#f0fdf4" : "#fafafa",
            transition: "all 0.2s ease",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📄</div>
          <p style={{ margin: "0 0 4px", fontWeight: "500" }}>
            {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            or click to browse (PDF, JPG, PNG • Max 10MB)
          </p>
        </div>
      )}

      {/* Show uploaded files */}
      {documents.map((doc, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>✓</span>
            <div>
              <strong style={{ display: "block", fontSize: "14px" }}>{doc.fileName}</strong>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {(doc.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeDocument(doc.fileName)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Show uploading progress */}
      {Object.entries(uploadingFiles).map(([fileId, progress]) => (
        <div
          key={fileId}
          style={{
            padding: "12px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "var(--color-accent)",
                transition: "width 0.1s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
