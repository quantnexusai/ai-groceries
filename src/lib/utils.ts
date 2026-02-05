export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(dateString)
}

export function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.charAt(0)?.toUpperCase() || ''
  const l = lastName?.charAt(0)?.toUpperCase() || ''
  return f + l || '?'
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    new: 'New',
    assembled: 'Assembled',
    picked_up: 'Picked Up',
    delivered: 'Delivered',
    canceled: 'Canceled',
  }
  return map[status] || status
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    new: '#3B82F6',
    assembled: '#F59E0B',
    picked_up: '#8B5CF6',
    delivered: '#10B981',
    canceled: '#EF4444',
  }
  return map[status] || '#6B7280'
}

export function getEffectivePrice(item: { price: number; sale_price?: number | null; sale?: boolean }): number {
  if (item.sale && item.sale_price && item.sale_price > 0) return item.sale_price
  return item.price
}

export function formatWeight(weight: number | null, measureType: string): string {
  if (measureType === 'weight' && weight) {
    return weight >= 1000 ? `${(weight / 1000).toFixed(1)} kg` : `${weight} g`
  }
  return 'per unit'
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function generateOrderNumber(): string {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GR-${y}${m}${d}-${rand}`
}
