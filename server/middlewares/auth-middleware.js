//Функция next вызывает следующий в цепочке миддлвеер
const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token-service')

module.exports = function(req, res, next){
    try{
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError())
        }

        //По первому индексу достаем токен(Bearer -[0], token - [1])
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            return next(ApiError.UnauthorizedError())
        }

        //Проверка акссес токена
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }

        //Если все проверки прошли успешно, то помещаем данные о пользователе в поле user
        req.user = userData
        next()
    } catch(e){
        return next(ApiError.UnauthorizedError())
    }
}