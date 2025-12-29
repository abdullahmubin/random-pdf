import JSZip from 'jszip';

/**
 * Extracts files from a zip buffer into a map of filename -> Buffer
 * Returns an object where keys are normalized filenames (no folders)
 */
export async function extractZipFiles(zipBuffer) {
  const zip = await JSZip.loadAsync(zipBuffer);
  const files = {};

  const entries = Object.keys(zip.files);
  for (const entryName of entries) {
    const entry = zip.files[entryName];
    if (entry.dir) continue;

    // Normalize name to last path segment
    const parts = entry.name.split('/');
    const filename = parts[parts.length - 1];

    const content = await entry.async('nodebuffer');
    files[filename] = content;
  }

  return files;
}

export function pickTextFileFromFiles(filesMap) {
  // filesMap: { filename: Buffer }
  const txtNames = Object.keys(filesMap).filter(n => n.toLowerCase().endsWith('.txt'));
  if (txtNames.length === 0) return null;
  // Prefer first .txt
  const name = txtNames[0];
  return { name, buffer: filesMap[name] };
}

export function pickImageFilesFromFiles(filesMap) {
  // Return an ordered array of { name, buffer }
  const images = [];
  for (const name of Object.keys(filesMap)) {
    const lower = name.toLowerCase();
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || lower.endsWith('.webp')) {
      images.push({ name, buffer: filesMap[name] });
    }
  }
  return images;
}
