-- ----------------------------
-- Table: store_settings
-- ----------------------------
CREATE TABLE IF NOT EXISTS store_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read of settings
CREATE POLICY "Store settings are viewable by everyone" ON store_settings
    FOR SELECT USING (true);

-- Allow admin write of settings
CREATE POLICY "Admins can manage store settings" ON store_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
            AND users.email = 'mounikainti15@gmail.com'
        )
    );

-- Initial settings seed
INSERT INTO store_settings (key, value, description) VALUES
    ('site_config', '{
        "name": "Elegant Finds",
        "email": "mounikainti15@gmail.com",
        "phone": "+91 9123456789",
        "address": "Hyderabad, Telangana, India",
        "currency": "INR",
        "free_shipping_threshold": 2000
    }', 'General site configuration'),
    ('social_links', '{
        "instagram": "https://instagram.com/elegantfinds",
        "facebook": "https://facebook.com/elegantfinds",
        "pinterest": "https://pinterest.com/elegantfinds"
    }', 'Social media links')
ON CONFLICT (key) DO NOTHING;
