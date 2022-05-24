const {Schema, model} = require('mongoose')

//Схема объясняет какие поля будет содержать сущность токена
const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
})

//ПЕрвый параметр - название модели, второй - схема
module.exports = model('Token', TokenSchema)