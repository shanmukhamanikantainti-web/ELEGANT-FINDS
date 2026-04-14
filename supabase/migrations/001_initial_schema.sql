-- ============================================
-- Elegant Finds 47 - Database Migration
-- Premium Jewellery & Accessories E-Commerce
-- ============================================


-- ============================================
-- SCHEMA: public
-- ============================================

-- ----------------------------
-- Table: categories
-- ----------------------------
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------
-- Table: users (extends auth.users)
-- ----------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------
-- Table: products
-- ----------------------------
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10,2) CHECK (compare_price >= 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  images JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------
-- Table: cart_items
-- ----------------------------
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant JSONB NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create unique constraint for cart items per user and product variant
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product_variant
ON cart_items(user_id, product_id, variant);

-- ----------------------------
-- Table: orders
-- ----------------------------
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  shipping_address JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------
-- Table: order_items
-- ----------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant JSONB NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

-- ----------------------------
-- Indexes for Performance
-- ----------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users table: Users can only read their own data
CREATE POLICY "Users can view own user data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Products: Anyone can read products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Categories: Anyone can read categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Cart items: Users can only read/write their own cart
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: Users can only see items from their orders
CREATE POLICY "Users can view order items from own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Storage buckets must be created via Supabase dashboard or API
-- Recommended buckets:
-- - products: for product images
-- - avatars: for user profile pictures

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  timestamp_part VARCHAR(20);
  random_part VARCHAR(10);
BEGIN
  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
  random_part := SUBSTRING(MD5(RANDOM()::TEXT), 1, 6);
  RETURN 'EF-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
  ('Earrings', 'earrings', 'Beautiful earrings ranging from studs to drops'),
  ('Hair Clips', 'hair-clips', 'Elegant hair accessories and clips'),
  ('Bracelets', 'bracelets', 'Delicate bracelets and bangles'),
  ('Necklaces', 'necklaces', 'Stunning necklaces and pendants'),
  ('Rings', 'rings', 'Elegant rings for every occasion'),
  ('Accessories', 'accessories', 'Other fashion accessories')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
DO $$
DECLARE
  cat_earrings INTEGER;
  cat_hair_clips INTEGER;
  cat_bracelets INTEGER;
  cat_necklaces INTEGER;
  cat_accessories INTEGER;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_earrings FROM categories WHERE slug = 'earrings';
  SELECT id INTO cat_hair_clips FROM categories WHERE slug = 'hair-clips';
  SELECT id INTO cat_bracelets FROM categories WHERE slug = 'bracelets';
  SELECT id INTO cat_necklaces FROM categories WHERE slug = 'necklaces';
  SELECT id INTO cat_accessories FROM categories WHERE slug = 'accessories';

  -- Insert products
  INSERT INTO products (name, slug, description, price, compare_price, category_id, images, variants, featured) VALUES
    (
      'Pearl Drop Earrings',
      'pearl-drop-earrings',
      'Elevate your elegance with these stunning freshwater pearl drop earrings. Crafted with 14k gold-filled findings, these earrings feature lustrous white pearls that catch the light beautifully. The delicate drop design adds a touch of sophistication to any outfit.',
      89.00,
      120.00,
      cat_earrings,
      '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop"]',
      '[{"size": "one-size", "color": "white", "material": "gold-filled"}, {"size": "one-size", "color": "white", "material": "sterling-silver"}]',
      true
    ),
    (
      'Crystal Hair Clip Set',
      'crystal-hair-clip-set',
      'Set of 3 crystal-embellished hair clips. Perfect for adding sparkle to your hairstyle. Each clip features precision-set crystals that catch the light with every movement.',
      65.00,
      NULL,
      cat_hair_clips,
      '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1583463977059-e3b5b926edbf?w=800&auto=format&fit=crop"]',
      '[{"size": "set-of-3", "color": "clear", "material": "crystal"}]',
      true
    ),
    (
      'Rose Gold Bracelet',
      'rose-gold-bracelet',
      'Delicate chain bracelet with rose gold plating and tiny charm. Adjustable length ensures a perfect fit. The minimalist design makes it versatile for everyday wear.',
      125.00,
      160.00,
      cat_bracelets,
      '["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop"]',
      '[{"size": "6.5\"", "color": "rose gold", "material": "gold-filled"}, {"size": "7\"", "color": "rose gold", "material": "gold-filled"}]',
      true
    ),
    (
      'Emerald Stud Earrings',
      'emerald-stud-earrings',
      'Vibrant green emerald studs set in sterling silver. These captivating gemstones are perfect for adding a pop of color to your look. Hypoallergenic posts for sensitive ears.',
      150.00,
      NULL,
      cat_earrings,
      '["https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1595631146944-59df94f05f36?w=800&auto=format&fit=crop"]',
      '[{"size": "8mm", "color": "emerald", "material": "sterling-silver"}, {"size": "10mm", "color": "emerald", "material": "sterling-silver"}]',
      true
    ),
    (
      'Gold Plated Hair Pins',
      'gold-plated-hair-pins',
      'Set of 5 delicate gold plated hair pins with crystal accents. Perfect for updos or everyday use. The subtle sparkle adds elegance to any hairstyle.',
      45.00,
      60.00,
      cat_hair_clips,
      '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1583463977059-e3b5b926edbf?w=800&auto=format&fit=crop"]',
      '[{"size": "set-of-5", "color": "gold", "material": "gold-plated"}]',
      false
    ),
    (
      'Silver Link Necklace',
      'silver-link-necklace',
      'Classic silver chain necklace with adjustable length. The timeless design complements any outfit. Made from genuine sterling silver for lasting beauty.',
      95.00,
      NULL,
      cat_necklaces,
      '["https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop"]',
      '[{"size": "16-18\"", "color": "silver", "material": "sterling-silver"}]',
      false
    ),
    (
      'Pearl Stud Earrings',
      'pearl-stud-earrings',
      'Classic pearl studs in 14k white gold. Perfect for everyday elegance. Features lustrous Akoya pearls matched for size and color.',
      75.00,
      100.00,
      cat_earrings,
      '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-7642562453-611c49978018?w=800&auto=format&fit=crop"]',
      '[{"size": "7mm", "color": "white", "material": "white-gold"}, {"size": "8mm", "color": "white", "material": "white-gold"}, {"size": "9mm", "color": "white", "material": "white-gold"}]',
      false
    ),
    (
      'Velvet Hair Band',
      'velvet-hair-band',
      'Elegant velvet hair band with crystal embellishment. The wide band adds vintage-inspired glamour to any occasion. Available in multiple colors.',
      55.00,
      70.00,
      cat_hair_clips,
      '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1583463977059-e3b5b926edbf?w=800&auto=format&fit=crop"]',
      '[{"size": "one-size", "color": "black", "material": "velvet"}, {"size": "one-size", "color": "burgundy", "material": "velvet"}, {"size": "one-size", "color": "navy", "material": "velvet"}]',
      false
    ),
    (
      'Gemstone Bracelet',
      'gemstone-bracelet',
      'Beautiful multi-gemstone bracelet with sterling silver links. Features amethyst, citrine, and peridot. The perfect accessory for special occasions.',
      185.00,
      220.00,
      cat_bracelets,
      '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop"]',
      '[{"size": "7\"", "color": "multi", "material": "sterling-silver"}]',
      true
    ),
    (
      'Choker Necklace',
      'choker-necklace',
      'Modern take on the classic choker. Features delicate chain with small pendant. Adjustable length for a perfect fit.',
      65.00,
      NULL,
      cat_necklaces,
      '["https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop"]',
      '[{"size": "14-16\"", "color": "silver", "material": "sterling-silver"}, {"size": "14-16\"", "color": "gold", "material": "gold-filled"}]',
      false
    );
END $$;

-- Create a default admin user function (requires manual execution after setting up auth)
-- This is a placeholder - admin role should be assigned via Supabase dashboard
-- UPDATE users SET role = 'admin' WHERE email = 'admin@elegantfinds47.com';

COMMENT ON TABLE categories IS 'Product categories for the e-commerce platform';
COMMENT ON TABLE products IS 'Product catalog with variants and images';
COMMENT ON TABLE users IS 'Extended user profiles (extends auth.users)';
COMMENT ON TABLE cart_items IS 'Shopping cart items for logged-in users';
COMMENT ON TABLE orders IS 'Customer orders with shipping and payment info';
COMMENT ON TABLE order_items IS 'Items within each order';
