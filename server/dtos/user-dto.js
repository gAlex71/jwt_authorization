// Объект передачи данных
module.exports = class UserDto{
    email;
    id;
    isActivated;

    constructor(model){
        this.email = model.email;
        //'_ - неизменяемое поле'
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}