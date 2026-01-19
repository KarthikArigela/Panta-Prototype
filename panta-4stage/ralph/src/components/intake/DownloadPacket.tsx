/**
 * DownloadPacket Component
 *
 * Final submission packet download UI
 * Shows after all PDFs generated and allows user to download complete ZIP package
 */

'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SmartIntakeData } from '@/types/intake';
import { downloadSubmissionPackage, getSubmissionPackageDocumentCount } from '@/lib/pdf/zipPackager';

interface DownloadPacketProps {
  form: UseFormReturn<SmartIntakeData>;
}

export default function DownloadPacket({ form }: DownloadPacketProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const data = form.getValues();
  const documentCount = getSubmissionPackageDocumentCount(data);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadSubmissionPackage(data);
      setDownloadComplete(true);
      // Reset complete state after 3 seconds
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error('Error generating submission package:', error);
      alert('Error generating submission package. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        border: '2px solid var(--color-accent)',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '40px auto',
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          margin: '0 auto 24px',
        }}
      >
        ✓
      </div>

      {/* Success Message */}
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'var(--color-primary)',
          marginBottom: '12px',
        }}
      >
        Your submission packet is ready!
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '8px',
        }}
      >
        We've prepared all your documents for submission.
      </p>

      {/* Document Count */}
      <p
        style={{
          fontSize: '14px',
          color: '#999',
          marginBottom: '24px',
        }}
      >
        <strong>{documentCount} documents</strong> in packet
      </p>

      {/* Download Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="submit-btn"
        style={{
          backgroundColor: isDownloading ? '#ccc' : 'var(--color-accent)',
          color: 'white',
          padding: '16px 48px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '240px',
        }}
      >
        {isDownloading ? (
          <span>
            ⏳ Generating...
          </span>
        ) : downloadComplete ? (
          <span>
            ✓ Downloaded!
          </span>
        ) : (
          <span>
            📦 Download Submission Packet
          </span>
        )}
      </button>

      {/* Instructions */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          textAlign: 'left',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--color-primary)',
            marginBottom: '12px',
          }}
        >
          What's included:
        </h3>
        <ul
          style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.8',
            paddingLeft: '20px',
          }}
        >
          <li>ACORD 125 - Commercial Insurance Application</li>
          <li>ACORD 127 - Trucking Application Supplement</li>
          {data.vehicles.length > 4 && (
            <li>ACORD 129 - Vehicle Schedule Continuation</li>
          )}
          {data.documents.map((doc) => (
            <li key={doc.type}>{doc.fileName}</li>
          ))}
        </ul>

        <p
          style={{
            fontSize: '14px',
            color: '#999',
            marginTop: '16px',
            fontStyle: 'italic',
          }}
        >
          Submit this ZIP file to your insurance broker or underwriter for processing.
        </p>
      </div>

      {/* What's Next */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#e7f5e7',
          borderRadius: '8px',
          border: '1px solid var(--color-accent)',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--color-primary)',
            marginBottom: '8px',
          }}
        >
          What happens next?
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.6',
          }}
        >
          Your broker will review your application and contact you within <strong>1-2 business days</strong> with quotes from our carrier partners.
        </p>
      </div>
    </div>
  );
}
