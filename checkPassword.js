const bcrypt = require('bcryptjs');

const passwordToCheck = 'Test123!';
const storedHash = '$2a$10$6jM7.1R8dVvak4WEWjc9AO/BAOjB1CHMiMxF/n1s9jWBTzHKm9nYe';

bcrypt.compare(passwordToCheck, storedHash, (err, result) => {
    if (err) {
        console.error('Error comparing password:', err);
    } else {
        console.log('Password match:', result);
    }
});
