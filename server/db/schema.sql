-- PostgreSQL Schema for LandPulse GIS & Parcel Inspection Module

-- 1. Parcels Table
CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(50) PRIMARY KEY,
    survey_no VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    area_extent VARCHAR(50) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('completed', 'in_progress', 'dispute', 'not_started')),
    coordinates JSONB NOT NULL, -- Array of [lat, lng] points: [[12.9280, 79.1420], ...]
    centroid JSONB NOT NULL,    -- [lat, lng]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inspections Table
CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    parcel_id VARCHAR(50) NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
    required BOOLEAN DEFAULT TRUE,
    reason TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    last_inspected_on DATE,
    assigned_officer VARCHAR(255),
    due_date DATE,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast spatial & inspection queries
CREATE INDEX IF NOT EXISTS idx_parcels_status ON parcels(status);
CREATE INDEX IF NOT EXISTS idx_parcels_district ON parcels(district_name);
CREATE INDEX IF NOT EXISTS idx_parcels_project ON parcels(project_name);
CREATE INDEX IF NOT EXISTS idx_inspections_required ON inspections(required);
CREATE INDEX IF NOT EXISTS idx_inspections_priority ON inspections(priority);
