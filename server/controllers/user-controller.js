require('dotenv').config()
const UserService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exeptions/api-error');

class UserController {

    async registration(req, res, next) {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const { email, username, password } = req.body
            const userData = await UserService.registration(email, username, password)

            res.cookie('refrashToken', userData.refrashToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true
            })

            return res.json(userData)
        } catch(e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await UserService.login(email, password)

            res.cookie('refrashToken', userData.refrashToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true
            })

            return res.json(userData)
        } catch(e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refrashToken } = req.cookies;
            const token = await UserService.logout(refrashToken);
            res.clearCookie('refrashToken');
            return res.json(token);
        } catch(e) {
            next(e);
        }
    }    

    async activate(req, res, next) {
        try {
            // получаем ссылку из адресной стороки
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch(e) {
            next(e);
        }
    }    

    async refresh(req, res, next) {
        try {
            const { refrashToken } = req.cookies;
            const userData = await UserService.refresh(refrashToken);

            res.cookie('refrashToken', userData.refrashToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true
            })

            return res.json(userData)
        } catch(e) {
            next(e);
        }
    }    

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch(e) {
            next(e);
        }
    }    


}

module.exports = new UserController();