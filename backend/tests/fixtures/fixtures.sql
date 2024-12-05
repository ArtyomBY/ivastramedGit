-- SQL script to initialize test data for documents

INSERT INTO documents (title, content, patient_id, created_at) VALUES
('Test Document 1', 'Content for document 1', 1, NOW()),
('Test Document 2', 'Content for document 2', 2, NOW()),
('Test Document 3', 'Content for document 3', 1, NOW());
