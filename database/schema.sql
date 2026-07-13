-- =====================================
-- LeakGuard Database Schema
-- PostgreSQL (Supabase)
-- =====================================

-- Extensions

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-------------------------------------------------
-- ADMINS
-------------------------------------------------

CREATE TABLE public.admins (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-------------------------------------------------
-- EMPLOYEES
-------------------------------------------------

CREATE TABLE public.employees (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id VARCHAR(20) UNIQUE NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    department VARCHAR(100),

    extension_token TEXT,

    activation_key VARCHAR(50),

    status VARCHAR(20) DEFAULT 'Active',

    extension_installed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-------------------------------------------------
-- POLICIES
-------------------------------------------------

CREATE TABLE public.policies (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    policy_name VARCHAR(100) NOT NULL,

    category VARCHAR(50),

    pattern TEXT NOT NULL,

    severity VARCHAR(20),

    action VARCHAR(20),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-------------------------------------------------
-- ACTIVITY LOGS
-------------------------------------------------

CREATE TABLE public.activity_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,

    ai_tool VARCHAR(100),

    website_url TEXT,

    detected_items TEXT[],

    severity VARCHAR(20),

    action_taken VARCHAR(30),

    status VARCHAR(20) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-------------------------------------------------
-- ALERTS
-------------------------------------------------

CREATE TABLE public.alerts (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    activity_log_id UUID REFERENCES activity_logs(id) ON DELETE CASCADE,

    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,

    message TEXT,

    severity VARCHAR(20),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);