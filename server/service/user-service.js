const UserModel = require('../models/user-model');
const MailService = require('../service/mail-service');
const TokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require('../exeptions/api-error');

class UserService {

    async registration(email, username, password) {
        // Убедится что в БД с таким email нет записи
        const condidate = await UserModel.checkExistsEmail(email)

        if (condidate) {
            throw ApiError.BadRequest(`Пользователь с таким адресом: ${ email } уже существует`)
        }

        // Хешируем пароль
        const hashPassword = await bcrypt.hash(password, 3)

        // Ссылка для подтверждения отправляемая на почту
        const activateLink = uuid.v4();

        // Если условие не выполнилось то создаем пользователя и сохраняем его в БД
        const user = await UserModel.createUser({ email, username, password: hashPassword, activateLink })

        // Отправка email с ссылкой подтверждения 
        //! Сейчас не отправляется выводим в консоль
        await MailService.sendActivationMail(email, `${ process.env.API_URL }/api/activate/${activateLink}`);

        // Информация о пользователе без пароля и чего либо
        // Выкидываем из модели лишние поля
        const userDto = new UserDto(user); // id, email, isActivated

        // Генерируем токен access и refresh
        const tokens = TokenService.generateTokens({ ...userDto });

        // Сохраняем refresh токен в БД
        await TokenService.saveToken(userDto.id, tokens.refrashToken);

        return { ...tokens, user: userDto }
    }

    async activate(activationLink) {
        // Ищем пользователя в БД по ссылке activationLink
        const userID = await UserModel.checkActivationLink(activationLink);

        // Убедимся что пользователь с такой ссылкой в БД существует
        if (!userID) {
            throw ApiError.BadRequest('Некоректная ссылка авторизации');
        }

        // Меняем у пользователя поле isActivated на true
        await UserModel.changeIsActivated(userID);
    }

    async login(email, password) {
        // Ищем пользователя с указанным email в БД
        const user = await UserModel.checkExistsEmail(email);

        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        // Сравниваем пароли
        const isPassEquals = await bcrypt.compare(password, user.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        // Из модели выбрасываем все ненужное
        const userDto = new UserDto(user);

        // Генерируем пару токенов
        const tokens = TokenService.generateTokens({ ...userDto });

        // Сохраняем refresh токен в БД
        await TokenService.saveToken(userDto.id, tokens.refrashToken);

        return { ...tokens, user: userDto }
    }

    async logout(refrashToken) {
        return await TokenService.removeToken(refrashToken);
    }

    async refresh(refrashToken) {
        if (!refrashToken) {
            ApiError.UnauthorizedError();
        }

        // Валидируем токен
        const userData = await TokenService.validateRefrashToken(refrashToken);
        const tokenFromDb = await TokenService.findToken(refrashToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        // Вытаскиваем пользователя из бд за 60 дней инф. о нем могла поменяться
        const user = await UserModel.findById(userData.id)

        // Из модели выбрасываем все ненужное
        const userDto = new UserDto(user);

        // Генерируем пару токенов
        const tokens = TokenService.generateTokens({ ...userDto });

        // Сохраняем refresh токен в БД
        await TokenService.saveToken(userDto.id, tokens.refrashToken);

        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        return await UserModel.getAllUsers();
    }

}

module.exports = new UserService(); 