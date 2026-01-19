/**
 * ZIP Package Generator for Submission Packet
 *
 * Bundles all ACORD PDFs and uploaded documents into a single ZIP file
 * ready for underwriter submission.
 */

import JSZip from 'jszip';
import { SmartIntakeData } from '@/types/intake';
import { generateAcord125 } from './acord125Generator';
import { generateAcord127 } from './acord127Generator';
import { generateAcord129 } from './acord129Generator';

/**
 * Document type mapping for clear file names
 */
const DOCUMENT_TYPE_NAMES: Record<string, string> = {
  loss_runs: 'Loss_Runs',
  authority_letter: 'MC_DOT_Authority_Letter',
  vehicle_schedule: 'Vehicle_Schedule',
  driver_list: 'Driver_List',
  current_dec_page: 'Current_Dec_Page',
  ifta_credentials: 'IFTA_Credentials',
};

/**
 * Gets file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
  };
  return mimeMap[mimeType] || '.pdf';
}

/**
 * Generates a complete submission packet ZIP file
 * @param data SmartIntakeData from form
 * @returns Blob containing ZIP file
 */
export async function generateSubmissionPackageZip(data: SmartIntakeData): Promise<Blob> {
  const zip = new JSZip();
  const businessName = data.business.legalName || 'Business';
  const sanitizedBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_');

  // Generate ACORD 125 PDF
  const acord125Bytes = await generateAcord125(data);
  zip.file(`ACORD_125_${sanitizedBusinessName}.pdf`, acord125Bytes);

  // Generate ACORD 127 PDF
  const acord127Bytes = await generateAcord127(data);
  zip.file(`ACORD_127_${sanitizedBusinessName}.pdf`, acord127Bytes);

  // Generate ACORD 129 PDF (if applicable)
  const acord129Bytes = await generateAcord129(data);
  if (acord129Bytes) {
    zip.file(`ACORD_129_${sanitizedBusinessName}.pdf`, acord129Bytes);
  }

  // Add uploaded documents
  for (const doc of data.documents) {
    // Get clear file name for document type
    const docTypeName = DOCUMENT_TYPE_NAMES[doc.type] || doc.type;

    // Get file extension from MIME type or original filename
    const extension = doc.fileName ?
      doc.fileName.substring(doc.fileName.lastIndexOf('.')) :
      getExtensionFromMimeType(doc.mimeType || 'application/pdf');

    // Create file name: DocType_BusinessName.ext
    const fileName = `${docTypeName}_${sanitizedBusinessName}${extension}`;

    // Add file to ZIP
    // In a real implementation, doc.fileReference would contain the actual file data
    // For now, we'll add a placeholder indicating the file should be included
    if (doc.fileReference) {
      // If fileReference is a blob or file, add it directly
      zip.file(fileName, doc.fileReference);
    } else {
      // Placeholder for demonstration - in production, this would fetch the actual file
      zip.file(fileName, `[Placeholder for ${doc.fileName}]\nFile type: ${doc.mimeType}\nSize: ${doc.fileSize} bytes`);
    }
  }

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6 // Medium compression (0-9)
    }
  });

  return zipBlob;
}

/**
 * Downloads submission package ZIP in browser
 * @param data SmartIntakeData from form
 */
export async function downloadSubmissionPackage(data: SmartIntakeData): Promise<void> {
  const zipBlob = await generateSubmissionPackageZip(data);

  // Create filename with business name and current date
  const businessName = data.business.legalName || 'Business';
  const sanitizedBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const fileName = `Panta_Submission_${sanitizedBusinessName}_${dateString}.zip`;

  // Trigger download
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Counts total documents in submission packet
 * @param data SmartIntakeData from form
 * @returns Total document count including ACORD forms
 */
export function getSubmissionPackageDocumentCount(data: SmartIntakeData): number {
  // Always includes ACORD 125 and 127
  let count = 2;

  // Add ACORD 129 if applicable
  if (data.vehicles.length > 4) {
    count += 1;
  }

  // Add uploaded documents
  count += data.documents.length;

  return count;
}
