const {Schema, model} = require('mongoose')

//Схема объясняет какие поля будет содержать сущность пользователя
const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

//ПЕрвый параметр - название модели, второй - схема
module.exports = model('User', UserSchema)