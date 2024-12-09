const bcrypt = require('bcryptjs');

const users = [
    { email: 'admin@example.com', password: 'Test123!' },
    { email: 'doctor@example.com', password: 'Test123!' },
    { email: 'patient@example.com', password: 'Test123!' },
    { email: 'registrar@example.com', password: 'Test123!' },
    { email: 'admin2@example.com', password: 'Test123!' },
    { email: 'doctor2@example.com', password: 'Test123!' },
    { email: 'patient2@example.com', password: 'Test123!' },
];

async function updatePasswords() {
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(`User: ${user.email}, Hashed Password: ${hashedPassword}`);
    }
}

updatePasswords();
