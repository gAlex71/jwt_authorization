// Создаем свой класс ошибок, который будет расширять родной класс JS
module.exports = class ApiError extends Error{
    status;
    errors;

    constructor(status, message, errors = []){
        super(message);
        this.status = status;
        this.errors - errors; 
    }

    //Статик функции, функции, которые можно использовать не создавая экземпляр класса
    static UnauthorizedError(){
        return new ApiError(401, 'Пользователь не авторизован')
    }
    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }
}