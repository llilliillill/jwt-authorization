const Database = require('better-sqlite3')

class TokenModel {
    db = new Database('./test.db')

    async createToken(user_id, refrashToken) {
        this.db.prepare(
            `INSERT INTO tokens(
                user,
                refrashToken
            ) VALUES (?, ?)`
        ).run(
            user_id,
            refrashToken
        )
    }

    async checkExistsToken(user_id) {
        let result = false

        const token = this.db.prepare(`
            SELECT refrashToken FROM tokens WHERE user = ?
        `).get(user_id)

        if (token) {
            result = true
        }

        return result 
    }

    async updateToken(user_id, refrashToken) {
        this.db.prepare(`
            UPDATE tokens SET refrashToken = ? WHERE user = ?
        `).run(refrashToken, user_id)
    }

    async deleteToken(refrashToken) {
        this.db.prepare(`
            DELETE FROM tokens WHERE refrashToken = ?
        `).run(refrashToken)
    }

    async findToken(refrashToken) {
        return this.db.prepare(`
            SELECT * FROM tokens WHERE refrashToken = ?
        `).get(refrashToken)
    }
}

module.exports = new TokenModel()