const Database = require('better-sqlite3');

class TokenModel {

    db = new Database('./test.db');

    async createToken(userId, refrashToken) {
        // Создать token
        this.db.prepare(
            `INSERT INTO tokens(
                user,
                refrashToken
            ) VALUES (?, ?)`
        ).run(
            userId,
            refrashToken
        );

        //! console.log(`Новый созданный токен: ${ refrashToken }`)
    }

    async checkExistsToken(userId) {
        let result = false

        // Проверяем есть ли пользователь с таким token
        const token = this.db.prepare(`SELECT refrashToken FROM tokens WHERE user = ?`).get(userId);

        if (token) {
            result = true
        }

        return result 
    }

    async updateToken(userId, refrashToken) {
        // Обновляем refrashToken
        this.db.prepare(`UPDATE tokens SET refrashToken = ? WHERE user = ?`).run(refrashToken, userId);

        //! console.log(`Новый перезаписаный токен: ${ refrashToken }`)
    }

    async deleteToken(refrashToken) {
        this.db.prepare(`DELETE FROM tokens WHERE refrashToken = ?`).run(refrashToken);
        //! console.log('Токен удален')
    }

    async findToken(refrashToken) {
        return this.db.prepare(`SELECT * FROM tokens WHERE refrashToken = ?`).get(refrashToken);
    }
}

module.exports = new TokenModel(); 