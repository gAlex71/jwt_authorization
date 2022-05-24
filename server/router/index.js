const Router = require('express').Router
//Импортируем контроллер для сопоставления с маршрутами
const userController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

//Получаем эндпоинты на регистрацию, логин и т.д.
router.post('/registration',
    //Проверка эмейл на валидацию
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration)
router.post('/login', userController.login)
//эндпоинт на выход,удаляем токен
router.post('/logout', userController.logout)
//акцивация аккаунта по ссылке с почты
router.get('/activate/:link', userController.activate)
//получение токена, если умер
router.get('/refresh', userController.refresh)
//тестовый, будем получать список пользователей
router.get('/users', authMiddleware, userController.getUser)

module.exports = router