import QRCode from "qrcode";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const QR_DIR = path.join(process.cwd(), "public", "uploads", "qr-codes");

/**
 * Generate a QR code PNG for a member and save it to the public directory.
 * Returns the public URL path (e.g. "/uploads/qr-codes/42.png").
 */
export async function generateQRCode(memberId: string): Promise<string> {
  const url = `${SITE_URL}/members/${memberId}`;
  const filename = `${memberId}.png`;
  const filepath = path.join(QR_DIR, filename);

  // Ensure the output directory exists
  await mkdir(QR_DIR, { recursive: true });

  // Generate QR code as PNG buffer
  const buffer = await QRCode.toBuffer(url, {
    type: "png",
    width: 400,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#0D4D2B",  // PBA green
      light: "#FFFFFF",
    },
  });

  await writeFile(filepath, buffer);

  return `/uploads/qr-codes/${filename}`;
}

/**
 * Generate a QR code as a base64 data URL (for inline display without file I/O).
 */
export async function generateQRCodeDataURL(memberId: string): Promise<string> {
  const url = `${SITE_URL}/members/${memberId}`;

  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#0D4D2B",
      light: "#FFFFFF",
    },
  });
}

/**
 * Bulk-generate QR codes for an array of member IDs.
 * Useful for the initial migration of 100+ existing members.
 */
export async function generateBulkQRCodes(
  memberIds: string[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  // Process in batches of 20 to avoid overwhelming the filesystem
  const BATCH_SIZE = 20;
  for (let i = 0; i < memberIds.length; i += BATCH_SIZE) {
    const batch = memberIds.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (id) => {
      const url = await generateQRCode(id);
      results.set(id, url);
    });
    await Promise.all(promises);
  }

  return results;
}
