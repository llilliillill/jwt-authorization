const UserModel = require('../models/user-model')
const MailService = require('../service/mail-service')
const TokenService = require('../service/token-service')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const ApiError = require('../exeptions/api-error')

class UserService {

    async registration(email, username, password) {
        // Убедится что в БД с таким email нет записи
        const condidate = await UserModel.checkExistsEmail(email)

        if (condidate) {
            throw ApiError.BadRequest(`Пользователь с таким адресом: ${ email } уже существует`)
        }

        // Хешируем пароль
        const hashPassword = await bcrypt.hash(password, 3)

        // Генерируем cсылку для подтверждения почты
        const activateLink = uuid.v4()

        // Создаем пользователя
        await UserModel.createUser({ 
            email, 
            username, 
            password: hashPassword, 
            activateLink 
        })

        // Отправляем ссылку на указанную почту для активации аккаунта
        await MailService.sendActivationMail(email, 
            `${ process.env.API_URL }/api/activate/${activateLink}`
        )

        // Получаем только что созданного пользователя
        const user = await UserModel.getUserByEmail(email)

        const userObj = {
            id: user.id, 
            email: user.email, 
            isActivated: user.isActivated
        }

        // Генерируем токены access и refresh
        const tokens = TokenService.generateTokens({ ...userObj })

        // Сохраняем refresh
        await TokenService.saveToken(userObj.id, tokens.refrashToken)

        return { ...tokens, user: userObj }
    }

    async activate(activationLink) {
        // Ищем пользователя по ссылке activationLink
        const user_id = await UserModel.checkActivationLink(activationLink)

        // Убедимся что пользователь с такой ссылкой существует
        if (!user_id) {
            throw ApiError.BadRequest('Некоректная ссылка авторизации')
        }

        // Меняем у пользователя поле isActivated на true
        await UserModel.changeIsActivated(user_id)
    }

    async login(email, password) {
        // Ищем пользователя с указанным email
        let user = await UserModel.checkExistsEmail(email)

        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }

        // Сравниваем пароли
        const isPassEquals = await bcrypt.compare(password, user.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        // Получаем пользователя
        user = await UserModel.getUserByEmail(email)

        const userObj = {
            id: user.id, 
            email: user.email, 
            isActivated: user.isActivated
        }

        // Генерируем пару токенов
        const tokens = TokenService.generateTokens({ ...userObj })

        // Сохраняем refresh токен
        await TokenService.saveToken(userObj.id, tokens.refrashToken)

        return { ...tokens, user: userObj }
    }

    async logout(refrashToken) {
        return await TokenService.removeToken(refrashToken)
    }

    async refresh(refrashToken) {
        if (!refrashToken) {
            ApiError.UnauthorizedError()
        }

        // Валидируем токен
        const userData = await TokenService.validateRefrashToken(refrashToken)
        const tokenFromDb = await TokenService.findToken(refrashToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        // Вытаскиваем пользователя из бд за 60 дней инф. о нем могла поменяться
        const user = await UserModel.getUserById(userData.id)

        const userObj = {
            id: user.id, 
            email: user.email, 
            isActivated: user.isActivated
        }

        // Генерируем пару токенов
        const tokens = TokenService.generateTokens({ ...userObj })

        // Сохраняем refresh токен
        await TokenService.saveToken(userObj.id, tokens.refrashToken)

        return { ...tokens, user: userObj }
    }

    async getAllUsers() {
        return await UserModel.getAllUsers()
    }

}

module.exports = new UserService()