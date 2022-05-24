//Сервис для работы с токеном
const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService{
    //Функция генерации токенов, в параемтре указываем данные, которые вшиваются в токен
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        //Возвращаем объект, который будет содержать оба токена
        return{
            accessToken,
            refreshToken
        }
    }

    //Валидация токена
    validateAccessToken(token){
        try{
            //Верификация токена
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch(e){
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch(e){
            return null
        }
    }

    async saveToken(userId, refreshToken){
        //Находим по id токен в базе данных
        const tokenData = await tokenModel.findOne({user: userId})
        //Если в базе данных что-то нашли, то токен перезаписываем
        if(tokenData){
            tokenData.refreshToken = refreshToken
            //Сохраняем токен
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token 
    }

    //Функция удаления токена
    async removeToken(refreshToken){
        //Будет найдена запись с этим токеном и удалена
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }

    //Поиск токена в базе данных
    async findToken(refreshToken){
        //Будет найдена запись с этим токеном 
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()