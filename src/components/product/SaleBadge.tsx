interface SaleBadgeProps {
  originalPrice: number
  salePrice: number
}

export default function SaleBadge({ originalPrice, salePrice }: SaleBadgeProps) {
  if (originalPrice <= 0 || salePrice >= originalPrice) return null

  const percentOff = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

  return (
    <span className="badge-fresh">
      {percentOff}% Off
    </span>
  )
}
