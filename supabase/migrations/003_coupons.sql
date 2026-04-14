-- ----------------------------
-- Table: coupons
-- ----------------------------
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value DECIMAL(10,2) NOT NULL CHECK (value > 0),
    min_purchase DECIMAL(10,2) DEFAULT 0 CHECK (min_purchase >= 0),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0 NOT NULL,
    expires_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read of active coupons (for validation)
CREATE POLICY "Coupons are viewable by everyone" ON coupons
    FOR SELECT USING (active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Allow admin management of coupons
CREATE POLICY "Admins can manage coupons" ON coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
            AND users.email = 'mounikainti15@gmail.com'
        )
    );

-- Seed some sample coupons
INSERT INTO coupons (code, discount_type, value, min_purchase, usage_limit, active) VALUES
    ('WELCOME10', 'percentage', 10, 0, NULL, true),
    ('ELEGANT500', 'fixed', 500, 5000, 100, true),
    ('FIRSTORDER', 'percentage', 15, 1000, NULL, true)
ON CONFLICT (code) DO NOTHING;
