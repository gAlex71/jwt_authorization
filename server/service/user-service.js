//Сервис для работы с пользователем
const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService{
    async registration(email, password){
        //Убеждаемся, что пользователя с таким email не существует
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        //Хешируем пароль
        const hashPassword = await bcrypt.hash(password, 3)
        //Возвращаем уникальную строчку
        const activationLink = uuid.v4()

        //Создаем пользователя и сохраняем в базу данных
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        //Добавляем функцию отправки письма на почту, для ее активации
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        //В параметр передаем модель(объект - user)
        const userDto = new UserDto(user)//Обладает тремя полями - id, email, isActivated
        const tokens = tokenService.generateTokens({...UserDto})

        //Сохраняем токен в базу данных
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    //Функция активации
    async activate(activationLink){
        //Ищем пользователя по этой ссылке
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        //Делаем пользователя активированным
        user.isActivated = true
        //Сохраняем 
        await user.save()
    }

    //Создаем функцию для логина
    async login(email, password){
        //Ищем пользователя с таким email
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('Пользователь не был найден')
        }
        //Сравниваем введенный пароль, и хешированный пароль из базы данных
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.BadRequest('Введен неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        //Сохраняем токен в базу данных
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        //Удаляем рефреш токен с сервера
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        //Убеждаемся, что валидация и поиск в базе данных прошли успешно
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        //Находим пользователя по id
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        //Сохраняем токен в базу данных
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        //Возвращаем абсолютно все записи пользователей
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()