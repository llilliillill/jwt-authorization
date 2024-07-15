const Database = require('better-sqlite3')

class UserModel {

    db = new Database('./test.db')

    async checkExistsEmail(email) {
        return this.db.prepare(`
            SELECT id, email, username, password FROM users WHERE email = ?
        `).get(email)
    }

    async createUser(user) {
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
        )

        return user
    }

    async checkActivationLink(activationLink) {
        let user_id = ''

        const user = this.db.prepare(`
            SELECT id FROM users WHERE activationLink = ?
        `).get(activationLink)

        if (user) {
            user_id = user.id
        }

        return user_id 
    }

    async changeIsActivated(user_id) {
        this.db.prepare(`
            UPDATE users 
            SET isActivated = ?, 
                activationLink = ? 
            WHERE id = ?
        `).run(1, '', user_id)
    }

    async getUserById(user_id) {
        return this.db.prepare(`
            SELECT * FROM users WHERE id = ?
        `).get(user_id)
    }

    async getUserByEmail(email) {
        return this.db.prepare(`SELECT 
            id, email, isActivated FROM users WHERE email = ?
        `).get(email)
    }

    async getAllUsers() {
        return this.db.prepare(`
            SELECT * FROM users
        `).all()
    }
    
}

module.exports = new UserModel()