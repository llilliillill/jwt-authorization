const Database = require('better-sqlite3');

module.exports = class UserDto {
    email;
    id;
    isActivated;

    constructor(user) {
        const db = new Database('./test.db');
        const res = db.prepare(`SELECT id, email, isActivated FROM users WHERE email = ?`).get(user.email)

        this.email = res.email;
        this.id = res.id;
        this.isActivated = res.isActivated;
    }
}