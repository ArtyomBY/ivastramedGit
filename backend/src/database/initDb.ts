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
