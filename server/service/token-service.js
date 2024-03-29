const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model');

class TokenService {

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '30m'
        })

        // Нет редиректа если просрочен токен через 30д
        const refrashToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '30d'
        })

        return {
            accessToken,
            refrashToken
        }
    }

    async validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    }

    async validateRefrashToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refrashToken) {
        // Перед тем как сохранять токен мы попробуем найти по такому userid токен в БД
        const tokenData = await TokenModel.checkExistsToken(userId);

        // Если нашли токен то перезапишем его
        if (tokenData) {
            await TokenModel.updateToken(userId, refrashToken)
            //! console.log('Перезаписываем токен ...')
        } else {
            // Если не нашли токен то создадим его
            await TokenModel.createToken(userId, refrashToken)
            //! console.log('Создаем токен ...')
        }

        return {
            userId,
            refrashToken
        }
    }

    async removeToken(refrashToken) {
        const tokenData = await TokenModel.deleteToken(refrashToken);
        return tokenData;
    }

    async findToken(refrashToken) {
        const tokenData = await TokenModel.findToken(refrashToken);
        return tokenData;
    }

}

module.exports = new TokenService();