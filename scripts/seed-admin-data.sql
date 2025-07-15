-- Insertar datos de ejemplo para el panel de administración

-- Insertar huéspedes de ejemplo
INSERT INTO guests (name, email, room_number, check_in_date, check_out_date) VALUES
('María González', 'maria.gonzalez@email.com', '101', '2024-01-10', '2024-01-20'),
('Carlos Mendoza', 'carlos.mendoza@email.com', '205', '2024-01-12', '2024-01-18'),
('Ana Rodríguez', 'ana.rodriguez@email.com', '312', '2024-01-08', '2024-01-15'),
('Luis Martín', 'luis.martin@email.com', '156', '2024-01-14', '2024-01-21'),
('Carmen Silva', 'carmen.silva@email.com', '278', '2024-01-11', '2024-01-17');

-- Insertar servicios utilizados
INSERT INTO guest_services (guest_id, service_type, used_date)
SELECT g.id, 'restaurants', g.check_in_date + INTERVAL '1 day'
FROM guests g;

INSERT INTO guest_services (guest_id, service_type, used_date)
SELECT g.id, 'spa', g.check_in_date + INTERVAL '2 days'
FROM guests g
WHERE g.room_number IN ('101', '205', '312');

INSERT INTO guest_services (guest_id, service_type, used_date)
SELECT g.id, 'activities', g.check_in_date + INTERVAL '3 days'
FROM guests g;

INSERT INTO guest_services (guest_id, service_type, used_date)
SELECT g.id, 'room_service', g.check_in_date + INTERVAL '1 day'
FROM guests g
WHERE g.room_number IN ('101', '205', '278');

INSERT INTO guest_services (guest_id, service_type, used_date)
SELECT g.id, 'housekeeping', g.check_in_date
FROM guests g;

-- Insertar preguntas de la encuesta
INSERT INTO survey_questions (category, question, question_type, options, display_order) VALUES
('Restaurantes', '¿Cómo calificarías tu experiencia gastronómica?', 'stars', '["1 estrella", "2 estrellas", "3 estrellas"]', 1),
('Spa', '¿Cómo te sentiste después de tu visita al spa?', 'slider', '["Tenso", "Calmado", "Relajado", "Renovado"]', 2),
('Actividades', '¿Qué te parecieron nuestras experiencias y tours?', 'slider', '["Aburrido", "Interesante", "Divertido", "Fascinante"]', 3),
('Room Service', '¿Cómo fue la puntualidad del servicio a la habitación?', 'radio', '["Rápido y eficiente", "Tardó más de lo esperado", "No llegó el pedido"]', 4),
('Limpieza', 'Califica el servicio de housekeeping', 'emoji', '["😞", "😐", "🙂", "😊", "🤩"]', 5);

-- Insertar respuestas de ejemplo
INSERT INTO survey_responses (guest_id, room_number, restaurant_rating, spa_rating, activity_rating, room_service_rating, housekeeping_rating, additional_comments)
SELECT 
  g.id,
  g.room_number,
  3,
  75,
  100,
  'fast',
  5,
  'Experiencia excepcional, especialmente el spa y las actividades acuáticas.'
FROM guests g WHERE g.room_number = '101';

INSERT INTO survey_responses (guest_id, room_number, restaurant_rating, spa_rating, activity_rating, room_service_rating, housekeeping_rating, additional_comments)
SELECT 
  g.id,
  g.room_number,
  2,
  50,
  75,
  'slow',
  4,
  'Muy buena estancia, aunque el room service podría mejorar en tiempos.'
FROM guests g WHERE g.room_number = '205';

INSERT INTO survey_responses (guest_id, room_number, restaurant_rating, spa_rating, activity_rating, room_service_rating, housekeeping_rating, additional_comments)
SELECT 
  g.id,
  g.room_number,
  3,
  100,
  75,
  'fast',
  5,
  'Perfecto en todos los aspectos. El personal es excepcional.'
FROM guests g WHERE g.room_number = '312';
