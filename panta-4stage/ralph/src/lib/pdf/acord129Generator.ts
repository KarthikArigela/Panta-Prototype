/**
 * ACORD 129 Vehicle Schedule Continuation PDF Generator
 *
 * Generates ACORD 129 PDF for vehicle schedule continuation when fleet has >4 vehicles.
 * Uses pdf-lib to create a professional multi-page PDF with all continuation vehicle details.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { SmartIntakeData } from '@/types/intake';
import { mapToAcord129, type FieldMapping } from '@/lib/acord-mappings';

/**
 * Generates ACORD 129 Vehicle Schedule Continuation PDF
 * Only generates if vehicles.length > 4
 * @param data SmartIntakeData from form
 * @returns Uint8Array of PDF or null if not needed
 */
export async function generateAcord129(data: SmartIntakeData): Promise<Uint8Array | null> {
  // Only generate if more than 4 vehicles
  if (data.vehicles.length <= 4) {
    return null;
  }

  // Get field mappings
  const fields = mapToAcord129(data);
  if (!fields) {
    return null;
  }

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page dimensions
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  // Helper functions
  const addText = (text: string, x: number, y: number, size: number = 10, isBold: boolean = false) => {
    const currentFont = isBold ? fontBold : font;
    page.drawText(text, {
      x,
      y,
      size,
      font: currentFont,
      color: rgb(0, 0, 0),
    });
  };

  const addSectionHeader = (text: string) => {
    if (yPosition < 80) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }
    addText(text, margin, yPosition, 12, true);
    yPosition -= 16;
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: pageWidth - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  };

  const addField = (label: string, value: string | number | boolean | undefined, offsetX: number = 250) => {
    if (yPosition < 40) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }
    const displayValue = value === undefined || value === null ? '' : String(value);
    addText(`${label}:`, margin, yPosition, 10, false);
    addText(displayValue, margin + offsetX, yPosition, 10, false);
    yPosition -= 14;
  };

  const wrapText = (text: string, maxWidth: number): string[] => {
    // Simple text wrapping at 70 characters per line
    const regex = new RegExp(`.{1,${maxWidth}}`, 'g');
    return text.match(regex) || [text];
  };

  const addVehicle = (vehicleNum: number) => {
    // Check if we need a new page for this vehicle
    if (yPosition < 250) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }

    // Vehicle header
    addText(`Vehicle #${vehicleNum}`, margin, yPosition, 11, true);
    yPosition -= 18;

    // Vehicle fields
    addField('Year', fields[`Vehicle${vehicleNum}_Year`]);
    addField('Make', fields[`Vehicle${vehicleNum}_Make`]);
    addField('Model', fields[`Vehicle${vehicleNum}_Model`]);
    addField('VIN', fields[`Vehicle${vehicleNum}_VIN`]);
    addField('Body Type', fields[`Vehicle${vehicleNum}_BodyType`]);
    addField('GVW', fields[`Vehicle${vehicleNum}_GVW`]);
    addField('Stated Value', fields[`Vehicle${vehicleNum}_StatedValue`]);
    addField('Radius', fields[`Vehicle${vehicleNum}_Radius`]);
    addField('For Hire', fields[`Vehicle${vehicleNum}_ForHire`]);

    // Garaging Address (may be multi-line)
    const garagingAddress = String(fields[`Vehicle${vehicleNum}_GaragingAddress`] || '');
    if (garagingAddress && garagingAddress !== 'Same as business address') {
      addText('Garaging Address:', margin, yPosition, 10, false);
      yPosition -= 14;
      const addressLines = wrapText(garagingAddress, 70);
      for (const line of addressLines) {
        addText(line, margin + 20, yPosition, 10, false);
        yPosition -= 14;
      }
    } else {
      addField('Garaging Address', garagingAddress);
    }

    // Lienholder (may be multi-line)
    const lienholder = String(fields[`Vehicle${vehicleNum}_Lienholder`] || 'None');
    if (lienholder && lienholder !== 'None') {
      addText('Lienholder:', margin, yPosition, 10, false);
      yPosition -= 14;
      const lienholderLines = wrapText(lienholder, 70);
      for (const line of lienholderLines) {
        addText(line, margin + 20, yPosition, 10, false);
        yPosition -= 14;
      }
    } else {
      addField('Lienholder', lienholder);
    }

    // Add spacing after vehicle
    yPosition -= 10;
  };

  // ===== START PDF CONTENT =====

  // Header
  addText('ACORD 129', margin, yPosition, 16, true);
  addText('VEHICLE SCHEDULE CONTINUATION', margin + 100, yPosition, 16, true);
  yPosition -= 20;
  addText(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition, 9, false);
  yPosition -= 30;

  // Named Insured
  addSectionHeader('Named Insured');
  addField('Business Name', fields.NamedInsured_BusinessName);
  addField('DOT Number', fields.NamedInsured_DOTNumber);
  addField('MC Number', fields.NamedInsured_MCNumber);
  yPosition -= 20;

  // Vehicle Schedule Continuation
  addSectionHeader('Vehicle Schedule Continuation');
  addText('The following vehicles are in addition to the vehicles listed on ACORD 127.', margin, yPosition, 10, false);
  yPosition -= 20;

  // Add vehicles 5 through end of array
  const totalVehicles = data.vehicles.length;
  for (let i = 5; i <= totalVehicles; i++) {
    addVehicle(i);
  }

  // Footer
  if (yPosition < 100) {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
  }
  yPosition = 40;
  page.drawLine({
    start: { x: margin, y: yPosition + 20 },
    end: { x: pageWidth - margin, y: yPosition + 20 },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.5),
  });
  addText('ACORD 129 (2016/01) - Vehicle Schedule Continuation', margin, yPosition, 8, false);
  addText('© ACORD CORPORATION 2016', pageWidth - margin - 150, yPosition, 8, false);

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

/**
 * Downloads ACORD 129 PDF in browser
 * @param data SmartIntakeData from form
 */
export async function downloadAcord129(data: SmartIntakeData): Promise<void> {
  const pdfBytes = await generateAcord129(data);

  if (!pdfBytes) {
    console.warn('ACORD 129 not needed - fleet has 4 or fewer vehicles');
    return;
  }

  // Create blob and download
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const businessName = data.business.legalName || 'Business';
  const sanitizedName = businessName.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `ACORD_129_${sanitizedName}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
