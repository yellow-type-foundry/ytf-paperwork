/**
 * Utility for font conversion
 * This is a placeholder for the actual conversion process
 * In a production environment, you would use a server-side process to convert fonts
 */

// For now, we'll use a simple approach to convert woff2 to a format jsPDF can use
export async function convertWoff2ToTtf(woff2Url) {
  try {
    // In a real implementation, you would use a library like fontkit or opentype.js
    // to convert the font format server-side

    // For now, we'll just fetch the woff2 file and return its data
    const response = await fetch(woff2Url)
    const arrayBuffer = await response.arrayBuffer()

    // Return the buffer (in production, this would be converted to TTF)
    return arrayBuffer
  } catch (error) {
    console.error("Error converting font:", error)
    throw error
  }
}

// Helper function to convert ArrayBuffer to base64
export function arrayBufferToBase64(buffer) {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
