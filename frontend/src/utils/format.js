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
