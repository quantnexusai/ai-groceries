-- ============================================================
-- AI Groceries — Supabase Schema
-- Online grocery delivery platform with AI features
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 1. PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  gender TEXT DEFAULT '',
  date_of_birth DATE,
  address TEXT DEFAULT '',
  zip TEXT DEFAULT '',
  order_comment TEXT DEFAULT '',
  admin BOOLEAN DEFAULT false,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- ============================================================
-- 2. DEPARTMENT TYPES
-- ============================================================

CREATE TABLE department_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE department_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "department_types_public_read" ON department_types
  FOR SELECT USING (true);

CREATE POLICY "department_types_admin_manage" ON department_types
  FOR ALL USING (is_admin());

-- ============================================================
-- 3. STORES
-- ============================================================

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  serviced_zips TEXT[] DEFAULT '{}',
  departments UUID[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  description TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stores_public_read" ON stores
  FOR SELECT USING (active = true);

CREATE POLICY "stores_admin_manage" ON stores
  FOR ALL USING (is_admin());

-- ============================================================
-- 4. ITEMS
-- ============================================================

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  details TEXT DEFAULT '',
  warnings TEXT DEFAULT '',
  ingredients TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  department_type_id UUID REFERENCES department_types(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  actual_price NUMERIC(10,2) DEFAULT 0,
  sale BOOLEAN DEFAULT false,
  sale_price NUMERIC(10,2) DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  measure_type TEXT DEFAULT 'unit',
  weight NUMERIC(10,3) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  provenance_story TEXT DEFAULT '',
  provenance_farm TEXT DEFAULT '',
  provenance_location TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "items_public_read" ON items
  FOR SELECT USING (visible = true);

CREATE POLICY "items_admin_manage" ON items
  FOR ALL USING (is_admin());

-- ============================================================
-- 5. DELIVERY TIMINGS
-- ============================================================

CREATE TABLE delivery_timings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  start_hour INTEGER NOT NULL,
  end_hour INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE delivery_timings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timings_public_read" ON delivery_timings
  FOR SELECT USING (active = true);

CREATE POLICY "timings_admin_manage" ON delivery_timings
  FOR ALL USING (is_admin());

-- ============================================================
-- 6. PLATFORM FEE
-- ============================================================

CREATE TABLE platform_fee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee NUMERIC(10,2) NOT NULL DEFAULT 5.00,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_fee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fee_public_read" ON platform_fee
  FOR SELECT USING (true);

CREATE POLICY "fee_admin_update" ON platform_fee
  FOR UPDATE USING (is_admin());

-- ============================================================
-- 7. ORDER STATUSES
-- ============================================================

CREATE TABLE order_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#000000',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_statuses_public_read" ON order_statuses
  FOR SELECT USING (true);

CREATE POLICY "order_statuses_admin_manage" ON order_statuses
  FOR ALL USING (is_admin());

-- ============================================================
-- 8. ORDERS
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  delivery_address TEXT DEFAULT '',
  delivery_date DATE,
  delivery_time TEXT DEFAULT '',
  instruction TEXT DEFAULT '',
  order_comment TEXT DEFAULT '',
  minimum_packages BOOLEAN DEFAULT false,
  tel TEXT DEFAULT '',
  subtotal NUMERIC(10,2) DEFAULT 0,
  platform_fee NUMERIC(10,2) DEFAULT 5.00,
  total_price NUMERIC(10,2) DEFAULT 0,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_buyer_own" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "orders_buyer_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (is_admin());

-- ============================================================
-- 9. ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_via_order" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.buyer_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "order_items_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.buyer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin_all" ON order_items
  FOR ALL USING (is_admin());

-- ============================================================
-- 10. SORTING OPTIONS
-- ============================================================

CREATE TABLE sorting_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sorting_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sorting_public_read" ON sorting_options
  FOR SELECT USING (true);

CREATE POLICY "sorting_admin_manage" ON sorting_options
  FOR ALL USING (is_admin());

-- ============================================================
-- 11. REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rate INTEGER NOT NULL CHECK (rate >= 1 AND rate <= 5),
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_own_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_own_update" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (is_admin());

-- ============================================================
-- 12. AI LOGS
-- ============================================================

CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL,
  input_context JSONB DEFAULT '{}',
  output_text TEXT DEFAULT '',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_logs_admin_read" ON ai_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "ai_logs_insert" ON ai_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Decrement stock when order status changes to 'assembled'
CREATE OR REPLACE FUNCTION update_stock_on_assembled()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'assembled' AND OLD.status = 'new' THEN
    UPDATE items SET stock = GREATEST(stock - oi.quantity, 0)
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND items.id = oi.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_assembled
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_stock_on_assembled();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_stores_serviced_zips ON stores USING GIN (serviced_zips);
CREATE INDEX idx_stores_active ON stores(active);
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_department ON items(department_type_id);
CREATE INDEX idx_items_visible ON items(visible);
CREATE INDEX idx_items_sale ON items(sale);
CREATE INDEX idx_items_price ON items(price);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_ai_logs_feature ON ai_logs(feature);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Department Types
INSERT INTO department_types (name, icon, sort_order) VALUES
  ('Fruits & Vegetables', 'apple', 1),
  ('Dairy & Eggs', 'egg', 2),
  ('Bakery', 'croissant', 3),
  ('Meat & Seafood', 'beef', 4),
  ('Pantry Essentials', 'package', 5),
  ('Beverages', 'coffee', 6),
  ('Frozen Foods', 'snowflake', 7),
  ('Snacks', 'cookie', 8),
  ('Household', 'home', 9),
  ('Personal Care', 'heart', 10);

-- Delivery Timings
INSERT INTO delivery_timings (label, start_hour, end_hour, active, sort_order) VALUES
  ('8:00 AM - 10:00 AM', 8, 10, true, 1),
  ('10:00 AM - 12:00 PM', 10, 12, true, 2),
  ('12:00 PM - 2:00 PM', 12, 14, true, 3),
  ('2:00 PM - 4:00 PM', 14, 16, true, 4),
  ('4:00 PM - 6:00 PM', 16, 18, true, 5),
  ('6:00 PM - 8:00 PM', 18, 20, true, 6);

-- Order Statuses
INSERT INTO order_statuses (name, color, sort_order) VALUES
  ('New', '#3B82F6', 1),
  ('Assembled', '#F59E0B', 2),
  ('Picked Up', '#8B5CF6', 3),
  ('Delivered', '#10B981', 4),
  ('Canceled', '#EF4444', 5);

-- Sorting Options
INSERT INTO sorting_options (context, label, value, sort_order) VALUES
  ('items', 'Price: Low to High', 'price-low', 1),
  ('items', 'Price: High to Low', 'price-high', 2),
  ('items', 'Newest First', 'newest', 3),
  ('items', 'On Sale', 'sale', 4),
  ('customers', 'Name A-Z', 'name-asc', 1),
  ('customers', 'Newest', 'newest', 2);

-- Platform Fee
INSERT INTO platform_fee (fee) VALUES (5.00);
