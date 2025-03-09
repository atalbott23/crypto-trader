# Flexible Crypto Rebalancing + Data Storage Guide

Below is an updated summary incorporating a **flexible rebalancing** feature. This means your application will let **users** define their own distribution targets (e.g., 60% BTC / 30% ETH / 10% Stable), **frequency** (daily, weekly, monthly), and **threshold** (+/- drift percentage).

---

## 1. Trading Strategy (Flexible Version)

### Overview

- **User-Defined Allocations**  
  - Example: **60% BTC, 30% ETH, 10% Stablecoins**  
  - Another user might choose **50% BTC, 25% ETH, 25% SOL**, etc.  
- **Threshold-Based**  
  - Each user sets a **“drift tolerance”** (e.g., ±3%, ±5%, ±10%).  
- **Rebalancing Frequency**  
  - Users select **daily, weekly, monthly**, or even a purely **threshold-triggered** approach with no fixed interval.  

### Core Logic

1. **Fetch Balances**  
   - Convert each holding to USD value.  
2. **Compare to Target %**  
   - If any allocation is outside the user’s chosen threshold, **trigger** rebalancing.  
3. **Execute Trades**  
   - Sell over-allocated assets, buy under-allocated assets.  
4. **Log Transactions**  
   - Maintain a detailed trade log for auditing and tax purposes.

### Why Offer Flexibility?

- **User Customization**: Different investors have different risk tolerances and preferences.  
- **Scalability**: The code can handle more than just BTC, ETH, and stablecoins. Over time, you can add support for new assets (SOL, ADA, MATIC, etc.).  
- **Reduced Overtrading**: A user might prefer threshold-only rebalancing (no set frequency) to minimize trades, while another might prefer a monthly schedule.

---

## 2. Essential Data to Store (via Supabase)

Below is a more **generic** schema to handle flexible allocations and multiple assets per user.

### 1. Users

- **Table**: `users`
- **Fields**:
  - `id` (primary key)
  - `email`
  - `hashed_password` (or reference to Supabase Auth)
  - Other profile fields as needed.

### 2. Strategy Config / Preferences

- **Table**: `strategy_config`
- **Purpose**: Store each user’s **global** strategy defaults (like rebalancing frequency, threshold).
- **Fields**:
  - `user_id` (foreign key to `users.id`)
  - `rebalance_frequency` (e.g., daily, weekly, monthly, threshold-only)
  - `rebalance_threshold` (+/- 5% default, or user-defined)
  - `last_rebalance_date`
  - `created_at`, `updated_at`

### 3. User Allocations

- **Table**: `user_allocations`
- **Purpose**: Let users define the **distribution** they want across multiple assets.
- **Fields**:
  - `id` (primary key)
  - `user_id` (foreign key)
  - `asset_symbol` (e.g., `BTC`, `ETH`, `USDC`)
  - `target_percentage` (e.g., 70.0, 20.0, 10.0)
  - `created_at`, `updated_at`

> **Note**: This allows each user to have **multiple rows** describing different assets. Total should ideally sum to 100% (though your application might allow some tolerance).

### 4. API Keys / Exchange Connections

- **Table**: `exchange_connections`
- **Fields**:
  - `id` (primary key)
  - `user_id` (foreign key)
  - `exchange_name` (e.g., “Robinhood”, “CoinbasePro”)
  - `api_key` / `api_secret` / `access_token`
  - `created_at`, `updated_at`

### 5. Portfolio Snapshots

- **Table**: `portfolio_snapshots`
- **Purpose**: Track the user’s holdings over time for performance and rebalancing logic.
- **Fields**:
  - `id` (primary key)
  - `user_id` (foreign key)
  - `timestamp`
  - **Optional**: a JSON field storing the entire breakdown (e.g., `{"BTC": 0.05, "ETH": 1.2, "USDC": 500}`).
  - `total_value_usd`

### 6. Trades / Transactions

- **Table**: `trades`
- **Purpose**: Record each buy/sell event for audit, tax, and debugging.
- **Fields**:
  - `id` (primary key)
  - `user_id` (foreign key)
  - `exchange_name`
  - `asset_symbol`
  - `side` (buy/sell)
  - `quantity`
  - `price` (in USD)
  - `usd_value` (quantity * price)
  - `timestamp`
  - **Optional**: `fees`, `order_id`, `order_type` (market/limit)

### 7. Bot Activity / Error Logs

- **Table**: `bot_activity_log`
- **Purpose**: Capture system-level or user-level events for transparency.
- **Fields**:
  - `id` (primary key)
  - `user_id` (or nullable if system-level)
  - `event_type` (e.g., “rebalance_triggered”, “api_error”)
  - `description` (text or JSON)
  - `timestamp`

---

## 3. Rebalancing Flow (Flexible Version)

1. **Scheduled Check or Event Trigger**  
   - If `rebalance_frequency` is daily, the system runs each day.  
   - If user selected threshold-only, the system might run every hour/day to check if a drift threshold is breached.

2. **Fetch Balances**  
   - For each user, query the exchange API (using `exchange_connections`) for current holdings.  
   - Convert balances to USD.

3. **Calculate Allocation**  
   - Compare current % distribution (e.g., BTC at 68%, ETH at 22%, USDC at 10%) to user’s target (e.g., 70/20/10).  
   - If outside `rebalance_threshold`, trigger trades.

4. **Execute Trades**  
   - Sell over-allocated assets; buy under-allocated ones until the target is met.  
   - If the user has multiple assets, handle them iteratively or systematically (e.g., sell from biggest overweight asset first, buy the biggest underweight asset next).

5. **Log & Update**  
   - Insert trades into `trades`.  
   - Store a new record in `portfolio_snapshots`.  
   - Update `bot_activity_log` if there were errors or notable events (e.g., “rebalance executed” or “API error: insufficient funds”).

---

## 4. Key Considerations

1. **Validation**  
   - Ensure user allocations add up to 100% or close to it (handle minor rounding).  
   - Validate user’s thresholds and frequencies to avoid nonsensical values.

2. **Security**  
   - Protect API keys / secrets with encryption.  
   - Implement **Row Level Security** (RLS) so each user only sees their data.

3. **Fees & Spreads**  
   - Even if “commission-free,” watch for exchange spreads.  
   - Fewer trades can reduce potential slippage or hidden costs.

4. **Tax Implications**  
   - Each rebalance can be a taxable event.  
   - Detailed `trades` records are critical for user reporting.

5. **Scaling**  
   - If you have many users, schedule or queue rebalancing tasks so you don’t overload APIs.  
   - Index commonly queried columns (`user_id`, `timestamp`) in Supabase for performance.

6. **Notifications & UX**  
   - Optionally, notify the user (email/SMS) when a rebalance occurs or if an API key fails.  
   - Provide a dashboard summarizing asset allocations, historical performance, upcoming rebalances, etc.

---

## 5. Final Summary

1. **Flexible Strategy**  
   - Let users define **target allocations** and **rebalance frequency/threshold**.  
   - Provides user autonomy and accommodates different risk profiles.

2. **Data Model**  
   - **Users, Strategy Config, Allocations** to store their chosen structure.  
   - **Portfolio Snapshots, Trades, Bot Logs** to track real-time activity, history, and debug info.

3. **Automation**  
   - A background process checks user allocations vs. real holdings.  
   - Executes trades if thresholds are breached or time-based rebalancing is due.  
   - Logs everything in Supabase for transparency and analytics.

By supporting user-specific allocation and scheduling, you give each investor the freedom to tailor the **rebalancing strategy** to their personal needs—all while preserving a robust, audit-friendly data trail in your Supabase backend.
