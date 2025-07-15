-- Luxury Resort Survey Database Schema
-- Execute this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    room_number VARCHAR(10) NOT NULL UNIQUE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest_services table
CREATE TABLE IF NOT EXISTS guest_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('restaurants', 'spa', 'activities', 'room_service', 'housekeeping')),
    used_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    room_number VARCHAR(10) NOT NULL,
    submit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    restaurant_rating INTEGER CHECK (restaurant_rating >= 1 AND restaurant_rating <= 3),
    spa_rating INTEGER CHECK (spa_rating >= 0 AND spa_rating <= 100),
    activity_rating INTEGER CHECK (activity_rating >= 0 AND activity_rating <= 100),
    room_service_rating VARCHAR(20) CHECK (room_service_rating IN ('fast', 'slow', 'no-show')),
    housekeeping_rating INTEGER CHECK (housekeeping_rating >= 1 AND housekeeping_rating <= 5),
    additional_comments TEXT
);

-- Create survey_questions table (for admin dashboard)
CREATE TABLE IF NOT EXISTS survey_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('stars', 'slider', 'radio', 'emoji', 'text')),
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
INSERT INTO guests (name, email, room_number, check_in_date, check_out_date) VALUES
    ('María González', 'maria.gonzalez@email.com', '101', '2024-01-10', '2024-01-20'),
    ('Carlos Mendoza', 'carlos.mendoza@email.com', '205', '2024-01-12', '2024-01-18'),
    ('Ana Rodríguez', 'ana.rodriguez@email.com', '312', '2024-01-08', '2024-01-15')
ON CONFLICT (room_number) DO NOTHING;

-- Insert sample guest services
INSERT INTO guest_services (guest_id, service_type, used_date) 
SELECT g.id, 'restaurants', '2024-01-11' FROM guests g WHERE g.room_number = '101'
UNION ALL
SELECT g.id, 'spa', '2024-01-12' FROM guests g WHERE g.room_number = '101'
UNION ALL
SELECT g.id, 'activities', '2024-01-13' FROM guests g WHERE g.room_number = '101'
UNION ALL
SELECT g.id, 'room_service', '2024-01-11' FROM guests g WHERE g.room_number = '101'
UNION ALL
SELECT g.id, 'housekeeping', '2024-01-10' FROM guests g WHERE g.room_number = '101'
UNION ALL
SELECT g.id, 'restaurants', '2024-01-13' FROM guests g WHERE g.room_number = '205'
UNION ALL
SELECT g.id, 'spa', '2024-01-14' FROM guests g WHERE g.room_number = '205'
UNION ALL
SELECT g.id, 'activities', '2024-01-15' FROM guests g WHERE g.room_number = '205'
UNION ALL
SELECT g.id, 'room_service', '2024-01-13' FROM guests g WHERE g.room_number = '205'
UNION ALL
SELECT g.id, 'housekeeping', '2024-01-12' FROM guests g WHERE g.room_number = '205'
UNION ALL
SELECT g.id, 'restaurants', '2024-01-09' FROM guests g WHERE g.room_number = '312'
UNION ALL
SELECT g.id, 'spa', '2024-01-10' FROM guests g WHERE g.room_number = '312'
UNION ALL
SELECT g.id, 'activities', '2024-01-11' FROM guests g WHERE g.room_number = '312'
UNION ALL
SELECT g.id, 'room_service', '2024-01-09' FROM guests g WHERE g.room_number = '312'
UNION ALL
SELECT g.id, 'housekeeping', '2024-01-08' FROM guests g WHERE g.room_number = '312';

-- Insert sample survey questions
INSERT INTO survey_questions (category, question, question_type, options) VALUES
    ('restaurants', '¿Cómo calificarías tu experiencia gastronómica?', 'stars', '{"max": 3}'),
    ('spa', '¿Cómo te sientes después de tu experiencia en el spa?', 'slider', '{"labels": ["Tenso", "Calmado", "Relajado", "Renovado"]}'),
    ('activities', '¿Qué tan interesantes fueron las actividades?', 'slider', '{"labels": ["Aburrido", "Interesante", "Divertido", "Fascinante"]}'),
    ('room_service', '¿Cómo fue la velocidad del servicio a la habitación?', 'radio', '{"options": ["Rápido y eficiente", "Tardó más de lo esperado", "No llegó el pedido"]}'),
    ('housekeeping', '¿Cómo calificarías el servicio de limpieza?', 'emoji', '{"emojis": ["😞", "😐", "🙂", "😊", "🤩"]}');

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for the survey)
CREATE POLICY "Allow public read access to guests" ON guests
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to guest_services" ON guest_services
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to survey_responses" ON survey_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to survey_questions" ON survey_questions
    FOR SELECT USING (true);

-- Create policies for admin access (you can modify these based on your auth requirements)
CREATE POLICY "Allow admin full access to survey_responses" ON survey_responses
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access to guests" ON guests
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access to guest_services" ON guest_services
    FOR ALL USING (true);

CREATE POLICY "Allow admin full access to survey_questions" ON survey_questions
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_room_number ON guests(room_number);
CREATE INDEX IF NOT EXISTS idx_guest_services_guest_id ON guest_services(guest_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_guest_id ON survey_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_room_number ON survey_responses(room_number);
CREATE INDEX IF NOT EXISTS idx_survey_questions_category ON survey_questions(category); 