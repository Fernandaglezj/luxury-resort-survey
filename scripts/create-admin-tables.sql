-- Crear tablas para el sistema de administración

-- Tabla de huéspedes
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  room_number VARCHAR(10) NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios utilizados por huéspedes
CREATE TABLE IF NOT EXISTS guest_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('restaurants', 'spa', 'activities', 'room_service', 'housekeeping')),
  used_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de respuestas de encuestas
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
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preguntas de la encuesta
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('stars', 'slider', 'radio', 'emoji', 'text')),
  options JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_guests_room_number ON guests(room_number);
CREATE INDEX IF NOT EXISTS idx_guest_services_guest_id ON guest_services(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_services_service_type ON guest_services(service_type);
CREATE INDEX IF NOT EXISTS idx_survey_responses_guest_id ON survey_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submit_date ON survey_responses(submit_date);
CREATE INDEX IF NOT EXISTS idx_survey_questions_category ON survey_questions(category);
