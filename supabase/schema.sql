-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Multilingual content
  name_he TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_he TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  
  -- Product flags
  is_sale BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Categories and attributes
  category TEXT NOT NULL,
  subcategory TEXT,
  season TEXT NOT NULL,
  age_group TEXT NOT NULL,
  gender TEXT NOT NULL,
  brand TEXT,
  
  -- Smart categories and tags
  smart_categories TEXT[] DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  
  -- Product identifiers
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  
  -- Physical attributes
  material TEXT,
  care_symbols TEXT[] DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors JSONB NOT NULL DEFAULT '[]',
  images TEXT[] NOT NULL DEFAULT '{}',
  
  -- SEO and sorting
  sort_order INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  seo_title_he TEXT,
  seo_title_ar TEXT,
  seo_title_en TEXT,
  seo_description_he TEXT,
  seo_description_ar TEXT,
  seo_description_en TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  variants JSONB DEFAULT '[]',
  weight INTEGER DEFAULT 200,
  dimensions JSONB DEFAULT '{}',
  
  -- Inventory tracking
  last_stocked TIMESTAMP WITH TIME ZONE,
  supplier_id UUID
);

-- Inventory matrix table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color_index INTEGER NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  reorder_point INTEGER DEFAULT 10,
  location TEXT DEFAULT 'main_warehouse',
  supplier_sku TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_restocked TIMESTAMP WITH TIME ZONE,
  cost_per_unit DECIMAL(10,2) NOT NULL,
  
  UNIQUE(product_id, size, color_index)
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  preferred_language TEXT DEFAULT 'he',
  birth_date DATE,
  addresses JSONB DEFAULT '[]',
  kids_profiles JSONB DEFAULT '[]',
  preferences JSONB,
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  whatsapp_consent BOOLEAN DEFAULT TRUE,
  sms_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE
);

-- Analytics table for tracking user behavior
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'product_view', 'click', 'add_to_cart', 'purchase', etc.
  product_id TEXT, -- Using TEXT to match our frontend product IDs
  session_id TEXT,
  user_agent TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity logs table
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin 2FA codes table (for future use)
CREATE TABLE admin_2fa_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_sale ON products(is_sale);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_season ON products(season);
CREATE INDEX idx_products_age_group ON products(age_group);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_sort_order ON products(sort_order);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_stock ON inventory(stock_quantity);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_date ON orders(created_at);

CREATE INDEX idx_analytics_product_id ON analytics(product_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_activity_user_id ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_2fa_user_id ON admin_2fa_codes(user_id);

-- Full text search indexes
CREATE INDEX idx_products_search_he ON products USING gin(name_he gin_trgm_ops, description_he gin_trgm_ops);
CREATE INDEX idx_products_search_ar ON products USING gin(name_ar gin_trgm_ops, description_ar gin_trgm_ops);
CREATE INDEX idx_products_search_en ON products USING gin(name_en gin_trgm_ops, description_en gin_trgm_ops);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MIN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory after order
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
BEGIN
  -- Loop through order items and update inventory
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    UPDATE inventory 
    SET stock_quantity = stock_quantity - (item->>'quantity')::INTEGER,
        available_quantity = available_quantity - (item->>'quantity')::INTEGER,
        last_updated = NOW()
    WHERE product_id = (item->>'product_id')::UUID
      AND size = item->>'size'
      AND color_index = (item->>'color_index')::INTEGER;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when order is confirmed
CREATE TRIGGER update_inventory_after_order
  AFTER INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_status = 'confirmed')
  EXECUTE FUNCTION update_inventory_on_order();

-- RLS (Row Level Security) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_2fa_codes ENABLE ROW LEVEL SECURITY;

-- Public read access for products and inventory
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Inventory is viewable by everyone" ON inventory
  FOR SELECT USING (true);

-- Analytics can be inserted by everyone (for tracking)
CREATE POLICY "Analytics can be inserted by everyone" ON analytics
  FOR INSERT WITH CHECK (true);

-- Admin access (you'll need to set up admin roles)
CREATE POLICY "Admin full access to products" ON products
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to inventory" ON inventory
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to customers" ON customers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Admin table policies
CREATE POLICY "Admin users can view themselves" ON admin_users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Super admin full access to admin_users" ON admin_users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin activity logs viewable by owner" ON admin_activity_logs
  FOR SELECT USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Admin activity logs insertable by anyone" ON admin_activity_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin 2FA codes manageable by owner" ON admin_2fa_codes
  FOR ALL USING (user_id::text = auth.jwt() ->> 'sub');

-- Insert sample data for development
INSERT INTO products (
  name_he, name_ar, name_en,
  description_he, description_ar, description_en,
  price, cost, category, season, age_group, gender, sku,
  sizes, colors, images, brand, material, tags
) VALUES 
(
  'חולצת כותנה רכה לילדים', 'قميص قطني ناعم للأطفال', 'Soft Cotton Kids T-Shirt',
  'חולצת כותנה איכותית ונוחה לילדים בכל הגילאים', 'قميص قطني عالي الجودة ومريح للأطفال من جميع الأعمار', 'High-quality comfortable cotton t-shirt for kids of all ages',
  89.90, 35.00, 'unisex', 'all_seasons', '2-8', 'unisex', 'MIN-TSH-001',
  ARRAY['2', '3', '4', '5', '6', '7', '8'],
  '[
    {"name": {"he": "לבן", "ar": "أبيض", "en": "White"}, "hex": "#FFFFFF"},
    {"name": {"he": "כחול", "ar": "أزرق", "en": "Blue"}, "hex": "#4A90E2"},
    {"name": {"he": "ורוד", "ar": "وردي", "en": "Pink"}, "hex": "#F8BBD9"}
  ]',
  ARRAY['/images/products/tshirt-white-front.jpg', '/images/products/tshirt-white-back.jpg'],
  'MINIMODA', 'cotton_blend', ARRAY['basic', 'cotton', 'comfortable']
);

-- Insert inventory for the sample product with proper color handling
INSERT INTO inventory (product_id, size, color_index, stock_quantity, available_quantity, cost_per_unit, supplier_sku)
SELECT 
  p.id,
  size_value,
  color_idx,
  floor(random() * 40 + 10)::INTEGER, -- Random stock between 10-50
  floor(random() * 40 + 10)::INTEGER, -- Same as stock initially
  p.cost,
  'SUP-' || p.id || '-' || size_value
FROM products p
CROSS JOIN unnest(p.sizes) AS size_value
CROSS JOIN generate_series(0, CASE WHEN jsonb_array_length(p.colors) > 0 THEN jsonb_array_length(p.colors) - 1 ELSE 0 END) AS color_idx
WHERE p.sku = 'MIN-TSH-001';