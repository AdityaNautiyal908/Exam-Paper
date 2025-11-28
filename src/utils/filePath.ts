/**
 * Encodes a file path to handle special characters in URLs
 * This is especially important for filenames with characters like +, spaces, etc.
 */
export function encodeFilePath(filePath: string): string {
  // Split the path into parts
  const parts = filePath.split('/');
  
  // Encode each part (especially the filename)
  const encodedParts = parts.map((part, index) => {
    // Don't encode the first empty string (from leading /)
    if (part === '') return part;
    
    // For the last part (filename), encode it more carefully
    if (index === parts.length - 1) {
      // Encode special characters but preserve forward slashes in the path structure
      return encodeURIComponent(part);
    }
    
    // For directory parts, encode but less aggressively
    return encodeURIComponent(part);
  });
  
  return encodedParts.join('/');
}

/**
 * Gets a safe file path for use in URLs
 */
export function getSafeFilePath(filePath: string): string {
  // If the path already starts with /, use it as is but encode the filename
  if (filePath.startsWith('/')) {
    const lastSlash = filePath.lastIndexOf('/');
    const dir = filePath.substring(0, lastSlash + 1);
    const filename = filePath.substring(lastSlash + 1);
    return dir + encodeURIComponent(filename);
  }
  
  return encodeFilePath(filePath);
}

