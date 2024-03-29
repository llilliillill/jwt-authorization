const Database = require('better-sqlite3');

class UserModel {

    db = new Database('./test.db');

    async checkExistsEmail(email) {
        // Проверяем есть ли пользователь с таким email
        return this.db.prepare(`SELECT id, email, username, password FROM users WHERE email = ?`).get(email)
    }

    async createUser(user) {
        // Сохраняем пользователя в БД
        this.db.prepare(
            `INSERT INTO users(
                email,
                username,
                password,
                isActivated,
                activationLink
            ) VALUES (?, ?, ?, ?, ?)`
        ).run(
            user.email,
            user.username,
            user.password,
            0,
            user.activateLink
        );

        return user;
    }

    async checkActivationLink(activationLink) {
        let userID = ''

        //! console.log('checkActivationLink: ' + activationLink)

        // Проверяем есть ли пользователь с таким token
        const user = this.db.prepare(`SELECT id FROM users WHERE activationLink = ?`).get(activationLink);

        if (user) {
            userID = user.id
        }

        return userID 
    }

    async changeIsActivated(userID) {
        this.db.prepare(`UPDATE users SET isActivated = ?, activationLink = ? WHERE id = ?`).run(1, '', userID);
    }

    async findById(userID) {
        return this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(userID)
    }

    async getAllUsers() {
        return this.db.prepare(`SELECT * FROM users`).all()
    }
    
}

module.exports = new UserModel(); 