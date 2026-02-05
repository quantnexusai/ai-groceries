export interface Profile {
  id: string
  created_at: string
  first_name: string
  last_name: string
  phone: string
  gender: string
  date_of_birth: string | null
  address: string
  zip: string
  order_comment: string
  admin: boolean
  avatar_url: string
}

export interface DepartmentType {
  id: string
  name: string
  icon: string
  sort_order: number
  created_at: string
}

export interface Store {
  id: string
  name: string
  address?: string
  logo_url?: string
  image_url?: string
  serviced_zips: string[]
  departments?: string[]
  department_type_ids?: string[]
  active: boolean
  description: string
  rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface GroceryItem {
  id: string
  store_id: string
  name: string
  description: string
  details?: string
  warnings?: string
  ingredients?: string
  image_url: string
  department_type_id: string | null
  price: number
  actual_price?: number
  sale: boolean
  sale_price: number | null
  visible?: boolean
  measure_type: string
  weight: number | null
  stock: number
  provenance_story: string
  provenance_farm: string
  provenance_location: string
  created_at: string
  updated_at: string
  store?: Store
  department?: DepartmentType
}

export interface DeliveryTiming {
  id: string
  label: string
  start_hour: number
  end_hour: number
  active: boolean
  sort_order?: number
  created_at: string
}

export interface PlatformFee {
  id: string
  fee: number
  description?: string
  active?: boolean
  created_at?: string
  updated_at: string
}

export interface OrderStatus {
  id: string
  name: string
  color: string
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  order_number?: string
  buyer_id?: string
  user_id?: string
  store_id: string
  status?: string
  status_id?: string
  delivery_address: string
  delivery_date: string | null
  delivery_time?: string
  delivery_timing_id?: string
  instruction?: string
  order_comment?: string
  notes?: string | null
  minimum_packages?: boolean
  tel?: string
  subtotal: number
  platform_fee: number
  total_price?: number
  total?: number
  stripe_session_id?: string | null
  stripe_payment_intent?: string | null
  created_at: string
  updated_at: string
  buyer?: Profile
  store?: Store
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  item_id: string | null
  item_name: string
  quantity: number
  price_at_purchase?: number
  unit_price?: number
  total_price?: number
  created_at: string
  item?: GroceryItem
}

export interface SortingOption {
  id: string
  context?: string
  category?: string
  label: string
  value: string
  sort_order?: number
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  store_id: string
  order_id?: string | null
  rate?: number
  rating?: number
  message?: string
  comment?: string
  created_at: string
  updated_at?: string
  reviewer?: Profile
}

export interface AILog {
  id: string
  feature: string
  input_context: Record<string, unknown>
  output_text: string
  user_id: string | null
  created_at: string
}

export interface CartItem {
  item_id: string
  store_id: string
  store_name: string
  name: string
  price: number
  sale_price: number | null
  image_url: string
  quantity: number
  stock: number
  measure_type: string
  weight: number
}
