-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    -- Note: Password handling is typically managed by Supabase Auth
    -- Including this field for reference but it would be managed by Supabase Auth
    hashed_password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Strategy Configuration Table
CREATE TABLE strategy_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rebalance_frequency TEXT NOT NULL CHECK (rebalance_frequency IN ('daily', 'weekly', 'monthly', 'threshold-only')),
    rebalance_threshold DECIMAL(5,2) NOT NULL DEFAULT 5.00 CHECK (rebalance_threshold > 0),
    last_rebalance_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id) -- Each user can only have one strategy configuration
);

-- User Asset Allocations Table
CREATE TABLE user_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_symbol TEXT NOT NULL,
    target_percentage DECIMAL(5,2) NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, asset_symbol) -- Each user can only have one allocation per asset
);

-- Exchange Connections Table
CREATE TABLE exchange_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exchange_name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_secret TEXT NOT NULL,
    access_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Snapshots Table
CREATE TABLE portfolio_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    holdings JSONB NOT NULL, -- Store detailed breakdown of holdings
    total_value_usd DECIMAL(18,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset Details Table
CREATE TABLE assets (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_stablecoin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trades/Transactions Table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exchange_name TEXT NOT NULL,
    asset_symbol TEXT NOT NULL REFERENCES assets(symbol),
    side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
    quantity DECIMAL(18,8) NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    usd_value DECIMAL(18,2) NOT NULL,
    fees DECIMAL(18,2) DEFAULT 0,
    order_id TEXT,
    order_type TEXT DEFAULT 'market' CHECK (order_type IN ('market', 'limit')),
    rebalance_id UUID, -- Optional reference to a rebalance event
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rebalance Events Table
CREATE TABLE rebalance_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('scheduled', 'threshold', 'manual')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bot Activity/Error Logs Table
CREATE TABLE bot_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for system-level events
    rebalance_id UUID REFERENCES rebalance_events(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    description TEXT,
    metadata JSONB, -- For additional structured data
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Price History Table (for historical tracking)
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_symbol TEXT NOT NULL REFERENCES assets(symbol),
    price_usd DECIMAL(18,2) NOT NULL,
    volume_24h DECIMAL(18,2),
    market_cap DECIMAL(18,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_user_allocations_user_id ON user_allocations(user_id);
CREATE INDEX idx_portfolio_snapshots_user_id_timestamp ON portfolio_snapshots(user_id, timestamp);
CREATE INDEX idx_trades_user_id_timestamp ON trades(user_id, timestamp);
CREATE INDEX idx_trades_asset_symbol ON trades(asset_symbol);
CREATE INDEX idx_bot_activity_user_id_timestamp ON bot_activity_log(user_id, timestamp);
CREATE INDEX idx_price_history_asset_symbol_timestamp ON price_history(asset_symbol, timestamp);
CREATE INDEX idx_rebalance_events_user_id ON rebalance_events(user_id);

-- Create RLS Policies
-- Note: After implementing these tables, you would need to set up Row Level Security
-- Here's a template for the policies:

-- Example RLS policy for user_allocations
ALTER TABLE user_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_allocations_user_isolation
ON user_allocations
FOR ALL
USING (auth.uid() = user_id);

-- Update Triggers
-- Create a function to update the updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_strategy_config_updated_at
BEFORE UPDATE ON strategy_config
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_allocations_updated_at
BEFORE UPDATE ON user_allocations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_exchange_connections_updated_at
BEFORE UPDATE ON exchange_connections
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rebalance_events_updated_at
BEFORE UPDATE ON rebalance_events
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
