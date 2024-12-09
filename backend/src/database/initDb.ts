import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

async function initializeDatabase() {
    try {
        // Чтение SQL файлов
        const schemaSQL = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );
        const seedSQL = fs.readFileSync(
            path.join(__dirname, 'seed.sql'),
            'utf8'
        );

        // Разделяем SQL-команды и выполняем их по одной
        console.log('Создание таблиц...');
        const schemaCommands = schemaSQL.split(';').filter(cmd => cmd.trim());
        for (const command of schemaCommands) {
            if (command.trim()) {
                await pool.query(command + ';');
            }
        }
        console.log('Таблицы успешно созданы');

        console.log('Обновление паролей...');
        const updatePasswordCommands = `
            UPDATE users SET password_hash = '$2a$10$6CneXIXqB7e64kGjc.glsOQrlb7z23dzj0OTyOxTbAhvJQ.CaAfXm' WHERE email = 'admin@example.com';
            UPDATE users SET password_hash = '$2a$10$KuY6MXFOIgR/oY40utMfOe.Ckjaff5g2ThA/x.iT6Q4pcRpupiKja' WHERE email = 'doctor@example.com';
            UPDATE users SET password_hash = '$2a$10$KIPKRs1qYdQGSfqSK3Aggeh/McQ/EtROgUYmsJ/ujqxSSrqU4oxVS' WHERE email = 'patient@example.com';
            UPDATE users SET password_hash = '$2a$10$aJq8ItzOX5JdFxqnPkQAruF42.COayGZFf4McBJKxtTbYObdiPHpe' WHERE email = 'registrar@example.com';
            UPDATE users SET password_hash = '$2a$10$JsbJV5zqAeZI58qZcbUft.sarU1LkX3zu4hvdT./QCujAK5hH5lJK' WHERE email = 'admin2@example.com';
            UPDATE users SET password_hash = '$2a$10$lVFch7OOvlHO2wSe48Z9k.zQGbLEEA3mpiM0uuN0njRqjzasvrkuK' WHERE email = 'doctor2@example.com';
            UPDATE users SET password_hash = '$2a$10$ocWNxNCYSqSEO.lFsWrHP.UI.4R7ed62eZyXtjKQG2yTH7Ugw6N06' WHERE email = 'patient2@example.com';
        `;
        const updateCommands = updatePasswordCommands.split(';').filter(cmd => cmd.trim());
        for (const command of updateCommands) {
            if (command.trim()) {
                await pool.query(command + ';');
            }
        }
        console.log('Пароли успешно обновлены');

        console.log('Заполнение тестовыми данными...');
        const seedCommands = seedSQL.split(';').filter(cmd => cmd.trim());
        for (const command of seedCommands) {
            if (command.trim()) {
                await pool.query(command + ';');
            }
        }
        console.log('Тестовые данные успешно добавлены');

        console.log('База данных успешно инициализирована');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        process.exit(1);
    }
}

initializeDatabase();
