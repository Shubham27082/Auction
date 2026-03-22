export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export const imgUrl = (path) =>
  path ? `http://localhost:8080/api/uploads/${path}` : null

// Resolves any image source:
// - Google Drive share links  → direct viewable URL
// - Relative backend paths    → full URL via backend
// - Already full URLs         → returned as-is
export const resolveImage = (src) => {
  if (!src) return null

  // Google Drive: https://drive.google.com/open?id=FILE_ID
  //            or https://drive.google.com/file/d/FILE_ID/view
  const driveOpen = src.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (driveOpen) return `https://drive.google.com/uc?export=view&id=${driveOpen[1]}`

  const driveFile = src.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveFile) return `https://drive.google.com/uc?export=view&id=${driveFile[1]}`

  // Already a full URL
  if (src.startsWith('http://') || src.startsWith('https://')) return src

  // Relative path → backend uploads
  return `http://localhost:8080/api/uploads/${src}`
}
