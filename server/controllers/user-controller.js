const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController{
    //Функция next вызывает следующий в цепочке миддлвеер
    //Функция регистрации
    async registration(req, res, next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Щшибка при валидации', errors.array()))
            }
            //Вытаскиваем из тела запроса email, password
            const {email, password} = req.body
            //Передаем их в функцию регистрации из сервиса
            const userData = await userService.registration(email, password)
            //Рефреш токен будем хранить в cookie
            //httpOnly: true - чтобы эту куку нельзя было получать и изменять внутри браузера
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
            //Возвращаем эти данные на клиентв браузер
            return res.json(userData)
        } catch(e){
            next(e)
        }
    }
    
    // Функция для входа
    async login(req, res, next){
        try{
            //Из тела запроса вытаскиваем email, password
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            //Рефреш токен будем хранить в cookie
            //httpOnly: true - чтобы эту куку нельзя было получать и изменять внутри браузера
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
            //Возвращаем эти данные на клиентв браузер
            return res.json(userData)
        } catch(e){
            next(e)
        }
    }

    //Выходим и удаляем токен
    async logout(req, res, next){
        try{
            //Из куки вытаскиваем рефреш токен
            const {refreshToken} = req.cookies
            //Вызываем функцию логаут из user-service
            const token = await userService.logout(refreshToken)
            //Удаляем саму куки
            res.clearCookie('refreshToken')
            //Возвращаем ответ на клиент
            return res.json(token)
        } catch(e){
            next(e)
        }
    }

    async activate(req, res, next){
        try{
            //Из строки запроса получаем ссылку активации
            const activationLink = req.params.link
            //Вызываем функцию activate
            await userService.activate(activationLink)
            //Перекидываем пользователя на фронтенд
            return res.redirect(process.env.CLIENT_URL)
        } catch(e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch(e){
            next(e)
        }
    }

    async getUser(req, res, next){
        try{
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch(e){
            next(e)
        }
    }


}

module.exports = new UserController()